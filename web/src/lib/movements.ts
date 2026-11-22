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
  body_area: string | null;
  equipment_category: string | null;
  muscles: string | null;
  description: string | null;
  tips: string[] | null;
  scaling_options: ScalingOption[];
  common_faults: Fault[];
  youtube_url: string | null;
  equipment: string[] | null;
  machine: { name: string; slug: string } | null;
};

// The Movements page filters on two things at once: where the movement works and what it
// needs (Rob, 2026-11-22). The old single "category" mixed both and is kept for reference only.
export const BODY_AREAS: Record<string, string> = {
  upper: "Upper Body",
  lower: "Lower Body",
  core: "Core",
  full: "Full Body",
  cardio: "Cardio",
};

/** Equipment filter groups, built from each movement's equipment group code. */
export const EQUIPMENT_GROUPS: { key: string; label: string; codes: string[] }[] = [
  { key: "bodyweight", label: "Bodyweight", codes: ["bodyweight", "running"] },
  { key: "barbell", label: "Barbell", codes: ["barbell"] },
  { key: "dumbbell", label: "Dumbbell", codes: ["dumbbells", "dumbbell"] },
  { key: "kettlebell", label: "Kettlebell", codes: ["kettlebell"] },
  { key: "bar-rings", label: "Bar & Rings", codes: ["pullupbar", "rings", "dipbar", "rope"] },
  { key: "balls", label: "Med & Slam Balls", codes: ["slamball", "medicineball"] },
  { key: "bands", label: "Bands", codes: ["resistancebands"] },
  { key: "box-rope", label: "Box & Jump Rope", codes: ["box", "jumprope"] },
  { key: "machines", label: "Machines", codes: ["machine", "latpulldown", "rower", "airbike", "skierg", "ghd"] },
];

export function equipmentGroup(code: string | null | undefined) {
  return EQUIPMENT_GROUPS.find((g) => g.codes.includes(code ?? "bodyweight")) ?? EQUIPMENT_GROUPS[0];
}

export function bodyAreaLabel(area: string | null | undefined) {
  return (area && BODY_AREAS[area]) || "Movement";
}

/** Old links used ?category=<code>; turn them into the new filters. */
export function legacyMovementFilter(category: string): { area?: string; equipment?: string } {
  const areas: Record<string, string> = { push: "upper", lower: "lower", core: "core", cardio: "cardio", fullbody: "full" };
  const equipment: Record<string, string> = {
    barbell: "barbell", olympic: "barbell", dumbbell: "dumbbell", kettlebell: "kettlebell",
    gymnastics: "bar-rings", slamball: "balls", resistancebands: "bands", latpulldown: "machines", machine: "machines",
  };
  return { area: areas[category], equipment: equipment[category] };
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
    .select("id,name,slug,category,body_area,equipment_category,muscles")
    .order("name");
  if (error) throw new Error(`Could not load movements: ${error.message}`);
  return (data ?? []) as Pick<Movement, "id" | "name" | "slug" | "category" | "body_area" | "equipment_category" | "muscles">[];
});

export const getMovement = cache(async (slug: string): Promise<Movement | null> => {
  const { data, error } = await publicClient()
    .from("movements")
    .select("id,name,slug,category,body_area,equipment_category,muscles,description,tips,scaling_options,common_faults,youtube_url,equipment,machine:machines(name,slug)")
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
