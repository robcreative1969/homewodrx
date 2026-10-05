import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkoutMode } from "@/components/WorkoutMode";
import { getDaily20, isDateString, todayEastern } from "@/lib/daily";
import { sessionFromDaily20 } from "@/lib/sessions";

export const metadata: Metadata = {
  title: "The Daily 20: workout mode",
  robots: { index: false, follow: false },
};

export default async function DailyGoPage({ searchParams }: PageProps<"/daily-wod/go">) {
  const { date: asked } = await searchParams;
  const today = todayEastern();
  const date = isDateString(asked) && asked <= today ? asked : today;
  const wod = await getDaily20(date);
  if (!wod) notFound();
  return <WorkoutMode session={sessionFromDaily20(wod, date === today)} />;
}
