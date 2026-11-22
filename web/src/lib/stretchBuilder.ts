import { seededRng } from "@/lib/generator";
import type { StretchStep } from "@/lib/stretchSession";

// The Stretch Builder. Like the WOD Builder, a built routine lives in its link:
// /stretchbuilder?focus=hips,back&type=static,yoga&lvl=i&t=10&seed=123456
// The same stretches, choices and seed always give the same routine.

export const STRETCH_FOCUSES = [
  { code: "full", label: "Full Body" },
  { code: "neck", label: "Neck" },
  { code: "hips", label: "Hips" },
  { code: "back", label: "Back" },
  { code: "shoulders", label: "Shoulders" },
  { code: "hamstrings", label: "Hamstrings" },
  { code: "chest", label: "Chest" },
  { code: "calves", label: "Calves" },
  { code: "quads", label: "Quads" },
  { code: "wrists", label: "Wrists" },
] as const;

// Moving stretches first to warm up, long holds last to settle down.
export const STRETCH_TYPES = [
  { code: "dynamic", label: "Dynamic", help: "Moving stretches; good before training" },
  { code: "yoga", label: "Yoga", help: "Flowing poses" },
  { code: "pnf", label: "PNF", help: "Contract, then relax deeper" },
  { code: "static", label: "Static", help: "Steady holds; good after training" },
] as const;

export const STRETCH_LEVELS = [
  { code: "b", label: "Beginner" },
  { code: "i", label: "Intermediate" },
  { code: "a", label: "Advanced" },
] as const;

export const STRETCH_MINUTES = [5, 10, 15, 20, 30] as const;

export type StretchLevel = (typeof STRETCH_LEVELS)[number]["code"];

export type StretchBuilderParams = {
  focus: string[];
  types: string[];
  level: StretchLevel;
  minutes: number;
  seed: number | null;
};

/** The fields the builder needs from each stretch. */
export type PoolStretch = {
  name: string;
  slug: string;
  modality: string | null;
  focus: string[] | null;
  level: string[] | null;
  sides: boolean | null;
  hold_beginner: number | null;
  hold_intermediate: number | null;
  hold_advanced: number | null;
  tip: string | null;
};

type Search = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []).flatMap((x) => x.split(","));

/** Reads the choices from the link; null when nothing has been chosen yet. */
export function parseStretchParams(sp: Search): StretchBuilderParams | null {
  if (first(sp.t) === undefined) return null;
  const focusCodes = new Set<string>(STRETCH_FOCUSES.map((f) => f.code));
  let focus = list(sp.focus).filter((f) => focusCodes.has(f));
  // Specific areas win over Full Body when both arrive (e.g. without JavaScript).
  focus = focus.filter((f) => f !== "full");
  if (!focus.length) focus = ["full"];
  const typeCodes = new Set<string>(STRETCH_TYPES.map((t) => t.code));
  let types = list(sp.type).filter((t) => typeCodes.has(t));
  if (!types.length) types = STRETCH_TYPES.map((t) => t.code);
  const lvl = first(sp.lvl);
  const level = STRETCH_LEVELS.some((l) => l.code === lvl) ? (lvl as StretchLevel) : "i";
  const t = Number(first(sp.t));
  const minutes = (STRETCH_MINUTES as readonly number[]).includes(t) ? t : 10;
  const seedRaw = Number(first(sp.seed));
  const seed = Number.isInteger(seedRaw) && seedRaw > 0 ? seedRaw : null;
  return { focus, types, level, minutes, seed };
}

export function stretchQuery(p: StretchBuilderParams, seed: number | null = p.seed) {
  const q = new URLSearchParams();
  q.set("focus", p.focus.join(","));
  if (p.types.length < STRETCH_TYPES.length) q.set("type", p.types.join(","));
  q.set("lvl", p.level);
  q.set("t", String(p.minutes));
  if (seed) q.set("seed", String(seed));
  return q.toString().replace(/%2C/g, ",");
}

// Stretches without hold times are done for reps, at about 4 seconds a rep.
const REPS: Record<StretchLevel, number> = { b: 8, i: 10, a: 12 };
const SECONDS_PER_REP = 4;
// Time to get into position, and to change sides.
export const SETUP_SECONDS = 10;
export const SWITCH_SECONDS = 5;

function holdFor(s: PoolStretch, level: StretchLevel) {
  const h = level === "b" ? s.hold_beginner : level === "a" ? s.hold_advanced : s.hold_intermediate;
  return h ?? s.hold_intermediate ?? s.hold_beginner ?? null;
}

function toStep(s: PoolStretch, level: StretchLevel): StretchStep {
  const hold = holdFor(s, level);
  const sides = !!s.sides;
  if (hold) {
    return { name: s.name, slug: s.slug, seconds: hold, sides, dose: `${hold} seconds${sides ? " each side" : ""}`, tip: s.tip };
  }
  const reps = REPS[level];
  return { name: s.name, slug: s.slug, seconds: null, sides, dose: `${reps} reps${sides ? " each side" : ""}`, estimate: reps * SECONDS_PER_REP, tip: s.tip };
}

/** Seconds a step takes, including getting into position. */
export function stepSeconds(step: StretchStep) {
  const work = step.seconds ?? step.estimate ?? 30;
  return SETUP_SECONDS + (step.sides ? work * 2 + SWITCH_SECONDS : work);
}

export type BuiltStretchRoutine = {
  title: string;
  steps: StretchStep[];
  minutes: number;
  /** How many full-body stretches were added because the chosen areas ran out. */
  extras: number;
};

export function buildStretchRoutine(all: PoolStretch[], p: StretchBuilderParams, seed: number): BuiltStretchRoutine | null {
  const rng = seededRng(seed);
  const wide = p.focus.includes("full");
  const usable = all.filter(
    (s) => s.modality && p.types.includes(s.modality) && (!s.level?.length || s.level.includes(p.level)),
  );
  const matches = (s: PoolStretch) => wide || (s.focus ?? []).some((f) => p.focus.includes(f));
  // Some areas have only a few stretches; general full-body ones fill the rest of the time.
  const focused = usable.filter(matches);
  const fillers = wide ? [] : usable.filter((s) => !matches(s) && (s.focus ?? []).includes("full"));
  if (!focused.length) return null;

  const shuffle = (list: PoolStretch[]) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const first = shuffle(focused);
  const rest = shuffle(fillers);
  const target = p.minutes * 60;
  const chosen: PoolStretch[] = [];
  let total = 0;
  const add = (s: PoolStretch) => {
    chosen.push(s);
    total += stepSeconds(toStep(s, p.level));
  };
  // At least one stretch for each chosen area when there is one.
  if (!wide) {
    for (const f of p.focus) {
      const s = first.find((x) => !chosen.includes(x) && (x.focus ?? []).includes(f));
      if (s && total < target) add(s);
    }
  }
  for (const s of [...first, ...rest]) {
    if (total >= target) break;
    if (chosen.includes(s)) continue;
    if (total + stepSeconds(toStep(s, p.level)) <= target + 45) add(s);
  }
  if (chosen.length < 2) return null;

  const order: string[] = STRETCH_TYPES.map((t) => t.code);
  chosen.sort((a, b) => order.indexOf(a.modality ?? "") - order.indexOf(b.modality ?? ""));
  const focusLabel = wide
    ? "Full Body"
    : p.focus.map((f) => STRETCH_FOCUSES.find((x) => x.code === f)?.label ?? f).join(" & ");
  return {
    title: `${focusLabel} Stretch`,
    steps: chosen.map((s) => toStep(s, p.level)),
    minutes: Math.max(1, Math.round(total / 60)),
    extras: chosen.filter((c) => !matches(c)).length,
  };
}
