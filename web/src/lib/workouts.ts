import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";

export type WorkoutMovement = {
  name: string;
  reps?: string;
  tip?: string;
  rx_men?: string;
  rx_women?: string;
  slug?: string;
};

export type Faq = { question: string; answer: string };

export type BenchmarkWorkout = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string | null;
  format: string | null;
  scheme: string | null;
  duration_estimate: string | null;
  difficulty: string | null;
  equipment: string[] | null;
  scoring_type: string | null;
  description: string | null;
  movements: WorkoutMovement[] | null;
  scoring_notes: string | null;
  scaling_notes: string | null;
  coaching_tips: string[] | null;
  faqs: Faq[] | null;
  youtube_url: string | null;
  updated_at: string | null;
};

const LIST_COLUMNS =
  "id,name,slug,category,subcategory,format,scheme,duration_estimate,difficulty,equipment,movements";

/** Every benchmark workout, A to Z. Cached per request. */
export const listWorkouts = cache(async () => {
  const { data, error } = await publicClient()
    .from("benchmark_workouts")
    .select(LIST_COLUMNS)
    .order("name");
  if (error) throw new Error(`Could not load workouts: ${error.message}`);
  return (data ?? []) as Pick<
    BenchmarkWorkout,
    | "id" | "name" | "slug" | "category" | "subcategory" | "format" | "scheme"
    | "duration_estimate" | "difficulty" | "equipment" | "movements"
  >[];
});

export const getWorkout = cache(async (slug: string) => {
  const { data, error } = await publicClient()
    .from("benchmark_workouts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Could not load workout ${slug}: ${error.message}`);
  return data as BenchmarkWorkout | null;
});

/** Movement name → slug, so each movement in a workout links to its page. */
export const movementSlugs = cache(async () => {
  const { data, error } = await publicClient().from("movements").select("name,slug");
  if (error) throw new Error(`Could not load movements: ${error.message}`);
  return new Map((data ?? []).map((m) => [m.name.toLowerCase(), m.slug as string]));
});

export type ScoreTier = { label: string; minutes: number };

/**
 * Pulls "Sub-3 min is elite. Sub-5 min is strong." style targets out of the scoring
 * notes so they can be drawn as a scale. Returns [] when the notes use other wording.
 */
export function scoreTiers(notes: string | null): ScoreTier[] {
  if (!notes) return [];
  const tiers: ScoreTier[] = [];
  for (const m of notes.matchAll(/sub-(\d+)\s*min(?:utes)?\s+is\s+(?:an?\s+)?([a-z]+)/gi)) {
    tiers.push({ minutes: Number(m[1]), label: m[2].charAt(0).toUpperCase() + m[2].slice(1) });
  }
  return tiers.sort((a, b) => a.minutes - b.minutes);
}

/** The scoring notes without the sentences already shown as tiers. */
export function scoreInstruction(notes: string | null): string | null {
  if (!notes) return null;
  const rest = notes
    .replace(/\s*sub-\d+\s*min(?:utes)?\s+is\s+[^.]*\.?/gi, "")
    .trim();
  return rest || null;
}

/** Up to four workouts in the same category that share a movement, then any in it. */
export function relatedWorkouts(
  workout: BenchmarkWorkout,
  all: Awaited<ReturnType<typeof listWorkouts>>,
) {
  const names = new Set((workout.movements ?? []).map((m) => m.name.toLowerCase()));
  const others = all.filter((w) => w.slug !== workout.slug);
  const shares = (w: (typeof all)[number]) =>
    (w.movements ?? []).some((m) => names.has(m.name.toLowerCase()));
  const ranked = [
    ...others.filter((w) => shares(w) && w.category === workout.category),
    ...others.filter((w) => shares(w) && w.category !== workout.category),
    ...others.filter((w) => !shares(w) && w.category === workout.category),
  ];
  return ranked.slice(0, 4);
}

/** Link to today's timer page with the workout preloaded (same format as the old site). */
export function timerUrl(w: BenchmarkWorkout) {
  const fmt = (w.format ?? "").toLowerCase();
  const mins = parseInt(String(w.duration_estimate ?? "20").match(/\d+/)?.[0] ?? "20", 10);
  const moves = (w.movements ?? [])
    .map((m) => `${String(m.reps ?? "").match(/\d+/)?.[0] ?? ""}:${m.name}`)
    .join(",");
  const mode = fmt.includes("amrap") ? "amrap" : fmt.includes("emom") ? "emom" : fmt.includes("tabata") ? "tabata" : "fortime";
  const params = new URLSearchParams({
    wod: w.name,
    format: w.format ?? "",
    time: String(mins),
    slug: w.slug,
    moves,
    mode,
  });
  return `https://homewodrx.com/timer?${params.toString()}`;
}
