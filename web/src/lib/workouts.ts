import "server-only";
import { cache } from "react";
import { movementResolver } from "@/lib/movementMatch";
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

/** Finds the movement page for a name as written in a workout ("KB Swings" → kettlebell-swings). */
export const movementLinker = cache(async () => {
  const { data, error } = await publicClient().from("movements").select("name,slug");
  if (error) throw new Error(`Could not load movements: ${error.message}`);
  return movementResolver((data ?? []) as { name: string; slug: string }[]);
});

export type ScoreTier = { label: string; value: number };
/** "time": lower is better, drawn as a scale in minutes. "count": higher is better. */
export type ScoreTargets = { kind: "time" | "count"; unit: string; tiers: ScoreTier[] };

const TIME_TARGET = /(?:sub-|under\s+)(\d+)\s*min(?:ute)?s?\s+is\s+(?:an?\s+)?((?:very\s+)?[a-z]+)/gi;
const COUNT_TARGET = /(\d+)\+\s*(complete\s+rounds?|rounds?|reps?|total)?\s*(?:total\s+)?is\s+(?:an?\s+)?((?:very\s+)?[a-z]+)/gi;

function tierLabel(words: string) {
  const w = words.toLowerCase().trim();
  return w.charAt(0).toUpperCase() + w.slice(1);
}

/**
 * Pulls the targets out of the scoring notes ("Sub-3 min is elite", "Under 20 min is
 * strong", "20+ rounds is strong") so they can be shown as tiers. Null when the notes
 * name no targets.
 */
export function scoreTargets(notes: string | null): ScoreTargets | null {
  if (!notes) return null;
  const time = [...notes.matchAll(TIME_TARGET)].map((m) => ({ value: Number(m[1]), label: tierLabel(m[2]) }));
  if (time.length) return { kind: "time", unit: "min", tiers: time.sort((a, b) => a.value - b.value) };
  const count = [...notes.matchAll(COUNT_TARGET)];
  if (count.length) {
    const unitWord = (count[0][2] ?? "").toLowerCase();
    const unit = unitWord.includes("round") ? "rounds" : unitWord.includes("rep") ? "reps" : "";
    return {
      kind: "count",
      unit,
      tiers: count.map((m) => ({ value: Number(m[1]), label: tierLabel(m[3]) })).sort((a, b) => b.value - a.value),
    };
  }
  return null;
}

/**
 * The scoring notes without the target sentences (they are shown as tiers), worded as a
 * rule rather than an instruction: "Record your finish time." reads like a form to fill
 * in, so it becomes "Your score is your finish time." until logging results exists.
 */
export function scoreInstruction(notes: string | null): string | null {
  if (!notes) return null;
  const rest = notes
    .replace(/[^.;]*(?:sub-|under\s+)\d+\s*min(?:ute)?s?\s+is\s+[^.;]*[.;]?/gi, "")
    .replace(/[^.;]*\d+\+\s*(?:complete\s+rounds?|rounds?|reps?|total)?\s*(?:total\s+)?is\s+[^.;]*[.;]?/gi, "")
    .replace(/\bRecord (?:your |the )?(total |finish )?/gi, (_m, what: string | undefined) => `Your score is your ${what ?? ""}`)
    .replace(/\s{2,}/g, " ")
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
