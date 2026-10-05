import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import { listWorkouts, movementLinker } from "@/lib/workouts";

export type ScalingOption = { level: string; movement: string; notes?: string };
export type Fault = { mistake: string; fix: string };

export type Movement = {
  id: string;
  name: string;
  slug: string;
  category: string;
  muscles: string | null;
  description: string | null;
  tips: string[] | null;
  scaling_options: ScalingOption[];
  common_faults: Fault[];
  youtube_url: string | null;
  equipment: string[] | null;
  machine: { name: string; slug: string } | null;
};

export const MOVEMENT_CATEGORIES: Record<string, string> = {
  barbell: "Barbell",
  olympic: "Olympic Lifts",
  dumbbell: "Dumbbell",
  kettlebell: "Kettlebell",
  gymnastics: "Gymnastics",
  push: "Upper Body",
  lower: "Lower Body",
  fullbody: "Full Body",
  core: "Core",
  cardio: "Cardio",
  slamball: "Slam Ball",
  resistancebands: "Resistance Bands",
  latpulldown: "Machines",
};

export function movementCategoryLabel(code: string) {
  return MOVEMENT_CATEGORIES[code] ?? code.charAt(0).toUpperCase() + code.slice(1);
}

// Two columns are stored as JSON text rather than JSON; read them safely.
function parseList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export const listMovements = cache(async () => {
  const { data, error } = await publicClient()
    .from("movements")
    .select("id,name,slug,category,muscles")
    .order("name");
  if (error) throw new Error(`Could not load movements: ${error.message}`);
  return (data ?? []) as Pick<Movement, "id" | "name" | "slug" | "category" | "muscles">[];
});

export const getMovement = cache(async (slug: string): Promise<Movement | null> => {
  const { data, error } = await publicClient()
    .from("movements")
    .select("id,name,slug,category,muscles,description,tips,scaling_options,common_faults,youtube_url,equipment,machine:machines(name,slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Could not load movement ${slug}: ${error.message}`);
  if (!data) return null;
  const machine = Array.isArray(data.machine) ? (data.machine[0] ?? null) : (data.machine ?? null);
  return {
    ...data,
    machine,
    scaling_options: parseList<ScalingOption>(data.scaling_options),
    common_faults: parseList<Fault>(data.common_faults),
  } as Movement;
});

/** Benchmark workouts that include this movement, under any of its spellings. */
export async function workoutsWithMovement(slug: string) {
  const [all, linkFor] = await Promise.all([listWorkouts(), movementLinker()]);
  return all.filter((w) => (w.movements ?? []).some((m) => (m.slug ?? linkFor(m.name)) === slug));
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  scaled: "Scaled",
  rx: "Rx",
  advanced: "Advanced",
};

export function scalingLevelLabel(level: string) {
  return LEVEL_LABEL[level.toLowerCase()] ?? level;
}
