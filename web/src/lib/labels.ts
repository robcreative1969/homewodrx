// Display names from CONTENT-GUIDE.md section 3. The database keeps its own codes;
// every page shows these names instead.

export const CATEGORIES = [
  { code: "classic_benchmark", param: "classic", label: "Classic Benchmarks" },
  { code: "hero", param: "hero", label: "Hero WODs" },
  { code: "competition", param: "competition", label: "Competition WODs" },
  { code: "community", param: "community", label: "Community WODs" },
  { code: "memorial", param: "memorials", label: "Memorials & Tributes" },
] as const;

export function categoryLabel(code: string | null | undefined) {
  return CATEGORIES.find((c) => c.code === code)?.label ?? "Workouts";
}

export function categoryParam(code: string | null | undefined) {
  return CATEGORIES.find((c) => c.code === code)?.param;
}

const EQUIPMENT: Record<string, string | null> = {
  barbell: "Barbell",
  pullUpBar: "Pull-Up Bar",
  rings: "Rings",
  box: "Plyo Box",
  boxJump: "Plyo Box",
  jumpRope: "Jump Rope",
  rower: "Rower",
  rowErg: "Rower",
  wallBall: "Wall Ball",
  wallBallTarget: "Wall Ball",
  kettlebell: "Kettlebell",
  dumbbell: "Dumbbells",
  dumbbells: "Dumbbells",
  running: "Running Space",
  rope: "Climbing Rope",
  ghd: "GHD",
  weightedVest: "Weighted Vest",
  vest: "Weighted Vest",
  sandbag: "Sandbag",
  bodyweight: null,
  none: null,
};

/** Equipment names, deduplicated; "None" when the workout needs nothing. */
export function equipmentLabels(codes: string[] | null | undefined): string[] {
  const names = new Set<string>();
  for (const code of codes ?? []) {
    const name = code in EQUIPMENT ? EQUIPMENT[code] : code;
    if (name) names.add(name);
  }
  return names.size ? [...names] : ["None"];
}

export function levelLabel(difficulty: string | null | undefined) {
  if (!difficulty) return null;
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
