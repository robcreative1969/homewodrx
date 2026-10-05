import type { Focus, Format, GeneratorOptions, Level } from "@/lib/generator";

// The WOD Builder's choices. A built workout lives in its link:
// /wodbuilder?eq=kettlebell,pullupbar&focus=full-body&fmt=amrap&lvl=intermediate&t=20&seed=123456

export const EQUIPMENT = [
  { code: "pullupbar", label: "Pull-Up Bar" },
  { code: "kettlebell", label: "Kettlebell" },
  { code: "dumbbells", label: "Dumbbells" },
  { code: "barbell", label: "Barbell" },
  { code: "resistancebands", label: "Bands" },
  { code: "jumprope", label: "Jump Rope" },
  { code: "box", label: "Plyo Box" },
  { code: "medicineball", label: "Med Ball" },
  { code: "rings", label: "Rings" },
  { code: "slamball", label: "Slam Ball" },
  { code: "running", label: "Running Space" },
  { code: "rower", label: "Rower" },
  { code: "airbike", label: "Air Bike" },
] as const;

export const FOCUSES: { code: Focus; label: string }[] = [
  { code: "full-body", label: "Full Body" },
  { code: "upper-body", label: "Upper Body" },
  { code: "lower-body", label: "Lower Body" },
  { code: "core", label: "Core" },
  { code: "cardio", label: "Conditioning" },
];

export const FORMATS: { code: Format | "any"; label: string }[] = [
  { code: "any", label: "Surprise me" },
  { code: "amrap", label: "AMRAP" },
  { code: "emom", label: "EMOM" },
  { code: "fortime", label: "For Time" },
  { code: "circuit", label: "Circuit" },
  { code: "tabata", label: "Tabata" },
];

export const LEVELS: { code: Level; label: string }[] = [
  { code: "beginner", label: "Beginner" },
  { code: "intermediate", label: "Intermediate" },
  { code: "advanced", label: "Advanced" },
];

// Rob's decision (REBUILD-PLAN.md §7): 10, 20, 30, 45 and 60 minutes.
export const MINUTES = [10, 20, 30, 45, 60] as const;

const EQUIPMENT_LABELS: Record<string, string> = {
  ...Object.fromEntries(EQUIPMENT.map((e) => [e.code, e.label])),
  dumbbell: "Dumbbells",
  assaultbike: "Air Bike",
  dipbar: "Dip Bars",
  rope: "Climbing Rope",
};

export function equipmentLabel(code: string) {
  return EQUIPMENT_LABELS[code] ?? code;
}

export type BuilderParams = GeneratorOptions & { seed: number | null };

type Search = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
// The form sends ?eq=a&eq=b; shared links use ?eq=a,b. Accept both.
const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []).flatMap((x) => x.split(","));

/** Reads builder choices from the link; anything unknown falls back to a sensible default. */
export function parseBuilderParams(sp: Search): BuilderParams | null {
  if (first(sp.t) === undefined && first(sp.eq) === undefined) return null;
  const known = new Set<string>(EQUIPMENT.map((e) => e.code));
  const equipment = ["bodyweight", ...list(sp.eq).filter((c) => known.has(c))];
  const focusCodes = new Set(FOCUSES.map((f) => f.code));
  let focus = list(sp.focus).filter((f): f is Focus => focusCodes.has(f as Focus));
  if (!focus.length || focus.includes("full-body")) focus = ["full-body"];
  const fmt = first(sp.fmt);
  const format = FORMATS.some((f) => f.code === fmt) ? (fmt as Format | "any") : "any";
  const lvl = first(sp.lvl);
  const level = LEVELS.some((l) => l.code === lvl) ? (lvl as Level) : "intermediate";
  const t = Number(first(sp.t));
  const minutes = (MINUTES as readonly number[]).includes(t) ? t : 20;
  const seedRaw = Number(first(sp.seed));
  const seed = Number.isInteger(seedRaw) && seedRaw > 0 ? seedRaw : null;
  const tab = first(sp.tab) === "rotating" ? "rotating" : "sequential";
  return { equipment, focus, format, level, minutes, seed, tabataStructure: tab };
}

/** The query string for a set of choices (without leading "?"). */
export function builderQuery(p: BuilderParams, seed: number | null = p.seed) {
  const q = new URLSearchParams();
  const eq = p.equipment.filter((e) => e !== "bodyweight");
  if (eq.length) q.set("eq", eq.join(","));
  q.set("focus", p.focus.join(","));
  q.set("fmt", p.format);
  q.set("lvl", p.level);
  q.set("t", String(p.minutes));
  if (p.format === "tabata" && p.tabataStructure === "rotating") q.set("tab", "rotating");
  if (seed) q.set("seed", String(seed));
  return q.toString().replace(/%2C/g, ",");
}

export function newSeed() {
  return Math.floor(Math.random() * 2_000_000_000) + 1;
}
