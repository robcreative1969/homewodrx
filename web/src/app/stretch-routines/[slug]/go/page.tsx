import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StretchMode } from "@/components/StretchMode";
import { stepFromDose } from "@/lib/stretchSession";
import { getRoutine } from "@/lib/stretches";

export const metadata: Metadata = {
  title: "Stretch routine: follow-along",
  robots: { index: false, follow: false },
};

export default async function RoutineGoPage({ params }: PageProps<"/stretch-routines/[slug]/go">) {
  const { slug } = await params;
  const r = await getRoutine(slug);
  if (!r?.stretches?.length) notFound();
  return (
    <StretchMode
      session={{
        name: r.name,
        subtitle: [r.duration ? `${r.duration} min` : null, `${r.stretches.length} stretches`].filter(Boolean).join(" · "),
        steps: r.stretches.map((s) => stepFromDose(s.name, s.slug, s.dose, s.tip)),
        backHref: `/stretch-routines/${r.slug}`,
      }}
    />
  );
}
