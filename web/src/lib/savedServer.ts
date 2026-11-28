import "server-only";
import { createClient } from "@/lib/supabase/server";
import { FORMAT_LABEL, type Format, type GeneratedWorkout } from "@/lib/generator";
import { SAVED_COLUMNS, type SavedWorkout } from "@/lib/saved";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 && v < 1000 ? Math.round(v) : undefined);

/** A stored builder workout, checked field by field so an odd row can't break the page. */
export function readWorkout(json: unknown, fallbackTitle: string): GeneratedWorkout | null {
  if (!json || typeof json !== "object") return null;
  const w = json as Record<string, unknown>;
  const format = (Object.keys(FORMAT_LABEL) as Format[]).find((f) => f === w.format);
  if (!format || !Array.isArray(w.rows)) return null;
  const rows = w.rows
    .slice(0, 40)
    .filter((r): r is Record<string, unknown> => Boolean(r) && typeof r === "object")
    .map((r) => ({ movement: str(r.movement, 120), slug: str(r.slug, 120).replace(/[^a-z0-9-]/g, ""), reps: str(r.reps, 80), tip: str(r.tip) }))
    .filter((r) => r.movement);
  if (!rows.length) return null;
  return {
    title: str(w.title, 120) || fallbackTitle,
    format,
    formatLabel: FORMAT_LABEL[format],
    description: str(w.description, 1000),
    scoring: str(w.scoring, 500),
    rows,
    rounds: num(w.rounds),
    ladder: Array.isArray(w.ladder) ? w.ladder.map(num).filter((n): n is number => n !== undefined).slice(0, 20) : undefined,
    minutes: num(w.minutes) ?? 20,
    equipment: Array.isArray(w.equipment) ? w.equipment.map((e) => str(e, 40)).filter(Boolean).slice(0, 20) : [],
  };
}

/**
 * One of this person's saved builder workouts, or null. The database only returns
 * the signed-in person's own saves; user_id is checked here too.
 */
export async function getSavedBuilder(id: string) {
  if (!UUID.test(id)) return { user: null, saved: null, workout: null };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, saved: null, workout: null };
  const { data } = await supabase
    .from("saved_workouts")
    .select(SAVED_COLUMNS)
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("kind", "builder")
    .maybeSingle();
  const saved = data as SavedWorkout | null;
  return { user, saved, workout: saved ? readWorkout(saved.workout, saved.title) : null };
}
