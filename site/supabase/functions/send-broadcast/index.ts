// ============================================================================
// HOMEWODRX — Broadcast Email Sender
// Called from admin.html Broadcast tab.
//
// Secrets required (Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY          — Resend API key
//   BROADCAST_ADMIN_SECRET  — shared secret checked on every POST request
//   BROADCAST_UNSUB_SECRET  — HMAC secret for unsubscribe tokens (same as DIGEST_UNSUB_SECRET is fine)
//
// Endpoints:
//   POST /  (header x-broadcast-secret: <BROADCAST_ADMIN_SECRET>)
//   Body: { type: "blog" | "announcement", test_email?: string, ...fields }
//
//   Blog fields:    post_title, post_url, post_excerpt, post_category, reading_time
//   Announce fields: subject, eyebrow, headline, body_html, preview_text, cta_label?, cta_url?
//
//   GET /?action=unsub&uid=<uuid>&token=<hmac>  — one-click unsubscribe
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY    = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_SECRET  = Deno.env.get("BROADCAST_ADMIN_SECRET") ?? "";
const UNSUB_SECRET  = Deno.env.get("BROADCAST_UNSUB_SECRET") ?? Deno.env.get("DIGEST_UNSUB_SECRET") ?? "";

const FROM    = "HomeWODrx <noreply@homewodrx.com>";
const BASE    = "https://homewodrx.com";
const FN_BASE = `${SUPABASE_URL}/functions/v1/send-broadcast`;

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────────────

async function hmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function unsubUrl(uid: string): Promise<string> {
  const token = await hmac(UNSUB_SECRET, uid);
  return `${FN_BASE}?action=unsub&uid=${uid}&token=${token}`;
}

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-broadcast-secret",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function html(body: string, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/html", ...CORS } });
}

// ── Unsubscribe handler ───────────────────────────────────────────────────────

async function handleUnsub(uid: string, token: string): Promise<Response> {
  const expected = await hmac(UNSUB_SECRET, uid);
  if (token !== expected) return html("<h1>Invalid unsubscribe link.</h1>", 400);

  // Determine which pref to clear (product announcements for announcement emails,
  // blog for blog emails — we clear both since unsubscribe is a global opt-out for marketing).
  await sb.from("profiles").update({
    notifications: sb.rpc ? undefined : undefined, // handled below via RPC-free approach
  });

  // Use JSONB merge to set blog=false and product=false without wiping other prefs
  const { error } = await sb.rpc("unsubscribe_marketing", { p_user_id: uid });
  if (error) {
    // Fallback: direct update (less precise but safe)
    const { data: prof } = await sb.from("profiles").select("notifications").eq("id", uid).single();
    const notif = (prof?.notifications as Record<string, boolean>) || {};
    notif.blog    = false;
    notif.product = false;
    await sb.from("profiles").update({ notifications: notif }).eq("id", uid);
  }

  return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribed — HomeWODrx</title>
<style>body{font-family:-apple-system,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#1a1a1a;padding:20px}
h1{font-size:1.6rem;margin-bottom:12px}p{color:#666;line-height:1.6}a{color:#C41212}</style></head>
<body><h1>You're unsubscribed.</h1>
<p>You've been removed from HomeWODrx marketing emails. Transactional emails (password resets, security alerts) are unaffected.</p>
<p><a href="${BASE}">← Back to HomeWODrx</a></p>
</body></html>`);
}

// ── Email builders ────────────────────────────────────────────────────────────

function blogEmail(fields: Record<string, string>, unsubLink: string): { subject: string; html: string } {
  const { post_title, post_url, post_excerpt, post_category, reading_time } = fields;
  const previewText = post_excerpt.slice(0, 140);

  const subject = `New on the blog: ${post_title}`;
  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${subject}</title>
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark}
.email-dark-logo{display:none}
@media(prefers-color-scheme:dark){
  [style*="background-color:#f3f3f3"]{background-color:#161616!important}
  [style*="background-color:#ffffff"]{background-color:#222222!important}
  [style*="background-color:#f8f8f8"]{background-color:#1e1e1e!important}
  [style*="background-color:#fdf8f0"]{background-color:#261e10!important}
  [style*="border:1px solid #e5e5e5"]{border-color:#333333!important}
  [style*="color:#1a1a1a"]{color:#f5f5f5!important}
  [style*="color:#444444"]{color:#c9c9c9!important}
  [style*="color:#666666"]{color:#a8a8a8!important}
  [style*="color:#999999"]{color:#8a8a8a!important}
  [style*="color:#C41212"]{color:#ff5a5a!important}
  .email-light-logo{display:none!important}
  .email-dark-logo{display:block!important}
}
[data-ogsc] .email-light-logo{display:none!important}
[data-ogsc] .email-dark-logo{display:block!important}
</style>
</head>
<body style="margin:0;padding:0;background-color:#f3f3f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<span style="display:none;font-size:1px;color:#f3f3f3;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f3f3;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;">
  <tr><td align="center" style="padding:36px 40px 24px;">
    <a href="${BASE}" style="text-decoration:none;">
      <img class="email-light-logo" src="${BASE}/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" width="200" style="display:block;width:200px;height:auto;border:0;"/>
      <img class="email-dark-logo" src="${BASE}/HomeWODRx-logo-white-red-black-strip-040626.png" alt="HomeWODrx" width="200" style="width:200px;height:auto;border:0;"/>
    </a>
  </td></tr>
  <tr><td style="padding:0 40px 6px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#C41212;text-transform:uppercase;letter-spacing:1.2px;">New on the Blog</p>
  </td></tr>
  <tr><td style="padding:0 40px 16px;">
    <h1 style="margin:0 0 14px;font-size:24px;font-weight:800;color:#1a1a1a;line-height:1.25;letter-spacing:-0.3px;">${post_title}</h1>
    <p style="margin:0;font-size:15px;color:#444444;line-height:1.7;">${post_excerpt}</p>
  </td></tr>
  <tr><td style="padding:0 40px 28px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background-color:#fdf8f0;border-radius:6px;padding:6px 12px;">
      <span style="font-size:12px;font-weight:600;color:#C41212;">${post_category}</span>
      <span style="font-size:12px;color:#999999;margin:0 6px;">·</span>
      <span style="font-size:12px;color:#666666;">${reading_time}</span>
    </td></tr></table>
  </td></tr>
  <tr><td align="left" style="padding:0 40px 36px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background-color:#C41212;border-radius:10px;">
      <a href="${post_url}" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:0.3px;border-radius:10px;">Read the Article →</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #e5e5e5;"></div></td></tr>
  <tr><td style="background-color:#f8f8f8;padding:22px 40px;border-top:1px solid #e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td><p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1a1a1a;">HomeWODrx</p>
          <p style="margin:0;font-size:12px;color:#666666;line-height:1.6;">Every WOD. Every Athlete. One Platform.<br><a href="${BASE}" style="color:#C41212;text-decoration:none;">homewodrx.com</a></p></td>
      <td align="right" valign="top"><p style="margin:0;font-size:11px;color:#999999;line-height:1.8;text-align:right;">You opted in to blog updates.<br><a href="${unsubLink}" style="color:#999999;text-decoration:underline;">Unsubscribe</a></p></td>
    </tr></table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, html: emailHtml };
}

function announcementEmail(fields: Record<string, string>, unsubLink: string): { subject: string; html: string } {
  const { subject, eyebrow, headline, body_html, preview_text, cta_label, cta_url } = fields;

  const ctaBlock = cta_url ? `
  <tr><td align="left" style="padding:0 40px 36px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background-color:#C41212;border-radius:10px;">
      <a href="${cta_url}" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:0.3px;border-radius:10px;">${cta_label || "Learn More"}</a>
    </td></tr></table>
  </td></tr>` : "";

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${subject}</title>
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark}
.email-dark-logo{display:none}
@media(prefers-color-scheme:dark){
  [style*="background-color:#f3f3f3"]{background-color:#161616!important}
  [style*="background-color:#ffffff"]{background-color:#222222!important}
  [style*="background-color:#f8f8f8"]{background-color:#1e1e1e!important}
  [style*="border:1px solid #e5e5e5"]{border-color:#333333!important}
  [style*="color:#1a1a1a"]{color:#f5f5f5!important}
  [style*="color:#444444"]{color:#c9c9c9!important}
  [style*="color:#666666"]{color:#a8a8a8!important}
  [style*="color:#999999"]{color:#8a8a8a!important}
  [style*="color:#C41212"]{color:#ff5a5a!important}
  .email-light-logo{display:none!important}
  .email-dark-logo{display:block!important}
}
[data-ogsc] .email-light-logo{display:none!important}
[data-ogsc] .email-dark-logo{display:block!important}
</style>
</head>
<body style="margin:0;padding:0;background-color:#f3f3f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<span style="display:none;font-size:1px;color:#f3f3f3;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preview_text || headline}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f3f3;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;">
  <tr><td align="center" style="padding:36px 40px 24px;">
    <a href="${BASE}" style="text-decoration:none;">
      <img class="email-light-logo" src="${BASE}/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" width="200" style="display:block;width:200px;height:auto;border:0;"/>
      <img class="email-dark-logo" src="${BASE}/HomeWODRx-logo-white-red-black-strip-040626.png" alt="HomeWODrx" width="200" style="width:200px;height:auto;border:0;"/>
    </a>
  </td></tr>
  <tr><td style="padding:0 40px 6px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#C41212;text-transform:uppercase;letter-spacing:1.2px;">${eyebrow}</p>
  </td></tr>
  <tr><td style="padding:0 40px 20px;">
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#1a1a1a;line-height:1.2;letter-spacing:-0.3px;">${headline}</h1>
    <div style="font-size:15px;color:#444444;line-height:1.75;">${body_html}</div>
  </td></tr>
  ${ctaBlock}
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #e5e5e5;"></div></td></tr>
  <tr><td style="background-color:#f8f8f8;padding:22px 40px;border-top:1px solid #e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td><p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1a1a1a;">HomeWODrx</p>
          <p style="margin:0;font-size:12px;color:#666666;line-height:1.6;">Every WOD. Every Athlete. One Platform.<br><a href="${BASE}" style="color:#C41212;text-decoration:none;">homewodrx.com</a></p></td>
      <td align="right" valign="top"><p style="margin:0;font-size:11px;color:#999999;line-height:1.8;text-align:right;">You opted in to product updates.<br><a href="${unsubLink}" style="color:#999999;text-decoration:underline;">Unsubscribe</a></p></td>
    </tr></table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, html: emailHtml };
}

// ── Send via Resend ───────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, emailHtml: string): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({ from: FROM, to, subject, html: emailHtml }),
  });
  return res.ok;
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // ── CORS preflight ────────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // ── Unsubscribe GET ───────────────────────────────────────────────────────
  if (req.method === "GET" && url.searchParams.get("action") === "unsub") {
    const uid   = url.searchParams.get("uid") ?? "";
    const token = url.searchParams.get("token") ?? "";
    return handleUnsub(uid, token);
  }

  // ── POST broadcast ────────────────────────────────────────────────────────
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = req.headers.get("x-broadcast-secret") ?? "";
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = await req.json().catch(() => ({})) as Record<string, string>;
  const { type, test_email } = body;

  if (type !== "blog" && type !== "announcement") {
    return json({ error: "type must be 'blog' or 'announcement'" }, 400);
  }

  // ── Test send (single email, no DB query) ─────────────────────────────────
  if (test_email) {
    const unsubLink = await unsubUrl("test-user");
    const { subject, html: emailHtml } = type === "blog"
      ? blogEmail(body, unsubLink)
      : announcementEmail(body, unsubLink);

    const ok = await sendEmail(test_email, `[TEST] ${subject}`, emailHtml);
    return json(ok ? { ok: true, sent: 1 } : { error: "Resend delivery failed" }, ok ? 200 : 500);
  }

  // ── Broadcast to subscribers ───────────────────────────────────────────────
  const notifKey = type === "blog" ? "blog" : "product";

  // Fetch all profiles with the relevant opt-in.
  // We use a raw SQL query via RPC or direct table scan with service role.
  const { data: profiles, error: dbErr } = await sb
    .from("profiles")
    .select("id, notifications")
    .not("notifications", "is", null);

  if (dbErr) return json({ error: "DB error: " + dbErr.message }, 500);

  // Filter in JS (JSONB partial index queries need an RPC; this works reliably)
  const recipients = (profiles ?? []).filter((p: { id: string; notifications: Record<string, boolean> }) => {
    const notif = p.notifications as Record<string, boolean> | null;
    if (!notif) return false;
    // Support legacy "content" key for blog pref (migration: content → blog)
    if (notifKey === "blog") return notif.blog === true || notif.content === true;
    return notif[notifKey] === true;
  });

  if (recipients.length === 0) return json({ ok: true, sent: 0, message: "No opted-in subscribers" });

  // Get auth emails for recipient IDs via service role
  // Supabase doesn't expose auth.users via the client library; use admin API
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` },
  });
  const authJson = await authRes.json() as { users?: Array<{ id: string; email: string }> };
  const emailMap = new Map<string, string>(
    (authJson.users ?? []).map((u) => [u.id, u.email])
  );

  let sent = 0;
  const errors: string[] = [];

  for (const profile of recipients) {
    const email = emailMap.get(profile.id);
    if (!email) continue;

    const unsubLink = await unsubUrl(profile.id);
    const { subject, html: emailHtml } = type === "blog"
      ? blogEmail(body, unsubLink)
      : announcementEmail(body, unsubLink);

    const ok = await sendEmail(email, subject, emailHtml);
    if (ok) sent++;
    else errors.push(profile.id);

    // Rate-limit: Resend free tier is 2 req/s — small delay between sends
    await new Promise(r => setTimeout(r, 150));
  }

  return json({
    ok: true,
    sent,
    total: recipients.length,
    errors: errors.length > 0 ? errors : undefined,
  });
});
