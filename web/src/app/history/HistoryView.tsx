"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/Card";
import { secondaryButton } from "@/components/account/ui";
import {
  addDays,
  consistency,
  entryHref,
  entrySummary,
  entryTitle,
  localDay,
  shortDate,
  type LogEntry,
} from "@/lib/log";
import { ActivityForm } from "./ActivityForm";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const PAGE = 30; // days shown before "Show more"

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shiftMonth(ym: string, n: number) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const noSubscribe = () => () => {};

export function HistoryView({ entries }: { entries: LogEntry[] }) {
  // "Today" is the visitor's own day, so it's read in the browser, not on the server.
  const today = useSyncExternalStore(noSubscribe, () => localDay(), () => null);
  if (!today) return <div className="min-h-[420px]" aria-hidden="true" />;
  return <History entries={entries} today={today} />;
}

function History({ entries, today }: { entries: LogEntry[]; today: string }) {
  const router = useRouter();
  const stats = useMemo(() => consistency(entries, today), [entries, today]);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [shown, setShown] = useState(PAGE);
  const [logging, setLogging] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  // The day picked on the calendar: scrolled to and briefly highlighted in Your log.
  const [picked, setPicked] = useState<{ day: string } | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, LogEntry[]>();
    for (const e of entries) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, [entries]);
  const days = [...byDay.keys()]; // newest first, as the page sorted them

  /** Calendar tap: load older days if that one isn't shown yet, then jump to it. */
  function pick(day: string) {
    const i = days.indexOf(day);
    if (i >= shown) setShown(Math.ceil((i + 1) / PAGE) * PAGE);
    setPicked({ day }); // a new object, so tapping the same day again re-runs the jump
  }

  useEffect(() => {
    if (!picked) return;
    const el = document.getElementById(`day-${picked.day}`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el?.focus({ preventScroll: true });
    const t = window.setTimeout(() => setPicked(null), 1800);
    return () => window.clearTimeout(t);
  }, [picked]);

  // The month grid starts on a Monday, with blanks before the 1st.
  const first = `${month}-01`;
  const lead = (new Date(Number(month.slice(0, 4)), Number(month.slice(5)) - 1, 1).getDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = first; d.startsWith(month); d = addDays(d, 1)) cells.push(d);

  async function remove(e: LogEntry) {
    if (!window.confirm(`Delete ${entryTitle(e)} on ${shortDate(e.date)}? This can't be undone.`)) return;
    setDeleting(e.id);
    const { error } = await createClient().from("results").delete().eq("id", e.id);
    setDeleting(null);
    if (error) return window.alert("That didn't delete. Check your connection and try again.");
    router.refresh();
  }

  return (
    <>
      <Card title="Consistency" labelledBy="consistency">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-[56px] leading-none font-extrabold tracking-tight">{stats.weekStreak}</span>
            <span className="font-semibold">{stats.weekStreak === 1 ? "week" : "weeks"} in a row</span>
            <span className="text-[13px] text-ink-2">Weeks with at least one logged day</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-2xl font-extrabold">{stats.dayStreak}</span>
            <span className="text-sm text-ink-2">{stats.dayStreak === 1 ? "day" : "days"} in a row</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink-2">This week</span>
          <ol className="m-0 grid list-none grid-cols-7 gap-1.5 p-0">
            {stats.thisWeek.map((d, i) => (
              <li key={d.day} className="flex flex-col items-center gap-1">
                <span className={`text-xs ${d.isToday ? "font-bold text-ink" : "text-ink-3"}`}>{WEEKDAYS[i]}</span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] ${
                    d.logged ? "border-accent bg-accent text-accent-ink" : d.isToday ? "border-ink" : d.future ? "border-line" : "border-chip-line"
                  }`}
                >
                  {d.logged ? <span aria-hidden="true">✓</span> : null}
                  <span className="sr-only">{`${shortDate(d.day)}: ${d.logged ? "logged" : "nothing logged"}`}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <dl className="m-0 grid grid-cols-3 gap-2 border-t border-divider pt-3 text-sm">
          <div className="flex flex-col"><dt className="text-ink-3">This month</dt><dd className="m-0 font-mono font-bold">{stats.daysThisMonth} {stats.daysThisMonth === 1 ? "day" : "days"}</dd></div>
          <div className="flex flex-col"><dt className="text-ink-3">This year</dt><dd className="m-0 font-mono font-bold">{stats.daysThisYear} {stats.daysThisYear === 1 ? "day" : "days"}</dd></div>
          <div className="flex flex-col"><dt className="text-ink-3">All logged</dt><dd className="m-0 font-mono font-bold">{stats.totalEntries}</dd></div>
        </dl>
      </Card>

      {logging ? (
        <ActivityForm
          onDone={() => {
            setLogging(false);
            router.refresh();
          }}
          onCancel={() => setLogging(false)}
        />
      ) : (
        <button type="button" onClick={() => setLogging(true)} className={secondaryButton}>
          Log an activity
        </button>
      )}

      <Card
        title={monthLabel(month)}
        labelledBy="calendar"
        aside={
          <span className="flex gap-1.5">
            <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month" className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink">‹</button>
            <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} disabled={month >= today.slice(0, 7)} aria-label="Next month" className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink disabled:opacity-40">›</button>
          </span>
        }
      >
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w, i) => (
            <span key={i} className="text-xs text-ink-3" aria-hidden="true">{w}</span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} />;
            const logged = byDay.has(d);
            const n = Number(d.slice(8));
            const cls = `flex aspect-square items-center justify-center rounded-lg text-sm ${
              logged ? "bg-accent font-bold text-accent-ink no-underline" : d === today ? "border-[1.5px] border-ink font-bold text-ink" : d > today ? "text-ink-3" : "text-ink-2"
            }`;
            return logged ? (
              <button key={d} type="button" onClick={() => pick(d)} className={cls} aria-label={`${shortDate(d)}: logged. Show this day`}>{n}</button>
            ) : (
              <span key={d} className={cls}>{n}</span>
            );
          })}
        </div>
      </Card>

      {days.length ? (
        <section aria-labelledby="log-list" className="flex flex-col gap-3">
          <h2 id="log-list" className="m-0 px-1 text-lg font-bold">Your log</h2>
          {days.slice(0, shown).map((day) => (
            <div
              key={day}
              id={`day-${day}`}
              tabIndex={-1}
              className={`flex scroll-mt-20 flex-col rounded-2xl border bg-surface px-[18px] py-2 outline-none transition-[border-color,box-shadow] duration-500 ${
                picked?.day === day ? "border-accent ring-[3px] ring-accent" : "border-line"
              }`}
            >
              <h3 className="m-0 py-2 text-sm font-semibold text-ink-2">{day === today ? "Today" : day === addDays(today, -1) ? "Yesterday" : shortDate(day)}</h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {byDay.get(day)!.map((e) => {
                  const href = entryHref(e);
                  return (
                    <li key={e.id} className="flex items-center justify-between gap-3 border-t border-divider py-3">
                      <span className="flex min-w-0 flex-col">
                        {href ? (
                          <Link href={href} className="font-bold text-ink">{entryTitle(e)}</Link>
                        ) : (
                          <span className="font-bold">{entryTitle(e)}</span>
                        )}
                        <span className="font-mono text-sm text-ink-2">{entrySummary(e)}</span>
                        {e.notes ? <span className="text-sm text-ink-2">{e.notes}</span> : null}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(e)}
                        disabled={deleting === e.id}
                        className="flex h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-ink-2 disabled:opacity-50"
                        aria-label={`Delete ${entryTitle(e)} on ${shortDate(e.date)}`}
                      >
                        {deleting === e.id ? "Deleting…" : "Delete"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {days.length > shown ? (
            <button type="button" onClick={() => setShown(shown + PAGE)} className={secondaryButton}>
              Show more
            </button>
          ) : null}
        </section>
      ) : (
        <Card>
          <p className="m-0 text-[15px] text-ink-2">
            Nothing logged yet. Tap Mark as done on any workout, or log a run, walk or ride above.
          </p>
          <Link href="/daily-wod" className={secondaryButton}>Go to The Daily 20</Link>
        </Card>
      )}
    </>
  );
}
