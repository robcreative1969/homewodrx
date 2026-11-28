import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BottomBar, primaryAction } from "@/components/BottomBar";
import { Card } from "@/components/Card";
import { LogPanel } from "@/components/log/LogPanel";
import { scoreKindFor } from "@/lib/log";
import { FOCUSES, LEVELS, equipmentLabel, parseBuilderParams } from "@/lib/builderOptions";
import { getSavedBuilder } from "@/lib/savedServer";
import { RemoveSaved } from "./RemoveSaved";

export const metadata: Metadata = { title: "Your workout", robots: { index: false, follow: false } };

export default async function SavedBuilderPage({ params }: PageProps<"/my-workouts/[id]">) {
  const { id } = await params;
  const { user, saved, workout } = await getSavedBuilder(id);
  if (!user) redirect(`/login?next=${encodeURIComponent(`/my-workouts/${id}`)}`);
  if (!saved || !workout) notFound();

  const choices = parseBuilderParams(Object.fromEntries(new URLSearchParams(saved.ref)));
  const level = LEVELS.find((l) => l.code === choices?.level)?.label;
  const focus = choices?.focus.map((f) => FOCUSES.find((x) => x.code === f)?.label).filter(Boolean).join(", ");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pt-4 pb-28">
      <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
        <Link href="/my-workouts" className="text-ink-2">Your workouts</Link>
        {" › "}WOD Builder
      </nav>

      <Card title={workout.title} labelledBy="saved-workout" aside={<span className="font-mono text-[13px] text-ink-2">{workout.formatLabel} · {workout.minutes} min</span>}>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          {level ? <div className="flex flex-col"><dt className="text-ink-3">Level</dt><dd className="m-0 font-semibold">{level}</dd></div> : null}
          {focus ? <div className="flex flex-col"><dt className="text-ink-3">Focus</dt><dd className="m-0 font-semibold">{focus}</dd></div> : null}
          <div className="flex flex-col"><dt className="text-ink-3">Equipment</dt><dd className="m-0 font-semibold">{workout.equipment.length ? workout.equipment.map(equipmentLabel).join(", ") : "None"}</dd></div>
        </dl>
        {workout.description ? <p className="m-0 text-[15px]">{workout.description}</p> : null}
        <ul className="m-0 flex list-none flex-col p-0">
          {workout.rows.map((r, i) => (
            <li key={`${r.slug}-${i}`} className="flex flex-col border-t border-divider py-3">
              <span className="flex items-baseline justify-between gap-3">
                {r.slug ? (
                  <Link href={`/movements/${r.slug}`} className="text-lg font-bold text-ink">{r.movement}</Link>
                ) : (
                  <span className="text-lg font-bold">{r.movement}</span>
                )}
                {r.reps && !r.movement.toLowerCase().includes(r.reps.toLowerCase()) ? (
                  <span className="shrink-0 font-mono text-sm text-ink-2">{r.reps}</span>
                ) : null}
              </span>
              {r.tip ? <span className="text-sm text-ink-2">{r.tip}</span> : null}
            </li>
          ))}
        </ul>
        {workout.scoring ? <p className="m-0 rounded-xl bg-surface-muted px-3.5 py-2.5 text-[15px]"><strong>Score:</strong> {workout.scoring}</p> : null}
        <RemoveSaved id={saved.id} />
      </Card>

      <LogPanel target={{ source: "builder", title: workout.title, score: scoreKindFor(workout.format) }} />

      <BottomBar>
        <Link href={`/my-workouts/${saved.id}/go`} className={primaryAction}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5M9 2h6" />
          </svg>
          Start Timer
        </Link>
      </BottomBar>
    </div>
  );
}
