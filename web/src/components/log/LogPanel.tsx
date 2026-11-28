"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { field, FormError, label, primaryButton, secondaryButton } from "@/components/account/ui";
import {
  bestEntry,
  entrySummary,
  formatDuration,
  LOG_COLUMNS,
  localDay,
  roundsDisplay,
  shortDate,
  type LogEntry,
  type LogTarget,
} from "@/lib/log";

type Prefill = { seconds?: number; rounds?: number; reps?: number };

const small = "h-12 w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3 text-center font-mono text-lg text-ink";

/**
 * "Mark as done" with an optional score, for a library workout, The Daily 20 or a WOD
 * Builder workout. Reads the session in the browser, so the pages around it stay cached.
 */
export function LogPanel({
  target,
  prefill,
  heading = "Log it",
  next,
}: {
  target: LogTarget;
  prefill?: Prefill;
  heading?: string;
  /** Where to come back to after signing up or logging in. Defaults to this page. */
  next?: string;
}) {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [open, setOpen] = useState(Boolean(prefill));
  const [min, setMin] = useState(prefill?.seconds != null ? String(Math.floor(prefill.seconds / 60)) : "");
  const [sec, setSec] = useState(prefill?.seconds != null ? String(Math.round(prefill.seconds) % 60).padStart(2, "0") : "");
  const [rounds, setRounds] = useState(prefill?.rounds != null ? String(prefill.rounds) : "");
  const [reps, setReps] = useState(prefill?.reps ? String(prefill.reps) : "");
  const [rx, setRx] = useState(true);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(localDay());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async (uid: string) => {
    if (target.source === "builder") return; // builder workouts change every time, so there's nothing to compare
    let q = createClient().from("results").select(LOG_COLUMNS).eq("user_id", uid);
    q = target.source === "library" ? q.eq("benchmark_slug", target.slug) : q.eq("daily20_date", target.date).eq("source", "daily20");
    const { data } = await q.order("date", { ascending: false }).order("created_at", { ascending: false }).limit(100);
    setEntries((data as LogEntry[] | null) ?? []);
  }, [target]);

  useEffect(() => {
    createClient().auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      if (uid) load(uid);
    });
  }, [load]);

  /** The score typed in, or null for "done" with no score. A string is a problem to show. */
  function readScore(): string | null | { display: string; seconds?: number; rounds?: number; reps?: number } {
    if (!open) return null;
    if (target.score === "time") {
      if (!min.trim() && !sec.trim()) return null;
      const m = Number(min || 0);
      const s = Number(sec || 0);
      if (!Number.isInteger(m) || !Number.isInteger(s) || m < 0 || s < 0 || s > 59) return "Type minutes, and seconds from 0 to 59.";
      const total = m * 60 + s;
      if (total <= 0) return null;
      return { display: formatDuration(total), seconds: total };
    }
    if (target.score === "rounds") {
      if (!rounds.trim() && !reps.trim()) return null;
      const r = Number(rounds || 0);
      const p = Number(reps || 0);
      if (!Number.isInteger(r) || !Number.isInteger(p) || r < 0 || p < 0) return "Type whole numbers for rounds and reps.";
      return { display: roundsDisplay(r, p), rounds: r, reps: p };
    }
    if (!reps.trim()) return null;
    const p = Number(reps);
    if (!Number.isInteger(p) || p < 0) return "Type a whole number of reps.";
    return { display: `${p} reps`, reps: p };
  }

  async function save() {
    if (!userId) return;
    const score = readScore();
    if (typeof score === "string") return setError(score);
    if (notes.length > 1000) return setError("Keep the note under 1,000 characters.");
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle();
    const row = {
      user_id: userId,
      username: profile?.username ?? "",
      source: target.source,
      title: target.title,
      benchmark_slug: target.source === "library" ? target.slug : null,
      daily20_date: target.source === "daily20" ? target.date : null,
      score_display: score?.display ?? null,
      score_seconds: score?.seconds ?? null,
      score_rounds: score?.rounds ?? null,
      score_reps: score?.reps ?? null,
      is_rx: score ? rx : null,
      notes: notes.trim() || null,
      date: date || localDay(),
    };
    const { error: err } = await supabase.from("results").insert(row);
    setBusy(false);
    if (err) return setError("That didn't save. Check your connection and try again.");
    setSaved(true);
    load(userId);
  }

  function again() {
    setSaved(false);
    setOpen(false);
    setMin("");
    setSec("");
    setRounds("");
    setReps("");
    setNotes("");
    setDate(localDay());
  }

  const best = bestEntry(entries, target.score);
  const recent = entries.slice(0, 3);

  if (userId === undefined) return <div className="min-h-[120px]" aria-hidden="true" />;

  if (userId === null) {
    const back = encodeURIComponent(next ?? (pathname || "/"));
    return (
      <section aria-labelledby="log-it" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px] text-ink">
        <h2 id="log-it" className="m-0 text-lg font-bold">{heading}</h2>
        <p className="m-0 text-[15px] text-ink-2">Create a free account to log this workout and see your best next time.</p>
        <div className="flex gap-2">
          <Link href={`/signup?next=${back}`} className={primaryButton}>Sign up</Link>
          <Link href={`/login?next=${back}`} className={secondaryButton}>Log in</Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="log-it" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px] text-ink">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="log-it" className="m-0 text-lg font-bold">{heading}</h2>
        {best ? (
          <span className="text-sm text-ink-2">
            Your best <span className="font-mono font-bold text-ink">{best.score_display}</span>
          </span>
        ) : null}
      </div>

      {saved ? (
        <div className="flex flex-col gap-3">
          <p role="status" className="m-0 rounded-xl border border-line bg-surface-muted p-3.5 text-[15px]">
            Logged{date === localDay() ? " for today" : ` for ${shortDate(date)}`}. Nice work.
          </p>
          <div className="flex gap-2">
            <Link href="/history" className={primaryButton}>See your history</Link>
            <button type="button" onClick={again} className={secondaryButton}>Log another</button>
          </div>
        </div>
      ) : (
        <>
          {open ? (
            <div className="flex flex-col gap-3">
              {target.score === "time" ? (
                <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                  <legend className={`${label} mb-1.5`}>Your time</legend>
                  <div className="flex items-center gap-2">
                    <input aria-label="Minutes" inputMode="numeric" placeholder="min" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} className={small} />
                    <span className="font-mono text-lg font-bold" aria-hidden="true">:</span>
                    <input aria-label="Seconds" inputMode="numeric" placeholder="sec" maxLength={2} value={sec} onChange={(e) => setSec(e.target.value.replace(/\D/g, ""))} className={small} />
                  </div>
                </fieldset>
              ) : target.score === "rounds" ? (
                <div className="flex gap-2">
                  <label className="flex flex-1 flex-col gap-1.5">
                    <span className={label}>Rounds</span>
                    <input inputMode="numeric" value={rounds} onChange={(e) => setRounds(e.target.value.replace(/\D/g, ""))} className={small} />
                  </label>
                  <label className="flex flex-1 flex-col gap-1.5">
                    <span className={label}>Extra reps</span>
                    <input inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value.replace(/\D/g, ""))} className={small} />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col gap-1.5">
                  <span className={label}>Total reps</span>
                  <input inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value.replace(/\D/g, ""))} className={small} />
                </label>
              )}

              <div role="radiogroup" aria-label="Rx or scaled" className="flex gap-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    role="radio"
                    aria-checked={rx === v}
                    onClick={() => setRx(v)}
                    className={`h-11 flex-1 rounded-xl border-[1.5px] font-bold ${rx === v ? "border-accent bg-accent text-accent-ink" : "border-chip-line bg-surface text-ink"}`}
                  >
                    {v ? "Rx" : "Scaled"}
                  </button>
                ))}
              </div>

              <label className="flex flex-col gap-1.5">
                <span className={label}>Note</span>
                <textarea rows={2} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Weights used, how it felt" className={`${field} h-auto py-2.5`} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={label}>Date</span>
                <input type="date" max={localDay()} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
              </label>
            </div>
          ) : null}

          <FormError>{error}</FormError>
          <button type="button" onClick={save} disabled={busy} className={primaryButton}>
            {busy ? "Saving…" : open ? "Save" : "Mark as done"}
          </button>
          {open ? null : (
            <button type="button" onClick={() => setOpen(true)} className={secondaryButton}>
              Add your score
            </button>
          )}
        </>
      )}

      {recent.length ? (
        <div className="flex flex-col">
          <h3 className="m-0 mb-1 text-sm font-semibold text-ink-2">Your last {recent.length === 1 ? "time" : `${recent.length} times`}</h3>
          <ul className="m-0 flex list-none flex-col p-0">
            {recent.map((e) => (
              <li key={e.id} className="flex items-baseline justify-between gap-3 border-t border-divider py-2.5 text-[15px]">
                <span className="text-ink-2">{shortDate(e.date)}</span>
                <span className="font-mono font-bold">{entrySummary(e)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
