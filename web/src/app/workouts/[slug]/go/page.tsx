import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkoutMode } from "@/components/WorkoutMode";
import { sessionFromBenchmark } from "@/lib/sessions";
import { getWorkout } from "@/lib/workouts";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/workouts/[slug]/go">): Promise<Metadata> {
  const { slug } = await params;
  const w = await getWorkout(slug);
  return { title: w ? `${w.name}: workout mode` : "Workout mode", robots: { index: false, follow: false } };
}

export default async function WorkoutGoPage({ params }: PageProps<"/workouts/[slug]/go">) {
  const { slug } = await params;
  const w = await getWorkout(slug);
  if (!w) notFound();
  return <WorkoutMode session={sessionFromBenchmark(w)} />;
}
