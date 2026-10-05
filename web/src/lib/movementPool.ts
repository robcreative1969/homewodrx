import "server-only";
import { cache } from "react";
import type { PoolMovement } from "@/lib/generator";
import { publicClient } from "@/lib/supabase/public";

/**
 * Movements the generator may use (movements.daily_wod_eligible), in a fixed order so
 * a seed always gives the same workout.
 */
export const loadMovementPool = cache(async (): Promise<PoolMovement[]> => {
  const { data, error } = await publicClient()
    .from("movements")
    .select("name, slug, equipment_category, tags, movement_pattern, tabata_suitable, timed, wod_tip, beginner_reps, intermediate_reps, advanced_reps")
    .eq("daily_wod_eligible", true)
    .order("name");
  if (error) throw new Error(`Could not load movements for the generator: ${error.message}`);
  return (data ?? []).map((m) => ({
    name: m.name,
    slug: m.slug,
    // Some tips were saved with escape codes as text ("\\u2014"); show the real characters.
    tip: (m.wod_tip ?? "").replace(/\\u([0-9a-fA-F]{4})/g, (_: string, h: string) => String.fromCharCode(parseInt(h, 16))),
    equipment: m.equipment_category || "bodyweight",
    tags: m.tags ?? [],
    pattern: m.movement_pattern ?? null,
    tabata: !!m.tabata_suitable,
    timed: !!m.timed,
    reps: { beginner: m.beginner_reps, intermediate: m.intermediate_reps, advanced: m.advanced_reps },
  }));
});
