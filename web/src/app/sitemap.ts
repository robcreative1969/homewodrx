import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog";
import { listMachines } from "@/lib/machines";
import { listMovements } from "@/lib/movements";
import { listRoutines, listStretches } from "@/lib/stretches";
import { listWorkouts } from "@/lib/workouts";

const BASE = "https://homewodrx.com";

export const revalidate = 3600;

// Lists only pages the new site serves. Before the switch, the URL check in
// REBUILD-PLAN.md §3 compares this against the old sitemap so nothing is lost.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workouts, movements, stretches, routines, machines] = await Promise.all([
    listWorkouts(),
    listMovements(),
    listStretches(),
    listRoutines(),
    listMachines(),
  ]);
  const page = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({
    url: `${BASE}${path}`,
    priority,
  });

  return [
    page("/", 1),
    page("/workouts", 0.9),
    page("/movements", 0.8),
    page("/stretches", 0.7),
    page("/stretch-routines", 0.7),
    page("/blog", 0.7),
    ...workouts.map((w) => page(`/workouts/${w.slug}`, 0.8)),
    ...movements.map((m) => page(`/movements/${m.slug}`, 0.7)),
    ...stretches.map((s) => page(`/stretches/${s.slug}`)),
    ...routines.map((r) => page(`/stretch-routines/${r.slug}`)),
    ...machines.map((m) => page(`/machines/${m.slug}`)),
    ...listPosts().map((p) => ({ ...page(`/blog/${p.slug}`), lastModified: p.date })),
  ];
}
