import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkoutMode } from "@/components/WorkoutMode";
import { builderQuery, parseBuilderParams } from "@/lib/builderOptions";
import { generateWorkout } from "@/lib/generator";
import { loadMovementPool } from "@/lib/movementPool";
import { sessionFromGenerated } from "@/lib/sessions";

export const metadata: Metadata = {
  title: "WOD Builder: workout mode",
  robots: { index: false, follow: false },
};

export default async function BuilderGoPage({ searchParams }: PageProps<"/wodbuilder/go">) {
  const params = parseBuilderParams(await searchParams);
  if (!params?.seed) notFound();
  const workout = generateWorkout(await loadMovementPool(), params, params.seed);
  if (!workout) notFound();
  return <WorkoutMode session={sessionFromGenerated(workout, `/wodbuilder?${builderQuery(params)}`)} />;
}
