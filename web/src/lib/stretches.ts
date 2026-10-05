import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";

export type Stretch = {
  id: string;
  name: string;
  slug: string;
  modality: string | null;
  focus: string[] | null;
  sides: boolean | null;
  hold_beginner: number | null;
  hold_intermediate: number | null;
  hold_advanced: number | null;
  tip: string | null;
  youtube_url: string | null;
  description: string | null;
  cues: string[] | null;
};

export type RoutineStep = { step: number; name: string; slug?: string | null; dose?: string; tip?: string };

export type Routine = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  duration: number | null;
  level_label: string | null;
  modality: string | null;
  focus: string[] | null;
  equipment: string | null;
  description: string | null;
  benefits: string[] | null;
  stretches: RoutineStep[] | null;
};

// One list of stretch types for every page (CONTENT-GUIDE.md §3).
const MODALITY: Record<string, string> = {
  static: "Static",
  dynamic: "Dynamic",
  yoga: "Yoga",
  pnf: "PNF",
  mixed: "Mixed",
};

export function modalityLabel(m: string | null | undefined) {
  if (!m) return null;
  return MODALITY[m.toLowerCase()] ?? m;
}

const FOCUS: Record<string, string> = {
  full: "Full Body",
  hips: "Hips",
  shoulders: "Shoulders",
  back: "Back",
  hamstrings: "Hamstrings",
  chest: "Chest",
  calves: "Calves",
  wrists: "Wrists",
};

/** Focus areas, leaving out "Full Body" when a stretch also names a specific area. */
export function focusLabels(focus: string[] | null | undefined) {
  const names = (focus ?? []).map((f) => FOCUS[f] ?? f);
  const specific = names.filter((n) => n !== "Full Body");
  return specific.length ? specific : names;
}

export const STRETCH_FOCUS_FILTERS = Object.entries(FOCUS).filter(([code]) => code !== "full");

export const listStretches = cache(async () => {
  const { data, error } = await publicClient()
    .from("stretches")
    .select("id,name,slug,modality,focus,sides,hold_beginner,hold_intermediate,hold_advanced")
    .order("name");
  if (error) throw new Error(`Could not load stretches: ${error.message}`);
  return (data ?? []) as Stretch[];
});

export const getStretch = cache(async (slug: string) => {
  const { data, error } = await publicClient().from("stretches").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Could not load stretch ${slug}: ${error.message}`);
  return data as Stretch | null;
});

export const listRoutines = cache(async () => {
  const { data, error } = await publicClient()
    .from("stretch_routines")
    .select("id,name,slug,tagline,duration,level_label,modality,focus,stretches")
    .order("name");
  if (error) throw new Error(`Could not load routines: ${error.message}`);
  return (data ?? []) as Routine[];
});

export const getRoutine = cache(async (slug: string) => {
  const { data, error } = await publicClient().from("stretch_routines").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Could not load routine ${slug}: ${error.message}`);
  return data as Routine | null;
});

/** Routines that include this stretch. */
export async function routinesWithStretch(slug: string) {
  const routines = await listRoutines();
  return routines.filter((r) => (r.stretches ?? []).some((s) => s.slug === slug));
}
