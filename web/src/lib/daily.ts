import "server-only";
import { cache } from "react";
import { FORMAT_LABEL, generateWorkout, type Focus, type Format, type Level } from "@/lib/generator";
import { equipmentLabel } from "@/lib/builderOptions";
import { loadMovementPool } from "@/lib/movementPool";
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
// The day's settings (level, focus, format) come from the admin's daily_wod_config;
// the workout itself comes from the shared generator, seeded by the date.

export type DailyRow = { movement: string; slug?: string; reps: string; tip?: string };

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
  bodyFocusByDay: Record<number, Focus>;
  formatByDay: Record<number, Format>;
};

const DEFAULT_CONFIG: Config = {
  equipment: ["bodyweight", "kettlebell", "dumbbell", "pullupbar", "jumprope", "resistancebands"],
  difficultyByDay: { 0: "beginner", 1: "intermediate", 2: "advanced", 3: "intermediate", 4: "advanced", 5: "advanced", 6: "intermediate" },
  bodyFocusByDay: { 0: "core", 1: "full-body", 2: "lower-body", 3: "upper-body", 4: "cardio", 5: "full-body", 6: "legs-glutes" },
  formatByDay: { 0: "circuit", 1: "amrap", 2: "fortime", 3: "emom", 4: "amrap", 5: "fortime", 6: "circuit" },
};

const loadConfig = cache(async (): Promise<Config> => {
  const { data } = await publicClient().from("daily_wod_config").select("config").maybeSingle();
  return { ...DEFAULT_CONFIG, ...((data?.config as Partial<Config>) ?? {}) };
});

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

  const workout = generateWorkout(
    await loadMovementPool(),
    { equipment: config.equipment ?? ["bodyweight"], focus: [bodyFocus], level, format: config.formatByDay[dow] ?? "amrap", minutes: 20 },
    seedForDate(date),
  );
  if (!workout) return null;
  return {
    date,
    title: "The Daily 20",
    format: workout.format,
    formatLabel: workout.formatLabel,
    description: workout.description,
    scoring: workout.scoring,
    rows: workout.rows.map((r) => ({ movement: r.movement, slug: r.slug, reps: r.reps, tip: r.tip })),
    rounds: workout.rounds,
    timeCap: workout.format === "fortime" ? 20 : undefined,
    difficulty: level,
    bodyFocus,
    equipment: workout.equipment.map(equipmentLabel),
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
