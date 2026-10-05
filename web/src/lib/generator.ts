// The one workout generator for the WOD Builder and The Daily 20. The old site had three
// copies (wodbuilder.html, planner.html, js/daily-wod.js); this replaces them. It is pure:
// the same movements, options and seed always give the same workout, so a built workout
// can live in a link.

export type Level = "beginner" | "intermediate" | "advanced";
export type Format = "amrap" | "emom" | "fortime" | "circuit" | "tabata";
export type Focus = "full-body" | "upper-body" | "lower-body" | "core" | "push" | "pull" | "legs-glutes" | "cardio";

export type PoolMovement = {
  name: string;
  slug: string;
  tip: string;
  equipment: string; // movements.equipment_category
  tags: string[];
  pattern: string | null;
  tabata: boolean;
  timed: boolean;
  reps: { beginner: RepValue; intermediate: RepValue; advanced: RepValue };
};
type RepValue = number | string | (number | string)[] | null;

export type GeneratorOptions = {
  equipment: string[];
  focus: Focus[];
  level: Level;
  format: Format | "any";
  minutes: number;
  tabataStructure?: "sequential" | "rotating";
};

export type GeneratedRow = { movement: string; slug: string; reps: string; tip: string };

export type GeneratedWorkout = {
  title: string;
  format: Format;
  formatLabel: string;
  description: string;
  scoring: string;
  rows: GeneratedRow[];
  /** Rounds for For Time and Circuit workouts. */
  rounds?: number;
  /** Rep ladder shared by every movement in a For Time workout ("21-15-9"). */
  ladder?: number[];
  minutes: number;
  equipment: string[];
};

export const FORMAT_LABEL: Record<Format, string> = {
  amrap: "AMRAP",
  emom: "EMOM",
  fortime: "For Time",
  circuit: "Circuit",
  tabata: "Tabata",
};

/** Seeded random numbers (a 32-bit LCG, as the old Daily 20 used). */
export function seededRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

const FOCUS_TAGS: Record<Focus, string[] | null> = {
  "full-body": null,
  "upper-body": ["push", "pull"],
  "lower-body": ["lower", "legs-glutes"],
  core: ["core"],
  push: ["push"],
  pull: ["pull"],
  "legs-glutes": ["lower", "legs-glutes"],
  cardio: ["cardio", "full"],
};

type Tagged = PoolMovement & { eq: string };

// Some movements have no rep counts in the database yet. Strength moves get a default
// for the level; distance and carry work without a set amount is left out until it has one.
const DEFAULT_REPS = { beginner: 8, intermediate: 12, advanced: 15 };
const hasReps = (m: PoolMovement) =>
  [m.reps.beginner, m.reps.intermediate, m.reps.advanced].some((r) => r !== null && !(Array.isArray(r) && !r.length));

function withReps(m: PoolMovement): PoolMovement | null {
  if (hasReps(m)) return m;
  if (m.timed || m.pattern === "monostructural" || m.pattern === "carry") return null;
  return { ...m, reps: { ...DEFAULT_REPS } };
}

export function buildPool(movements: PoolMovement[], equipment: string[], level: Level, focus: Focus[]): Tagged[] {
  const want = new Set(equipment.map((e) => (e === "dumbbell" ? "dumbbells" : e)));
  let moves: Tagged[] = movements
    .filter((m) => m.equipment === "bodyweight" || want.has(m.equipment))
    .map(withReps)
    .filter((m): m is PoolMovement => m !== null)
    .map((m) => ({ ...m, eq: m.equipment }));
  moves = moves.filter((m) => !/muscle.up/i.test(m.name));
  if (level === "beginner") moves = moves.filter((m) => !/(snatch|toes.to.bar|double under|turkish)/i.test(m.name));
  if (level === "intermediate") moves = moves.filter((m) => !/(snatch|toes.to.bar|double under)/i.test(m.name));

  if (!focus.includes("full-body")) {
    const tags = new Set(focus.flatMap((f) => FOCUS_TAGS[f] ?? []));
    if (tags.size) {
      const filtered = moves.filter((m) => m.tags.some((t) => tags.has(t)));
      if (filtered.length >= 3) moves = filtered;
    }
  }
  return moves;
}

const PATTERN_BUCKET: Record<string, string> = {
  squat: "lower",
  hinge: "lower",
  push: "push",
  press: "push",
  pull: "pull",
  core: "core",
  fullbody: "full",
  gymnastics: "full",
  olympic: "full",
  carry: "full",
  monostructural: "full",
};

function bucketOf(m: Tagged) {
  if (m.pattern && PATTERN_BUCKET[m.pattern]) return PATTERN_BUCKET[m.pattern];
  for (const t of ["full", "lower", "push", "pull", "core"]) if (m.tags.includes(t)) return t;
  return "other";
}

function firstRep(m: Tagged, level: Level) {
  const r = m.reps[level] ?? m.reps.beginner;
  return Array.isArray(r) ? r[0] : r;
}

/** Distance, time or calories rather than a rep count. */
function isEffort(m: Tagged) {
  if (m.timed) return true;
  return typeof firstRep(m, "beginner") === "string";
}

/** Fits inside one EMOM minute. */
function emomSafe(m: Tagged, level: Level) {
  if (!isEffort(m)) return true;
  const v = String(firstRep(m, level) ?? "");
  if (/mile|km/i.test(v) || /\d+\s*min/.test(v)) return false;
  const meters = v.match(/^(\d+)\s*m$/);
  if (meters && Number(meters[1]) > 200) return false;
  const cal = v.match(/(\d+)\s*cal/);
  if (cal && Number(cal[1]) > 20) return false;
  return true;
}

function repsFor(m: Tagged, level: Level, rng: () => number) {
  const r = m.reps[level] ?? m.reps.beginner;
  if (Array.isArray(r)) return String(r.length > 1 && rng() > 0.5 ? r[1] : r[0]);
  return String(r ?? "");
}

/** Spreads picks across leg, push, pull, core and full-body work, then makes sure every
 *  chosen piece of equipment gets used at least once. */
function balancedPick(pool: Tagged[], count: number, rng: () => number) {
  const buckets: Record<string, Tagged[]> = { lower: [], push: [], pull: [], core: [], full: [], other: [] };
  for (const m of pool) buckets[bucketOf(m)].push(m);
  const order =
    count >= 5 ? ["lower", "push", "pull", "core", "full"]
    : count === 4 ? ["lower", "push", "pull", "core"]
    : count === 3 ? ["lower", "push", "core"]
    : ["lower", "push"];
  const result: Tagged[] = [];
  for (const cat of order) {
    const bucket = buckets[cat];
    if (bucket.length) result.push(bucket.splice(Math.floor(rng() * bucket.length), 1)[0]);
  }
  while (result.length < count) {
    const rest = Object.values(buckets).flat().filter((m) => !result.includes(m));
    if (!rest.length) break;
    result.push(rest[Math.floor(rng() * rest.length)]);
  }
  const equipmentTypes = [...new Set(pool.filter((m) => m.eq !== "bodyweight").map((m) => m.eq))];
  for (const eq of equipmentTypes) {
    if (result.some((m) => m.eq === eq)) continue;
    const candidates = pool.filter((m) => m.eq === eq && !result.includes(m));
    if (!candidates.length) continue;
    const calories = candidates.filter((m) => String(firstRep(m, "beginner") ?? "").includes("cal"));
    const choices = calories.length ? calories : candidates;
    const pick = choices[Math.floor(rng() * choices.length)];
    let swap = result.findIndex((m) => m.eq === "bodyweight" && m.tags.some((t) => pick.tags.includes(t)));
    if (swap === -1) swap = result.findIndex((m) => m.eq === "bodyweight");
    if (swap === -1) swap = result.length - 1;
    if (swap >= 0) result[swap] = pick;
  }
  return result;
}

const LADDERS: Record<Level, number[]> = { beginner: [15, 12, 9], intermediate: [21, 15, 9], advanced: [30, 20, 10] };

export function generateWorkout(movements: PoolMovement[], opts: GeneratorOptions, seed: number): GeneratedWorkout | null {
  const rng = seededRng(seed);
  const pool = buildPool(movements, opts.equipment, opts.level, opts.focus.length ? opts.focus : ["full-body"]);
  if (pool.length < 2) return null;
  const formats: Format[] = opts.format === "any" ? ["amrap", "emom", "fortime", "circuit"] : [opts.format];
  const format = formats[Math.floor(rng() * formats.length)];
  const minutes = opts.minutes;
  const row = (m: Tagged, reps: string): GeneratedRow => ({ movement: m.name, slug: m.slug, reps, tip: m.tip });
  const usedEquipment = (picked: Tagged[]) => [...new Set(picked.map((m) => m.eq).filter((e) => e !== "bodyweight"))];

  if (format === "emom") {
    const safe = pool.filter((m) => emomSafe(m, opts.level));
    const picked = balancedPick(safe.length >= 3 ? safe : pool, Math.min(4, Math.max(2, Math.floor(minutes / 4))), rng);
    return {
      title: `${minutes}-Minute EMOM`,
      format,
      formatLabel: FORMAT_LABEL[format],
      description: `Every minute on the minute for ${minutes} minutes. Start the work at the top of each minute and rest for whatever is left. The movements take turns, one per minute.`,
      scoring: "Note whether you finish each minute's work before the next one starts. If you keep missing, cut the reps.",
      rows: picked.map((m) => row(m, isEffort(m) ? repsFor(m, opts.level, rng) : `${repsFor(m, opts.level, rng)} reps`)),
      minutes,
      equipment: usedEquipment(picked),
    };
  }

  if (format === "fortime") {
    const picked = balancedPick(pool, 3, rng);
    if (picked.every(isEffort)) {
      return {
        title: "Cardio Chipper",
        format,
        formatLabel: FORMAT_LABEL[format],
        description: "Get through all the work as fast as you can, one piece after another.",
        scoring: "Your score is your finish time.",
        rows: picked.map((m) => row(m, repsFor(m, opts.level, rng))),
        rounds: 1,
        minutes,
        equipment: usedEquipment(picked),
      };
    }
    const ladder = LADDERS[opts.level];
    return {
      title: `${ladder.join("-")} For Time`,
      format,
      formatLabel: FORMAT_LABEL[format],
      description: `Do every movement for ${ladder[0]} reps, then ${ladder[1]}, then ${ladder[2]}, as fast as you can. Distance and calorie work stays the same each round.`,
      scoring: "Your score is your finish time.",
      rows: picked.map((m) => row(m, isEffort(m) ? repsFor(m, opts.level, rng) : ladder.join("-"))),
      rounds: ladder.length,
      ladder,
      minutes,
      equipment: usedEquipment(picked),
    };
  }

  if (format === "circuit") {
    const count = minutes <= 15 ? 4 : minutes <= 30 ? 5 : 6;
    const rounds = minutes <= 15 ? 3 : minutes <= 30 ? 4 : 5;
    const picked = balancedPick(pool, count, rng);
    return {
      title: `${rounds}-Round Circuit`,
      format,
      formatLabel: FORMAT_LABEL[format],
      description: `Do all ${count} movements back to back, then rest 60 seconds. ${rounds} rounds.`,
      scoring: "Your score is your total time.",
      rows: picked.map((m) => row(m, repsFor(m, opts.level, rng))),
      rounds,
      minutes,
      equipment: usedEquipment(picked),
    };
  }

  if (format === "tabata") {
    const structure = opts.tabataStructure ?? "sequential";
    const suitable = pool.filter((m) => m.tabata);
    const usePool = suitable.length >= 2 ? suitable : pool;
    // Each movement is 8 rounds of 20 seconds on, 10 off (4 minutes); sequential adds a minute's rest between movements.
    const count = structure === "sequential"
      ? Math.max(2, Math.min(5, Math.round(minutes / 5)))
      : Math.max(2, Math.min(6, Math.round(minutes / 4)));
    const picked = balancedPick(usePool, count, rng);
    const total = structure === "sequential" ? count * 4 + (count - 1) : count * 4;
    return {
      title: `${total}-Minute ${structure === "rotating" ? "Rotating " : ""}Tabata`,
      format,
      formatLabel: FORMAT_LABEL[format],
      description: structure === "sequential"
        ? "8 rounds of 20 seconds of work and 10 seconds of rest for each movement, then a minute's rest before the next one."
        : `Rotate through all ${count} movements, 20 seconds of work and 10 of rest each, for 8 full rotations.`,
      scoring: structure === "sequential"
        ? "For each movement, your score is your lowest round of reps. Add them up for your total."
        : "Count your total reps for each movement.",
      rows: picked.map((m) => row(m, "8 × 20 sec on, 10 off")),
      minutes: total,
      equipment: usedEquipment(picked),
    };
  }

  const count = minutes <= 15 ? 3 : minutes <= 25 ? 4 : 5;
  const picked = balancedPick(pool, count, rng);
  return {
    title: `${minutes}-Minute AMRAP`,
    format: "amrap",
    formatLabel: FORMAT_LABEL.amrap,
    description: `As many rounds as possible in ${minutes} minutes. Pick a pace you can hold from start to finish.`,
    scoring: "Your score is your rounds plus extra reps, for example 8 rounds + 12 reps.",
    rows: picked.map((m) => row(m, repsFor(m, opts.level, rng))),
    minutes,
    equipment: usedEquipment(picked),
  };
}
