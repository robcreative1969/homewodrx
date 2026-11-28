// Saved workouts ("Your workouts"): what a save points at and where it opens.
// Safe to use in the browser. Rows live in public.saved_workouts, private to each person.

import type { GeneratedWorkout } from "./generator";

/** What a Save button saves. */
export type SaveTarget =
  | { kind: "library"; slug: string; title: string }
  | { kind: "daily20"; date: string; title: string }
  /** query is the builder link without "?", seed included, so it can be rebuilt or shared. */
  | { kind: "builder"; query: string; workout: GeneratedWorkout };

export type SavedWorkout = {
  id: string;
  kind: "library" | "daily20" | "builder";
  ref: string;
  title: string;
  workout: GeneratedWorkout | null;
  created_at: string;
};

export const SAVED_COLUMNS = "id,kind,ref,title,workout,created_at";

/** A row as the Your workouts list reads it: just the builder workout's format and length. */
export type SavedListItem = Omit<SavedWorkout, "workout"> & { format_label: string | null; minutes: string | null };
export const SAVED_LIST_COLUMNS = "id,kind,ref,title,created_at,format_label:workout->>formatLabel,minutes:workout->>minutes";

export function saveRef(t: SaveTarget) {
  return t.kind === "library" ? t.slug : t.kind === "daily20" ? t.date : t.query;
}

export function saveTitle(t: SaveTarget) {
  return (t.kind === "builder" ? t.workout.title : t.title).slice(0, 120);
}

export function savedHref(s: Pick<SavedWorkout, "id" | "kind" | "ref">) {
  if (s.kind === "library") return `/workouts/${s.ref}`;
  if (s.kind === "daily20") return `/daily-wod?date=${s.ref}`;
  return `/my-workouts/${s.id}`;
}
