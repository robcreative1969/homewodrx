import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { WorkoutMode } from "@/components/WorkoutMode";
import { getSavedBuilder } from "@/lib/savedServer";
import { sessionFromGenerated } from "@/lib/sessions";

export const metadata: Metadata = { title: "Your workout: workout mode", robots: { index: false, follow: false } };

export default async function SavedBuilderGoPage({ params }: PageProps<"/my-workouts/[id]/go">) {
  const { id } = await params;
  const { user, saved, workout } = await getSavedBuilder(id);
  if (!user) redirect(`/login?next=${encodeURIComponent(`/my-workouts/${id}/go`)}`);
  if (!saved || !workout) notFound();
  return <WorkoutMode session={sessionFromGenerated(workout, `/my-workouts/${saved.id}`, saved.ref)} />;
}
