import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StretchMode } from "@/components/StretchMode";
import { buildStretchRoutine, parseStretchParams, stretchQuery } from "@/lib/stretchBuilder";
import { loadStretchPool } from "@/lib/stretches";

export const metadata: Metadata = {
  title: "Stretch Builder: follow-along",
  robots: { index: false, follow: false },
};

export default async function StretchBuilderGoPage({ searchParams }: PageProps<"/stretchbuilder/go">) {
  const params = parseStretchParams(await searchParams);
  if (!params?.seed) notFound();
  const routine = buildStretchRoutine(await loadStretchPool(), params, params.seed);
  if (!routine) notFound();
  return (
    <StretchMode
      session={{
        name: routine.title,
        subtitle: `${routine.steps.length} stretches · about ${routine.minutes} min`,
        steps: routine.steps,
        backHref: `/stretchbuilder?${stretchQuery(params)}`,
      }}
    />
  );
}
