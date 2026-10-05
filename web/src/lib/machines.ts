import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";

export type Machine = {
  id: string;
  name: string;
  slug: string;
  muscle_groups: string[] | null;
  overview: string | null;
  setup_notes: string | null;
  common_mistakes: { mistake: string; fix: string }[] | null;
  safety_notes: string | null;
  youtube_url: string | null;
};

export const listMachines = cache(async () => {
  const { data, error } = await publicClient().from("machines").select("id,name,slug,muscle_groups").order("name");
  if (error) throw new Error(`Could not load machines: ${error.message}`);
  return (data ?? []) as Pick<Machine, "id" | "name" | "slug" | "muscle_groups">[];
});

export const getMachine = cache(async (slug: string) => {
  const { data, error } = await publicClient().from("machines").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Could not load machine ${slug}: ${error.message}`);
  return data as Machine | null;
});

/** Movements done on this machine (movements.machine_id). */
export async function machineMovements(machineId: string) {
  const { data, error } = await publicClient()
    .from("movements")
    .select("name,slug,muscles")
    .eq("machine_id", machineId)
    .order("name");
  if (error) throw new Error(`Could not load machine movements: ${error.message}`);
  return (data ?? []) as { name: string; slug: string; muscles: string | null }[];
}

export function muscleGroupLabels(groups: string[] | null | undefined) {
  return (groups ?? []).map((g) => g.charAt(0).toUpperCase() + g.slice(1));
}
