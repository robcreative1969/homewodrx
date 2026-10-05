// Matches a movement name as written in a workout ("KB Swings", "Back Squats (heavy)",
// "Pull-Ups / C2B / Bar Muscle-Ups") to a page in the movement library. Workouts were
// written by hand over time, so the same movement appears under several spellings.

const ABBREVIATIONS: Record<string, string> = {
  kb: "kettlebell",
  kbs: "kettlebell",
  db: "dumbbell",
  dbs: "dumbbell",
  bb: "barbell",
  c2b: "chest to bar pull up",
  t2b: "toes to bar",
  hspu: "handstand push up",
};

// Words that describe how to do a movement rather than which movement it is.
const QUALIFIERS = new Set([
  "strict", "alternating", "heavy", "light", "synchronized", "together", "partner",
  "unbroken", "max", "weighted", "the",
]);

// Generic names that mean a general page rather than a set distance.
const ALIASES: Record<string, string> = {
  run: "running",
  "run backward": "running",
  row: "rowing",
  "row calorie": "row for calorie",
  "wall ball shot": "wall ball",
  "clean jerk": "clean and jerk",
  "squat clean jerk": "clean and jerk",
  "ground overhead": "clean and jerk",
  pistol: "pistol squat",
  "single leg squat": "pistol squat",
};

function singular(word: string) {
  if (word === "ups") return "up";
  if (word.length <= 3) return word;
  if (word.endsWith("sses")) return word.slice(0, -2);
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("es") && /(sh|ch|x)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** A spelling-independent key: lower case, no notes in brackets, singular words. */
export function movementKey(name: string) {
  const words = name
    .toLowerCase()
    .split(" / ")[0]
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/\b\d+(-ft|ft|m|k)?\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ABBREVIATIONS[w] ?? w)
    .join(" ")
    .split(" ")
    .filter((w) => !QUALIFIERS.has(w))
    .map(singular);
  return words.join(" ");
}

/** Builds a lookup from movement library rows; returns name → slug or null. */
export function movementResolver(movements: { name: string; slug: string }[]) {
  const exact = new Map(movements.map((m) => [m.name.toLowerCase(), m.slug]));
  const byKey = new Map<string, string>();
  for (const m of movements) {
    const key = movementKey(m.name);
    if (!byKey.has(key)) byKey.set(key, m.slug);
  }
  return (name: string): string | null => {
    const direct = exact.get(name.toLowerCase());
    if (direct) return direct;
    let key = movementKey(name);
    if (!key || key === "rest") return null;
    key = ALIASES[key] ?? key;
    if (byKey.has(key)) return byKey.get(key)!;
    // "Barbell Thrusters" → "Thrusters", "DB Walking Lunges" → "Walking Lunges"
    const withoutEquipment = key.replace(/^(barbell|dumbbell|kettlebell) /, "");
    if (byKey.has(withoutEquipment)) return byKey.get(withoutEquipment)!;
    return null;
  };
}
