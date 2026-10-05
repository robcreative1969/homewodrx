import type { Metadata } from "next";
import Link from "next/link";
import { BottomBar, primaryAction } from "@/components/BottomBar";
import { Card } from "@/components/Card";
import { levelLabel } from "@/lib/labels";
import { bodyFocusLabel, formatLongDate, getDaily10, getDaily20, isDateString, todayEastern } from "@/lib/daily";
import { movementLinker } from "@/lib/workouts";

export const metadata: Metadata = {
  title: "The Daily 20 and The Daily 10",
  description: "A new 20-minute workout and a 10-minute stretch routine every day, free and the same for everyone. No account needed.",
  alternates: { canonical: "https://homewodrx.com/daily-wod" },
};

function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function DailyPage({ searchParams }: PageProps<"/daily-wod">) {
  const { date: asked } = await searchParams;
  const today = todayEastern();
  // Past days only; the future stays a surprise.
  const date = isDateString(asked) && asked <= today ? asked : today;
  const isToday = date === today;
  const [wod, stretch, linkFor] = await Promise.all([getDaily20(date), getDaily10(date), movementLinker()]);
  const goHref = isToday ? "/daily-wod/go" : `/daily-wod/go?date=${date}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-5 pb-28">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="m-0 text-[32px] leading-tight font-extrabold tracking-tight">{isToday ? "Today" : formatLongDate(date)}</h1>
          <p className="m-0 font-mono text-[13px] text-ink-2">{isToday ? formatLongDate(date) : "A past day"}</p>
        </div>
        <nav aria-label="Other days" className="flex gap-1.5">
          <Link href={`/daily-wod?date=${shiftDate(date, -1)}`} aria-label="Previous day" className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </Link>
          {!isToday ? (
            <Link href={shiftDate(date, 1) >= today ? "/daily-wod" : `/daily-wod?date=${shiftDate(date, 1)}`} aria-label="Next day" className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </Link>
          ) : null}
        </nav>
      </div>
      <p className="m-0 text-[15px] text-ink-2">
        A new workout and stretch routine every day, the same for everyone, free with no account.
      </p>

      {wod ? (
        <Card title="The Daily 20" labelledBy="daily-20" aside={<span className="font-mono text-[13px] text-ink-2">{wod.formatLabel} · 20 min</span>}>
          <dl className="m-0 grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col"><dt className="text-ink-3">Level</dt><dd className="m-0 font-semibold">{levelLabel(wod.difficulty)}</dd></div>
            <div className="flex flex-col"><dt className="text-ink-3">Focus</dt><dd className="m-0 font-semibold">{bodyFocusLabel(wod.bodyFocus)}</dd></div>
            <div className="flex flex-col"><dt className="text-ink-3">Equipment</dt><dd className="m-0 font-semibold">{wod.equipment.length ? wod.equipment.join(", ") : "None"}</dd></div>
          </dl>
          <p className="m-0 text-[15px]">{wod.description}</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {wod.rows.map((r) => (
              <li key={r.movement} className="flex flex-col border-t border-divider py-3">
                <span className="flex items-baseline justify-between gap-3">
                  {linkFor(r.movement) ? (
                    <Link href={`/movements/${linkFor(r.movement)}`} className="text-lg font-bold text-ink">{r.movement}</Link>
                  ) : (
                    <span className="text-lg font-bold">{r.movement}</span>
                  )}
                  <span className="shrink-0 font-mono text-sm text-ink-2">{r.reps}</span>
                </span>
                {r.tip ? <span className="text-sm text-ink-2">{r.tip}</span> : null}
              </li>
            ))}
          </ul>
          <p className="m-0 rounded-xl bg-surface-muted px-3.5 py-2.5 text-[15px]"><strong>Score:</strong> {wod.scoring}</p>
        </Card>
      ) : null}

      {stretch ? (
        <Card title="The Daily 10" labelledBy="daily-10-title" aside={<span className="font-mono text-[13px] text-ink-2">{stretch.totalMin} min</span>}>
          <p className="m-0 font-semibold">{stretch.label}</p>
          <ol className="m-0 flex list-none flex-col p-0">
            {stretch.rows.map((s, i) => (
              <li key={s.slug} className="flex gap-3 border-t border-divider py-2.5">
                <span className="w-5 shrink-0 font-mono font-bold text-accent-text">{i + 1}</span>
                <span className="flex flex-1 flex-col">
                  <span className="flex items-baseline justify-between gap-3">
                    <Link href={`/stretches/${s.slug}`} className="font-bold text-ink">{s.name}</Link>
                    <span className="shrink-0 font-mono text-sm text-ink-2">{s.hold} sec{s.sides ? " each side" : ""}</span>
                  </span>
                  {s.tip ? <span className="text-sm text-ink-2">{s.tip}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      {wod ? (
        <BottomBar>
          <Link href={goHref} className={primaryAction}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2.5M9 2h6" />
            </svg>
            Start The Daily 20
          </Link>
        </BottomBar>
      ) : null}
    </div>
  );
}
