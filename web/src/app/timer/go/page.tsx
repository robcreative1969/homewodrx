import type { Metadata } from "next";
import { WorkoutMode } from "@/components/WorkoutMode";
import { parseTimer, timerSession } from "@/lib/timerOptions";

export const metadata: Metadata = { title: "WOD Timer", robots: { index: false, follow: false } };

export default async function TimerGoPage({ searchParams }: PageProps<"/timer/go">) {
  return <WorkoutMode session={timerSession(parseTimer(await searchParams))} />;
}
