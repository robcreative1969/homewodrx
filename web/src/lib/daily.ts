import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";

// The Daily 20 and The Daily 10: one workout and one stretch routine per day, the same
// for everyone. Ported from the old site's js/daily-wod.js and js/daily-stretch.js with
// two fixes: movements and stretches are read in a fixed order (the old code's random
// database order let the same date produce different workouts), and "today" is always
// US Eastern time, as the daily email already uses.

export const DAILY_TIME_ZONE = "America/New_York";

/** Today's date in US Eastern time, as YYYY-MM-DD. */
export function todayEastern(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: DAILY_TIME_ZONE });
}

export function isDateString(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T12:00:00Z`));
}

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function seedForDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return y * 10000 + m * 100 + d;
}

function dayOfWeek(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

function seededShuffle<T>(arr: T[], rng: () => number) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── The Daily 20 ─────────────────────────────────────────────────────────────

type Level = "beginner" | "intermediate" | "advanced";
type Format = "amrap" | "emom" | "fortime" | "circuit";

type PoolMove = {
  name: string;
  tip: string;
  b: number[] | number | null;
  i: number[] | number | null;
  a: number[] | number | null;
  tags: string[];
  eq: string;
};

export type DailyRow = { movement: string; reps: string; tip?: string };

export type Daily20 = {
  date: string;
  title: string;
  format: Format;
  formatLabel: string;
  description: string;
  scoring: string;
  rows: DailyRow[];
  rounds?: number;
  timeCap?: number;
  difficulty: Level;
  bodyFocus: string;
  equipment: string[];
  isManual: boolean;
};

type Config = {
  equipment: string[];
  difficultyByDay: Record<number, Level>;
  bodyFocusByDay: Record<number, string>;
  formatByDay: Record<number, Format>;
};

const DEFAULT_CONFIG: Config = {
  equipment: ["bodyweight", "kettlebell", "dumbbell", "pullupbar", "jumprope", "resistancebands"],
  difficultyByDay: { 0: "beginner", 1: "intermediate", 2: "advanced", 3: "intermediate", 4: "advanced", 5: "advanced", 6: "intermediate" },
  bodyFocusByDay: { 0: "core", 1: "full-body", 2: "lower-body", 3: "upper-body", 4: "cardio", 5: "full-body", 6: "legs-glutes" },
  formatByDay: { 0: "circuit", 1: "amrap", 2: "fortime", 3: "emom", 4: "amrap", 5: "fortime", 6: "circuit" },
};

const FORMAT_LABEL: Record<Format, string> = { amrap: "AMRAP", emom: "EMOM", fortime: "For Time", circuit: "Circuit" };

const EQUIPMENT_LABEL: Record<string, string> = {
  kettlebell: "Kettlebell",
  dumbbell: "Dumbbells",
  pullupbar: "Pull-Up Bar",
  jumprope: "Jump Rope",
  resistancebands: "Resistance Bands",
  barbell: "Barbell",
  box: "Plyo Box",
  medicineball: "Med Ball",
  rings: "Rings",
  slamball: "Slam Ball",
  running: "Running Space",
  rower: "Rower",
  assaultbike: "Air Bike",
};

const loadConfig = cache(async (): Promise<Config> => {
  const { data } = await publicClient().from("daily_wod_config").select("config").maybeSingle();
  return { ...DEFAULT_CONFIG, ...((data?.config as Partial<Config>) ?? {}) };
});

const loadMovementPool = cache(async () => {
  const { data, error } = await publicClient()
    .from("movements")
    .select("name, equipment_category, tags, beginner_reps, intermediate_reps, advanced_reps, wod_tip")
    .eq("daily_wod_eligible", true)
    .order("name");
  if (error) throw new Error(`Could not load Daily 20 movements: ${error.message}`);
  const byEquipment: Record<string, PoolMove[]> = {};
  for (const m of data ?? []) {
    const cat = m.equipment_category || "bodyweight";
    (byEquipment[cat] ??= []).push({
      name: m.name,
      tip: m.wod_tip ?? "",
      b: m.beginner_reps,
      i: m.intermediate_reps,
      a: m.advanced_reps,
      tags: m.tags ?? [],
      eq: cat,
    });
  }
  return byEquipment;
});

function buildPool(db: Record<string, PoolMove[]>, equipment: string[], level: Level, bodyFocus: string) {
  let moves = (db.bodyweight ?? []).map((m) => ({ ...m, eq: "bodyweight" }));
  for (const eq of equipment) {
    const key = eq === "dumbbell" ? "dumbbells" : eq;
    if (eq !== "bodyweight" && db[key]) moves.push(...db[key].map((m) => ({ ...m, eq })));
  }
  moves = moves.filter((m) => !/muscle.up/i.test(m.name));
  if (level === "beginner") moves = moves.filter((m) => !/(snatch|toes.to.bar|double under|turkish)/i.test(m.name));
  if (level === "intermediate") moves = moves.filter((m) => !/(snatch|toes.to.bar|double under)/i.test(m.name));
  const focusTags: Record<string, string[] | null> = {
    "full-body": null,
    "upper-body": ["push", "pull"],
    "lower-body": ["lower", "legs-glutes"],
    core: ["core"],
    push: ["push"],
    pull: ["pull"],
    "legs-glutes": ["lower", "legs-glutes"],
    cardio: ["cardio", "full"],
  };
  const tags = focusTags[bodyFocus];
  if (tags) {
    const primary = moves.filter((m) => m.tags.some((t) => tags.includes(t)));
    if (primary.length >= 3) moves = primary;
  }
  return moves;
}

function repsFor(m: PoolMove, level: Level) {
  const r = m[level === "beginner" ? "b" : level === "intermediate" ? "i" : "a"];
  return Array.isArray(r) ? r[0] : r;
}

function balancedPick(pool: PoolMove[], count: number, rng: () => number) {
  const buckets: Record<string, PoolMove[]> = { lower: [], push: [], pull: [], core: [], full: [], other: [] };
  for (const m of pool) {
    const t = m.tags;
    if (t.includes("full")) buckets.full.push(m);
    else if (t.includes("lower")) buckets.lower.push(m);
    else if (t.includes("push")) buckets.push.push(m);
    else if (t.includes("pull")) buckets.pull.push(m);
    else if (t.includes("core")) buckets.core.push(m);
    else buckets.other.push(m);
  }
  const order =
    count >= 5 ? ["lower", "push", "pull", "core", "full"]
    : count === 4 ? ["lower", "push", "pull", "core"]
    : count === 3 ? ["lower", "push", "core"]
    : ["lower", "push"];
  const result: PoolMove[] = [];
  for (const cat of order) {
    const bucket = [...buckets[cat]];
    if (bucket.length) {
      const idx = Math.floor(rng() * bucket.length);
      result.push(bucket.splice(idx, 1)[0]);
      buckets[cat] = bucket;
    }
  }
  while (result.length < count) {
    const rest = Object.values(buckets).flat().filter((m) => !result.includes(m));
    if (!rest.length) break;
    result.push(rest[Math.floor(rng() * rest.length)]);
  }
  // At least one equipment movement when the pool has any.
  const equipInPool = pool.filter((m) => m.eq !== "bodyweight");
  if (!result.some((m) => m.eq !== "bodyweight") && equipInPool.length) {
    const pick = equipInPool[Math.floor(rng() * equipInPool.length)];
    let swap = result.findIndex((m) => m.eq === "bodyweight" && m.tags.some((t) => pick.tags.includes(t)));
    if (swap === -1) swap = result.length - 1;
    result[swap] = pick;
  }
  return result;
}

export const getDaily20 = cache(async (date: string): Promise<Daily20 | null> => {
  const { data: override } = await publicClient()
    .from("daily_wods")
    .select("workout_data")
    .eq("wod_date", date)
    .maybeSingle();
  const dow = dayOfWeek(date);
  const config = await loadConfig();
  const level = config.difficultyByDay[dow] ?? "intermediate";
  const bodyFocus = config.bodyFocusByDay[dow] ?? "full-body";

  if (override?.workout_data) {
    const w = override.workout_data as Partial<Daily20> & { rows?: DailyRow[] };
    const format = (w.format as Format) ?? "amrap";
    return {
      date,
      title: w.title ?? "The Daily 20",
      format,
      formatLabel: FORMAT_LABEL[format] ?? String(format),
      description: w.description ?? "",
      scoring: w.scoring ?? "",
      rows: w.rows ?? [],
      rounds: w.rounds,
      timeCap: w.timeCap,
      difficulty: (w.difficulty as Level) ?? level,
      bodyFocus: w.bodyFocus ?? bodyFocus,
      equipment: w.equipment ?? [],
      isManual: true,
    };
  }

  const db = await loadMovementPool();
  const rng = seededRng(seedForDate(date));
  const format = config.formatByDay[dow] ?? "amrap";
  const pool = buildPool(db, config.equipment ?? ["bodyweight"], level, bodyFocus);
  if (!pool.length) return null;
  const duration = 20;

  let picked: PoolMove[];
  let rows: DailyRow[];
  let description: string;
  let scoring: string;
  let rounds: number | undefined;
  let timeCap: number | undefined;

  if (format === "emom") {
    picked = balancedPick(pool, Math.min(4, Math.max(2, Math.floor(duration / 4))), rng);
    rows = picked.map((m, i) => {
      const raw = repsFor(m, level);
      const unit = /[a-z]/i.test(String(raw)) ? "" : " reps";
      return { movement: m.name, reps: `Minute ${i + 1}: ${raw}${unit}`, tip: m.tip };
    });
    description = `Every minute on the minute for ${duration} minutes. Do the work at the start of each minute and rest for whatever is left.`;
    scoring = "Note whether you finish each minute's work before the next one starts.";
  } else if (format === "fortime") {
    rounds = level === "advanced" ? 4 : 3;
    timeCap = 20;
    picked = balancedPick(pool, 3, rng);
    rows = picked.map((m) => ({ movement: m.name, reps: String(repsFor(m, level)), tip: m.tip }));
    description = `${rounds} rounds for time, with a 20-minute time cap.`;
    scoring = `Record your finish time. If you hit the 20-minute cap, record the rounds and reps you completed.`;
  } else if (format === "circuit") {
    const count = 5;
    rounds = 4;
    picked = balancedPick(pool, count, rng);
    rows = picked.map((m) => ({ movement: m.name, reps: String(repsFor(m, level)), tip: m.tip }));
    description = `Do all ${count} movements back to back, then rest 60 seconds. ${rounds} rounds.`;
    scoring = "Record your total time.";
  } else {
    picked = balancedPick(pool, 4, rng);
    rows = picked.map((m) => ({ movement: m.name, reps: String(repsFor(m, level)), tip: m.tip }));
    description = `As many rounds as possible in ${duration} minutes. Pick a pace you can hold from start to finish.`;
    scoring = "Record your rounds plus extra reps, for example 8 rounds + 12 reps.";
  }

  const equipment = [...new Set(picked.map((m) => m.eq).filter((e) => e !== "bodyweight"))].map(
    (e) => EQUIPMENT_LABEL[e] ?? e,
  );

  return {
    date,
    title: "The Daily 20",
    format,
    formatLabel: FORMAT_LABEL[format],
    description,
    scoring,
    rows,
    rounds,
    timeCap,
    difficulty: level,
    bodyFocus,
    equipment,
    isManual: false,
  };
});

export function bodyFocusLabel(focus: string) {
  const labels: Record<string, string> = {
    "full-body": "Full Body",
    "upper-body": "Upper Body",
    "lower-body": "Lower Body",
    core: "Core",
    cardio: "Conditioning",
    "legs-glutes": "Legs and Glutes",
    push: "Push",
    pull: "Pull",
  };
  return labels[focus] ?? focus;
}

// ── The Daily 10 ─────────────────────────────────────────────────────────────

export type Daily10Row = { name: string; slug: string; hold: number; sides: boolean; tip: string };
export type Daily10 = { date: string; label: string; rows: Daily10Row[]; totalSeconds: number; totalMin: number };

const THEMES: Record<number, { focus: string[]; label: string }> = {
  0: { focus: ["hips", "full"], label: "Full Body Recovery" },
  1: { focus: ["hips", "full"], label: "Hips and Lower Body" },
  2: { focus: ["hamstrings", "full"], label: "Hamstrings and Posterior Chain" },
  3: { focus: ["shoulders", "chest", "full"], label: "Shoulders and Upper Back" },
  4: { focus: ["hips", "back", "full"], label: "Hip and Thoracic Reset" },
  5: { focus: ["full"], label: "Full Body Flush" },
  6: { focus: ["hamstrings", "hips", "full"], label: "Recovery and Mobility" },
};

export const getDaily10 = cache(async (date: string): Promise<Daily10 | null> => {
  const { data, error } = await publicClient()
    .from("stretches")
    .select("name, slug, focus, sides, hold_intermediate, tip")
    .order("name");
  if (error) throw new Error(`Could not load stretches: ${error.message}`);
  const stretches = data ?? [];
  if (!stretches.length) return null;

  const theme = THEMES[dayOfWeek(date)] ?? THEMES[0];
  const rng = seededRng(seedForDate(date));
  const focused = stretches.filter((s) => theme.focus.some((f) => (s.focus ?? []).includes(f)));
  const others = stretches.filter((s) => !focused.includes(s));
  const pool = focused.length >= 5 ? focused : [...focused, ...others];
  const shuffled = seededShuffle(pool, rng);

  const TARGET = 600;
  const selected: typeof stretches = [];
  let total = 0;
  for (const s of shuffled) {
    if (selected.length >= 8) break;
    const hold = s.hold_intermediate || 40;
    const effective = s.sides ? hold * 2 : hold;
    if (total + effective > TARGET + 120) break;
    selected.push(s);
    total += effective;
    if (total >= TARGET && selected.length >= 5) break;
  }
  while (selected.length < 5 && selected.length < shuffled.length) {
    const next = shuffled.find((s) => !selected.includes(s));
    if (!next) break;
    selected.push(next);
    total += (next.sides ? 2 : 1) * (next.hold_intermediate || 40);
  }

  return {
    date,
    label: theme.label,
    rows: selected.map((s) => ({
      name: s.name,
      slug: s.slug,
      hold: s.hold_intermediate || 40,
      sides: !!s.sides,
      tip: s.tip ?? "",
    })),
    totalSeconds: total,
    totalMin: Math.round(total / 60),
  };
});

export function formatLongDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
