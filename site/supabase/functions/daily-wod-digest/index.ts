// ============================================================================
// HOMEWODRX — Daily WOD Digest Email
// Scheduled via pg_cron (10:00 UTC daily) → sends today's Daily 20 to every
// user with notifications.daily = true. Also handles one-click unsubscribe.
//
// ⚠️  SYNC WARNING: The workout-generation logic below is a direct port of
//     js/daily-wod.js (DailyWOD.generate). If you change the algorithm there,
//     change it HERE too, or the email will show a different workout than
//     the site.
//
// Secrets required (Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY       — Resend API key
//   DIGEST_CRON_SECRET   — shared secret checked on POST (must match cron job)
//   DIGEST_UNSUB_SECRET  — HMAC secret for unsubscribe tokens
//
// Endpoints:
//   POST /  (header x-cron-secret) — generate + send digest
//        optional JSON body: { "date": "YYYY-MM-DD", "test_email": "a@b.com" }
//   GET  /?action=unsub&uid=<uuid>&token=<hmac> — unsubscribe + HTML confirm
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY   = Deno.env.get("RESEND_API_KEY") ?? "";
const CRON_SECRET  = Deno.env.get("DIGEST_CRON_SECRET") ?? "";
const UNSUB_SECRET = Deno.env.get("DIGEST_UNSUB_SECRET") ?? "";

const FROM    = "HomeWODrx <noreply@homewodrx.com>";
const BASE    = "https://homewodrx.com";
const FN_BASE = `${SUPABASE_URL}/functions/v1/daily-wod-digest`;

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

// ───────────────────────────────────────────────────────────────────────────
// WORKOUT GENERATION — ported from js/daily-wod.js (keep in sync!)
// ───────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Record<string, unknown> = {
  equipment: ["bodyweight", "kettlebell", "dumbbell", "pullupbar", "jumprope", "resistancebands"],
  difficultyByDay: { 0: "beginner", 1: "intermediate", 2: "advanced", 3: "intermediate", 4: "advanced", 5: "advanced", 6: "intermediate" },
  bodyFocusByDay:  { 0: "core", 1: "full-body", 2: "lower-body", 3: "upper-body", 4: "cardio", 5: "full-body", 6: "legs-glutes" },
  formatByDay:     { 0: "circuit", 1: "amrap", 2: "fortime", 3: "emom", 4: "amrap", 5: "fortime", 6: "circuit" },
  durationByDay:   { 0: [20, 20], 1: [20, 20], 2: [20, 20], 3: [20, 20], 4: [20, 20], 5: [20, 20], 6: [20, 20] },
};

// deno-lint-ignore no-explicit-any
type Move = any;

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function getSeedForDate(dateStr: string) {
  const [y, m, day] = dateStr.split("-").map(Number);
  return y * 10000 + m * 100 + day;
}

async function loadMovements(): Promise<Record<string, Move[]>> {
  const { data, error } = await sb
    .from("movements")
    .select("name, equipment_category, tags, beginner_reps, intermediate_reps, advanced_reps, wod_tip, timed")
    .eq("daily_wod_eligible", true);
  if (error || !data || data.length === 0) throw new Error("Could not load movements: " + (error?.message ?? "empty"));
  const db: Record<string, Move[]> = {};
  data.forEach((m: Move) => {
    const cat = m.equipment_category || "bodyweight";
    if (!db[cat]) db[cat] = [];
    db[cat].push({
      name: m.name,
      tip: m.wod_tip || "",
      b: m.beginner_reps,
      i: m.intermediate_reps,
      a: m.advanced_reps,
      tags: m.tags || [],
      timed: m.timed || false,
    });
  });
  return db;
}

async function getConfig(): Promise<Record<string, unknown>> {
  const { data } = await sb.from("daily_wod_config").select("*").single();
  if (data) return { ...DEFAULT_CONFIG, ...(data as Move).config };
  return DEFAULT_CONFIG;
}

async function getManualOverride(dateStr: string): Promise<Move | null> {
  const { data } = await sb.from("daily_wods").select("*").eq("wod_date", dateStr).maybeSingle();
  return (data as Move)?.workout_data ?? null;
}

function buildPool(equipment: string[], level: string, bodyFocus: string, mdb: Record<string, Move[]>): Move[] {
  if (!mdb || Object.keys(mdb).length === 0) return [];
  let moves: Move[] = (mdb.bodyweight || []).map((m) => ({ ...m, _eq: "bodyweight" }));
  equipment.forEach((eq) => {
    const key = eq === "dumbbell" ? "dumbbells" : eq;
    if (eq !== "bodyweight" && mdb[key]) moves.push(...mdb[key].map((m) => ({ ...m, _eq: eq })));
  });
  moves = moves.filter((m) => !/(muscle.up)/i.test(m.name));
  if (level === "beginner") moves = moves.filter((m) => !/(snatch|toes.to.bar|double under|turkish)/i.test(m.name));
  if (level === "intermediate") moves = moves.filter((m) => !/(snatch|toes.to.bar|double under)/i.test(m.name));

  const BF_TAGS: Record<string, string[] | null> = {
    "full-body": null,
    "upper-body": ["push", "pull"],
    "lower-body": ["lower", "legs-glutes"],
    "core": ["core"],
    "push": ["push"],
    "pull": ["pull"],
    "legs-glutes": ["lower", "legs-glutes"],
    "cardio": ["cardio", "full"],
  };
  const tags = BF_TAGS[bodyFocus];
  if (tags) {
    const primary = moves.filter((m) => m.tags && m.tags.some((t: string) => tags.includes(t)));
    if (primary.length >= 3) moves = primary;
  }
  return moves;
}

function getReps(m: Move, level: string) {
  const r = m[level === "beginner" ? "b" : level === "intermediate" ? "i" : "a"];
  if (Array.isArray(r)) return r[0];
  return r;
}

function balancedPick(pool: Move[], count: number, rng: () => number): Move[] {
  const buckets: Record<string, Move[]> = { lower: [], push: [], pull: [], core: [], full: [], other: [] };
  pool.forEach((m) => {
    const t = m.tags || [];
    if (t.includes("full")) buckets.full.push(m);
    else if (t.includes("lower")) buckets.lower.push(m);
    else if (t.includes("push")) buckets.push.push(m);
    else if (t.includes("pull")) buckets.pull.push(m);
    else if (t.includes("core")) buckets.core.push(m);
    else buckets.other.push(m);
  });
  const order = count >= 5 ? ["lower", "push", "pull", "core", "full"]
    : count === 4 ? ["lower", "push", "pull", "core"]
    : count === 3 ? ["lower", "push", "core"]
    : ["lower", "push"];
  const result: Move[] = [];
  order.forEach((cat) => {
    const bk = [...buckets[cat]];
    if (bk.length) {
      const idx = Math.floor(rng() * bk.length);
      result.push(bk.splice(idx, 1)[0]);
      buckets[cat] = bk;
    }
  });
  while (result.length < count) {
    const rem = Object.values(buckets).flat().filter((m) => !result.includes(m));
    if (!rem.length) break;
    result.push(rem[Math.floor(rng() * rem.length)]);
  }

  const hasEquipInResult = result.some((m) => m._eq && m._eq !== "bodyweight");
  const equipInPool = pool.filter((m) => m._eq && m._eq !== "bodyweight");
  if (!hasEquipInResult && equipInPool.length > 0) {
    const eqPick = equipInPool[Math.floor(rng() * equipInPool.length)];
    const eqTags = eqPick.tags || [];
    let swapIdx = result.findIndex((m) => m._eq === "bodyweight" && m.tags && m.tags.some((t: string) => eqTags.includes(t)));
    if (swapIdx === -1) swapIdx = result.length - 1;
    result[swapIdx] = eqPick;
  }
  return result;
}

function genAMRAP(pool: Move[], level: string, duration: number, rng: () => number) {
  const count = duration <= 15 ? 3 : duration <= 25 ? 4 : 5;
  const sel = balancedPick(pool, count, rng);
  return {
    title: "Daily 20: AMRAP",
    format: "amrap",
    description: `Complete as many rounds as possible in ${duration} minutes. Pace yourself — the goal is consistent rounds from start to finish.`,
    rows: sel.map((m) => ({ movement: m.name, reps: String(getReps(m, level)), tip: m.tip, _eq: m._eq })),
    scoring: 'Record total rounds + reps (e.g. "8 rounds + 12 reps").',
  };
}

function genEMOM(pool: Move[], level: string, duration: number, rng: () => number) {
  const movCount = Math.min(4, Math.max(2, Math.floor(duration / 4)));
  const sel = balancedPick(pool, movCount, rng);
  return {
    title: "Daily 20: EMOM",
    format: "emom",
    description: `Every Minute On the Minute for ${duration} minutes. Complete the designated work at the top of each minute; rest whatever remains.`,
    rows: sel.map((m, i) => {
      const raw = getReps(m, level);
      const unit = /[a-zA-Z]/.test(String(raw)) ? "" : " reps";
      return { movement: m.name, reps: `Min ${i + 1} (repeat): ${raw}${unit}`, tip: m.tip, _eq: m._eq };
    }),
    scoring: "Track whether you finish each minute before the next starts.",
  };
}

function genForTime(pool: Move[], level: string, rng: () => number) {
  const rounds = level === "advanced" ? 4 : 3;
  const sel = balancedPick(pool, 3, rng);
  return {
    title: "Daily 20: For Time",
    format: "fortime",
    timeCap: 20,
    rounds,
    description: `Complete ${rounds} rounds for time. 20-minute time cap — if you hit the cap, record your reps completed.`,
    rows: sel.map((m) => ({ movement: m.name, reps: String(getReps(m, level)), tip: m.tip, _eq: m._eq })),
    scoring: `Record your finish time (${rounds} rounds). If you hit the 20-min cap, record rounds + reps completed.`,
  };
}

function genCircuit(pool: Move[], level: string, duration: number, rng: () => number) {
  const movCount = duration <= 15 ? 4 : duration <= 30 ? 5 : 6;
  const rounds = duration <= 15 ? 3 : duration <= 30 ? 4 : 5;
  const sel = balancedPick(pool, movCount, rng);
  return {
    title: "Daily 20: Circuit",
    format: "circuit",
    description: `Complete all ${movCount} movements back-to-back with minimal rest. Rest 60 seconds between rounds. ${rounds} rounds total.`,
    rows: sel.map((m) => ({ movement: m.name, reps: String(getReps(m, level)), tip: m.tip, _eq: m._eq })),
    scoring: "Record total time and round splits.",
  };
}

async function generate(dateStr: string): Promise<Move> {
  const override = await getManualOverride(dateStr);
  if (override) return { ...override, duration: 20, isManual: true, date: dateStr };

  const [config, movementDB] = await Promise.all([getConfig(), loadMovements()]);
  const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();
  const rng = seededRng(getSeedForDate(dateStr));

  const cfg = config as Move;
  const difficulty = cfg.difficultyByDay[dayOfWeek] || "intermediate";
  const bodyFocus  = cfg.bodyFocusByDay[dayOfWeek] || "full-body";
  const format     = cfg.formatByDay[dayOfWeek] || "amrap";
  const duration   = 20;
  const equipment  = cfg.equipment || ["bodyweight"];

  const pool = buildPool(equipment, difficulty, bodyFocus, movementDB);

  let workout: Move;
  if (format === "amrap") workout = genAMRAP(pool, difficulty, duration, rng);
  else if (format === "emom") workout = genEMOM(pool, difficulty, duration, rng);
  else if (format === "fortime") workout = genForTime(pool, difficulty, rng);
  else workout = genCircuit(pool, difficulty, duration, rng);

  const EQUIPMENT_LABELS: Record<string, string> = {
    bodyweight: "Bodyweight", kettlebell: "Kettlebell", dumbbell: "Dumbbell",
    pullupbar: "Pull-Up Bar", jumprope: "Jump Rope", resistancebands: "Resistance Bands",
    barbell: "Barbell", box: "Box", medicineball: "Medicine Ball", rings: "Rings",
    slamball: "Slam Ball", running: "Treadmill", rower: "Rowing Machine", assaultbike: "Assault Bike",
  };
  const usedEqKeys = [...new Set((workout.rows || []).map((r: Move) => r._eq).filter(Boolean))] as string[];
  const usedEquipment = usedEqKeys.filter((k) => k !== "bodyweight").map((k) => EQUIPMENT_LABELS[k] || k);
  if (workout.rows) workout.rows.forEach((r: Move) => delete r._eq);

  return { ...workout, date: dateStr, difficulty, bodyFocus, equipment: usedEquipment, duration, isManual: false };
}

// ───────────────────────────────────────────────────────────────────────────
// UNSUBSCRIBE TOKENS (HMAC-SHA256 of uid)
// ───────────────────────────────────────────────────────────────────────────

async function hmacHex(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(UNSUB_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ───────────────────────────────────────────────────────────────────────────
// EMAIL HTML
// ───────────────────────────────────────────────────────────────────────────

const FMT_LABEL: Record<string, string> = { amrap: "AMRAP", emom: "EMOM", fortime: "For Time", circuit: "Circuit" };
const FOCUS_LABEL: Record<string, string> = {
  "full-body": "Full Body", "upper-body": "Upper Body", "lower-body": "Lower Body",
  "core": "Core", "cardio": "Conditioning", "legs-glutes": "Legs & Glutes",
};
const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildEmailHtml(wod: Move, dateStr: string, firstName: string | null, unsubUrl: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const dateLabel = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hi = firstName ? `Hey ${esc(firstName)} —` : "Hey —";
  const fmt = FMT_LABEL[wod.format] || cap(wod.format || "");
  const focus = FOCUS_LABEL[wod.bodyFocus] || cap(wod.bodyFocus || "");
  const equip = (wod.equipment && wod.equipment.length) ? wod.equipment.join(" · ") : "No Equipment";

  const movementRows = (wod.rows || []).map((r: Move, i: number) => `
    <tr class="${i === 0 ? "" : "mv-row"}">
      <td class="mv-name" style="padding:11px 14px;border-top:${i === 0 ? "none" : "1px solid #eeeeee"};font-size:14px;font-weight:700;color:#1a1a1a;">${esc(r.movement)}</td>
      <td align="right" class="mv-reps" style="padding:11px 14px;border-top:${i === 0 ? "none" : "1px solid #eeeeee"};font-size:14px;color:#C41212;font-weight:800;white-space:nowrap;">${esc(r.reps)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>The Daily 20 — ${esc(dateLabel)}</title>
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    .dark-logo { display:none; }
    @media (prefers-color-scheme: dark) {
      .bg-page      { background-color:#161616 !important; }
      .card         { background-color:#222222 !important; border-color:#333333 !important; }
      .text-head    { color:#f5f5f5 !important; }
      .text-body    { color:#c9c9c9 !important; }
      .text-eyebrow { color:#ff5a5a !important; }
      .meta-box     { background-color:#2a2a2a !important; border-color:#3a3a3a !important; color:#b0b0b0 !important; }
      .meta-strong  { color:#f0f0f0 !important; }
      .mv-table     { border-color:#3a3a3a !important; }
      .mv-row       { border-top-color:#333333 !important; }
      .mv-name      { color:#f0f0f0 !important; }
      .mv-reps      { color:#ff5a5a !important; }
      .divider      { border-top-color:#333333 !important; }
      .scoring      { color:#b0b0b0 !important; }
      .scoring-strong { color:#f0f0f0 !important; }
      .light-logo   { display:none !important; }
      .dark-logo    { display:block !important; }
    }
    [data-ogsc] .light-logo { display:none !important; }
    [data-ogsc] .dark-logo  { display:block !important; }
  </style>
</head>
<body class="bg-page" style="margin:0;padding:0;background-color:#f3f3f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:#f3f3f3;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(fmt)} · ${esc(focus)} · 20 minutes. Your Daily 20 for ${esc(dateLabel)} is ready.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:#f3f3f3;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;">
        <tr><td align="center" style="padding:36px 40px 20px;">
          <a href="${BASE}" style="text-decoration:none;">
            <img class="light-logo" src="${BASE}/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" width="200" style="display:block;width:200px;height:auto;border:0;"/>
            <img class="dark-logo" src="${BASE}/HomeWODRx-logo-white-red-black-strip-040626.png" alt="HomeWODrx" width="200" style="width:200px;height:auto;border:0;"/>
          </a>
        </td></tr>
        <tr><td style="padding:0 40px 6px;">
          <p class="text-eyebrow" style="margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#C41212;">The Daily 20 · ${esc(dateLabel)}</p>
          <h1 class="text-head" style="margin:0 0 10px;font-size:26px;font-weight:800;color:#1a1a1a;line-height:1.2;letter-spacing:-0.3px;">${esc(wod.title || "Daily 20")}</h1>
          <p class="text-body" style="margin:0 0 18px;font-size:15px;color:#444444;line-height:1.7;">${hi} today's workout is ready. ${esc(wod.description || "")}</p>
        </td></tr>
        <tr><td style="padding:0 40px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="meta-box" style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:10px;padding:10px 14px;font-size:12px;color:#666666;">
                <strong class="meta-strong" style="color:#1a1a1a;">${esc(fmt)}</strong> &nbsp;·&nbsp; ${esc(focus)} &nbsp;·&nbsp; ${cap(esc(wod.difficulty || ""))} &nbsp;·&nbsp; 20 min &nbsp;·&nbsp; ${esc(equip)}
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="mv-table" style="border:1px solid #e5e5e5;border-radius:10px;overflow:hidden;">
            ${movementRows}
          </table>
          ${wod.scoring ? `<p class="scoring" style="margin:12px 0 0;font-size:12px;color:#666666;line-height:1.6;"><strong class="scoring-strong" style="color:#1a1a1a;">Scoring:</strong> ${esc(wod.scoring)}</p>` : ""}
        </td></tr>
        <tr><td align="center" style="padding:0 40px 30px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background-color:#C41212;border-radius:10px;">
              <a href="${BASE}/daily-wod" style="display:inline-block;padding:16px 44px;font-size:16px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:0.3px;border-radius:10px;">Start Today's Workout</a>
            </td></tr>
          </table>
          <p class="text-body" style="margin:14px 0 0;font-size:12px;color:#888888;">Pair it with <a href="${BASE}/stretchbuilder" style="color:#C41212;font-weight:600;">The Daily 10 stretch</a> when you're done.</p>
        </td></tr>
        <tr><td style="padding:0 40px;"><div class="divider" style="border-top:1px solid #e5e5e5;"></div></td></tr>
        <tr><td align="center" style="padding:20px 40px 30px;">
          <p style="margin:0 0 6px;font-size:11px;color:#999999;line-height:1.6;">
            You're receiving this because Daily WOD Digest is turned on in your HomeWODrx settings.
          </p>
          <p style="margin:0;font-size:11px;color:#999999;">
            <a href="${BASE}/settings#notifications" style="color:#888888;">Manage email preferences</a> &nbsp;·&nbsp;
            <a href="${unsubUrl}" style="color:#888888;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:11px;color:#aaaaaa;">© ${new Date().getFullYear()} HomeWodRX · <a href="${BASE}" style="color:#aaaaaa;">homewodrx.com</a></p>
    </td></tr>
  </table>
</body>
</html>`;
}

// ───────────────────────────────────────────────────────────────────────────
// HANDLERS
// ───────────────────────────────────────────────────────────────────────────

async function handleUnsubscribe(url: URL): Promise<Response> {
  const uid = url.searchParams.get("uid") ?? "";
  const token = url.searchParams.get("token") ?? "";
  const ok = !!(UNSUB_SECRET && uid && token) && token === (await hmacHex(uid));
  let body: string;
  if (!ok) {
    body = "<h1>Invalid link</h1><p>This unsubscribe link is invalid or expired. You can manage email preferences in your <a href='https://homewodrx.com/settings'>account settings</a>.</p>";
  } else {
    const { data } = await sb.from("profiles").select("notifications").eq("id", uid).maybeSingle();
    const notif = { ...((data as Move)?.notifications ?? {}), daily: false };
    await sb.from("profiles").update({ notifications: notif }).eq("id", uid);
    body = "<h1>You're unsubscribed</h1><p>You won't receive the Daily WOD Digest anymore. Changed your mind? Turn it back on in <a href='https://homewodrx.com/settings'>Settings → Notifications</a>.</p>";
  }
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HomeWODrx</title></head>
     <body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f3f3f3;margin:0;padding:60px 16px;text-align:center;">
     <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:40px 32px;">
     <img src="https://homewodrx.com/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" width="180" style="margin-bottom:24px;"/>${body}</div></body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

async function handleSend(req: Request): Promise<Response> {
  if (!CRON_SECRET || req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (!RESEND_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  let body: Move = {};
  try { body = await req.json(); } catch { /* empty body is fine */ }

  // "Today" in US Eastern time — matches when US users open the site
  const dateStr: string = body.date ||
    new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

  const wod = await generate(dateStr);

  // Recipients
  let recipients: { user_id: string; email: string; first_name: string | null }[];
  if (body.test_email) {
    recipients = [{ user_id: "test", email: body.test_email, first_name: "Test" }];
  } else {
    const { data, error } = await sb.rpc("get_digest_recipients");
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    recipients = data ?? [];
  }

  const d = new Date(dateStr + "T12:00:00");
  const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
  const subject = `Your Daily 20 for ${dayName}: ${FMT_LABEL[wod.format] || "WOD"} · ${FOCUS_LABEL[wod.bodyFocus] || ""}`.trim();

  let sent = 0;
  const errors: string[] = [];
  for (const r of recipients) {
    try {
      const token = await hmacHex(r.user_id);
      const unsubUrl = `${FN_BASE}?action=unsub&uid=${encodeURIComponent(r.user_id)}&token=${token}`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [r.email],
          subject,
          html: buildEmailHtml(wod, dateStr, r.first_name, unsubUrl),
        }),
      });
      if (!res.ok) errors.push(`${r.email}: ${res.status} ${await res.text()}`);
      else sent++;
      // Resend free tier rate limit ≈ 2 req/s
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (e) {
      errors.push(`${r.email}: ${(e as Error).message}`);
    }
  }

  return new Response(
    JSON.stringify({ date: dateStr, title: wod.title, recipients: recipients.length, sent, errors }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    if (req.method === "GET" && url.searchParams.get("action") === "unsub") return await handleUnsubscribe(url);
    if (req.method === "POST") return await handleSend(req);
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
