"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { repsForRound, type Session } from "@/lib/session";

type Status = "ready" | "countdown" | "running" | "paused" | "done";

const TABATA_WORK = 20;
const TABATA_REST = 10;
const TABATA_ROUNDS = 8;

function clock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Full-screen, dark timer that walks through a workout (STYLE-GUIDE.md §5). */
export function WorkoutMode({ session }: { session: Session }) {
  const { mode, rows } = session;
  const capSeconds =
    mode === "tabata" ? rows.length * TABATA_ROUNDS * (TABATA_WORK + TABATA_REST) : session.minutes ? session.minutes * 60 : null;
  const rounds = session.rounds ?? (mode === "fortime" ? Math.max(...rows.map((r) => r.reps.length)) : null);

  const [status, setStatus] = useState<Status>("ready");
  const [countdown, setCountdown] = useState(3);
  const [accumulated, setAccumulated] = useState(0); // ms before the current run
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [index, setIndex] = useState(0); // movement within the round
  const [round, setRound] = useState(1);
  const [sound, setSound] = useState(true);
  const [finalSeconds, setFinalSeconds] = useState<number | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null);
  const lastBeep = useRef<number>(-1);

  const elapsed = (accumulated + (status === "running" && startedAt !== null ? now - startedAt : 0)) / 1000;

  const beep = useCallback(
    (freq = 880, ms = 180) => {
      if (!sound || !audio.current) return;
      const ctx = audio.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // A triangle wave cuts through gym noise better than a pure tone; the short fade
      // in and out stops it clicking.
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime;
      const end = t + ms / 1000;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.6, t + 0.01);
      gain.gain.setValueAtTime(0.6, end - 0.02);
      gain.gain.linearRampToValueAtTime(0, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(end);
    },
    [sound],
  );

  const stop = useCallback(
    (seconds: number) => {
      setFinalSeconds(seconds);
      setStatus("done");
      beep(660, 600);
      wakeLock.current?.release().catch(() => {});
      wakeLock.current = null;
    },
    [beep],
  );

  const finish = () => stop(elapsed);

  // 3-2-1 before the clock starts. State changes happen in the timer callback.
  useEffect(() => {
    if (status !== "countdown") return;
    beep(880, 150);
    const id = window.setTimeout(() => {
      if (countdown <= 1) {
        beep(1320, 300);
        const t = performance.now();
        setStartedAt(t);
        setNow(t);
        setStatus("running");
      } else {
        setCountdown((c) => c - 1);
      }
    }, 1000);
    return () => window.clearTimeout(id);
  }, [status, countdown, beep]);

  // The running clock: redraws five times a second and handles caps, EMOM minutes,
  // Tabata intervals and the last-three-seconds beeps.
  useEffect(() => {
    if (status !== "running" || startedAt === null) return;
    const id = window.setInterval(() => {
      const t = performance.now();
      setNow(t);
      const el = (accumulated + t - startedAt) / 1000;
      if (capSeconds !== null && el >= capSeconds) {
        stop(capSeconds);
        return;
      }
      const second = Math.floor(el);
      if (second === lastBeep.current) return;
      lastBeep.current = second;
      if (mode === "emom" && second > 0 && second % 60 === 0) beep(1320, 300);
      if (mode === "emom" && second % 60 >= 57) beep(880, 120);
      if (mode === "tabata") {
        const phase = second % (TABATA_WORK + TABATA_REST);
        if (second > 0 && (phase === 0 || phase === TABATA_WORK)) beep(1320, 300);
      }
      if (capSeconds !== null && capSeconds - second <= 3 && capSeconds - second > 0) beep(880, 120);
    }, 200);
    return () => window.clearInterval(id);
  }, [status, startedAt, accumulated, capSeconds, mode, beep, stop]);

  useEffect(
    () => () => {
      wakeLock.current?.release().catch(() => {});
      audio.current?.close().catch(() => {});
    },
    [],
  );

  async function start() {
    // Audio and wake lock need a tap to begin on phones.
    try {
      // iPhones mute website sounds when the silent switch is on unless the page asks to
      // play like a media app.
      const nav = navigator as Navigator & { audioSession?: { type: string } };
      if (nav.audioSession) nav.audioSession.type = "playback";
    } catch {
      // Older browsers: sound follows the silent switch.
    }
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
    } catch {
      // No sound on this device.
    }
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
      wakeLock.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      // The screen may dim; the timer keeps time either way.
    }
    setCountdown(3);
    setStatus("countdown");
  }

  function pause() {
    if (status === "running" && startedAt !== null) {
      setAccumulated((a) => a + performance.now() - startedAt);
      setStartedAt(null);
      setStatus("paused");
    } else if (status === "paused") {
      setStartedAt(performance.now());
      setNow(performance.now());
      setStatus("running");
    }
  }

  function next() {
    if (index < rows.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (rounds !== null && round >= rounds && (mode === "fortime" || mode === "circuit")) {
      finish();
      return;
    }
    setIndex(0);
    setRound(round + 1);
    beep(1100, 150);
  }

  // What is happening right now.
  let current = rows[index];
  let upNext = rows[index + 1] ?? rows[0];
  let clockLabel = "Elapsed";
  let clockValue = clock(elapsed);
  let phaseNote: string | null = null;
  if (mode === "amrap" && capSeconds) {
    clockLabel = "Remaining";
    clockValue = clock(capSeconds - elapsed);
  } else if (mode === "emom") {
    const minute = Math.floor(elapsed / 60);
    current = rows[minute % rows.length];
    upNext = rows[(minute + 1) % rows.length];
    clockLabel = `Minute ${Math.min(minute + 1, session.minutes ?? minute + 1)} of ${session.minutes ?? "?"}`;
    clockValue = clock(60 - (elapsed % 60));
  } else if (mode === "tabata") {
    const interval = TABATA_WORK + TABATA_REST;
    const block = Math.floor(elapsed / interval);
    const within = elapsed % interval;
    const working = within < TABATA_WORK;
    current = rows[Math.floor(block / TABATA_ROUNDS)] ?? rows[rows.length - 1];
    upNext = working ? current : rows[Math.floor((block + 1) / TABATA_ROUNDS)] ?? current;
    clockLabel = `${working ? "Work" : "Rest"} · round ${(block % TABATA_ROUNDS) + 1} of ${TABATA_ROUNDS}`;
    clockValue = clock(working ? TABATA_WORK - within : interval - within);
    phaseNote = working ? null : "Rest";
  } else if (capSeconds) {
    phaseNote = `Time cap ${clock(capSeconds)}`;
  }

  const manualSteps = mode === "fortime" || mode === "circuit" || mode === "amrap";
  const repsNow = current ? repsForRound(current, round) : "";
  const roundsDone = round - 1;
  const repsIntoRound = rows.slice(0, index).reduce((sum, r) => sum + (Number(repsForRound(r, round)) || 0), 0);

  return (
    <div className="workout-mode fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ground text-ink">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <Link href={session.backHref} aria-label="Close workout mode" className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </Link>
          <div className="flex flex-col items-center text-center">
            <span className="text-lg font-extrabold">{session.name}</span>
            <span className="text-[13px] text-ink-3">{session.subtitle}</span>
          </div>
          <button
            type="button"
            onClick={() => setSound((s) => !s)}
            aria-label={sound ? "Turn sound off" : "Turn sound on"}
            aria-pressed={sound}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              {sound ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m16 9 5 6M21 9l-5 6" />}
            </svg>
          </button>
        </div>

        {status === "ready" ? (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2 rounded-[20px] bg-surface p-5">
              {rows.map((r, i) => (
                <div key={`${r.name}-${i}`} className="flex items-baseline justify-between gap-3 border-t border-line py-2 first:border-t-0">
                  <span className="font-bold">
                    <span className="mr-2 font-mono text-accent-text">{r.reps.join("-")}</span>
                    {r.name}
                  </span>
                  {r.load ? <span className="shrink-0 font-mono text-sm text-ink-2">{r.load}</span> : null}
                </div>
              ))}
            </div>
            <p className="m-0 text-center text-sm text-ink-2">
              {mode === "amrap" && `As many rounds as possible in ${session.minutes} minutes. Tap Next as you finish each movement.`}
              {mode === "emom" && `Every minute on the minute for ${session.minutes} minutes. The screen moves on by itself.`}
              {mode === "tabata" && "20 seconds of work, 10 seconds of rest, 8 rounds per movement."}
              {(mode === "fortime" || mode === "circuit") && "Tap Next as you finish each movement. The clock stops after the last one."}
            </p>
            <button type="button" onClick={start} className="mt-auto h-16 rounded-2xl bg-accent text-lg font-bold text-accent-ink">
              Start
            </button>
          </div>
        ) : status === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="text-[13px] font-semibold tracking-[2px] text-ink-3 uppercase">Finished</span>
            {mode === "amrap" ? (
              <span className="font-mono text-5xl font-extrabold">
                {roundsDone} {roundsDone === 1 ? "round" : "rounds"}{repsIntoRound ? ` + ${repsIntoRound} reps` : ""}
              </span>
            ) : (
              <span className="font-mono text-7xl font-extrabold tracking-tighter">{clock(finalSeconds ?? elapsed)}</span>
            )}
            <p className="m-0 max-w-sm text-ink-2">
              Write it down. Logging results on HomeWODRx arrives with accounts in the new site.
            </p>
            <Link href={session.backHref} className="flex h-14 w-full max-w-sm items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink no-underline">
              Back to the workout
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1 pt-3" aria-live="polite">
              <span className="text-[13px] font-semibold tracking-[2px] text-ink-3 uppercase">
                {status === "countdown" ? "Get ready" : status === "paused" ? "Paused" : clockLabel}
              </span>
              <span className="font-mono text-[88px] leading-none font-extrabold tracking-[-3px] sm:text-[112px]">
                {status === "countdown" ? countdown : clockValue}
              </span>
              {rounds && rounds <= 12 && manualSteps ? (
                <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
                  {Array.from({ length: rounds }, (_, i) => (
                    <span key={i} className={`h-1.5 w-10 rounded-full ${i < round - 1 ? "bg-accent" : i === round - 1 ? "bg-accent opacity-55" : "bg-line"}`} />
                  ))}
                </div>
              ) : null}
              {manualSteps ? (
                <span className="mt-1 text-sm text-ink-2">
                  Round {round}
                  {rounds ? ` of ${rounds}` : ""}
                </span>
              ) : null}
              {phaseNote ? <span className="text-sm text-ink-2">{phaseNote}</span> : null}
            </div>

            {current ? (
              <div className="flex flex-col gap-1.5 rounded-[20px] bg-surface px-5 py-5">
                <span className="text-[13px] font-semibold tracking-[2px] text-accent-text uppercase">Now</span>
                <div className="flex items-baseline gap-3.5">
                  {repsNow && /^\d+$/.test(repsNow) ? (
                    <>
                      <span className="font-mono text-[60px] leading-none font-extrabold">{repsNow}</span>
                      <span className="text-[28px] leading-tight font-extrabold">{current.name}</span>
                    </>
                  ) : (
                    <span className="text-[28px] leading-tight font-extrabold">
                      {repsNow ? <span className="mr-2 font-mono">{repsNow}</span> : null}
                      {current.name}
                    </span>
                  )}
                </div>
                {current.load ? <span className="font-mono text-[15px] text-ink-2">{current.load}</span> : null}
              </div>
            ) : null}

            {upNext && rows.length > 1 && mode !== "tabata" ? (
              <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3.5">
                <span className="text-sm text-ink-3">Up next</span>
                <span className="font-bold">{upNext.name}</span>
              </div>
            ) : null}

            <div className="mt-auto flex flex-col gap-2.5">
              <div className={`grid gap-2.5 ${manualSteps ? "grid-cols-2" : "grid-cols-1"}`}>
                <button
                  type="button"
                  onClick={pause}
                  disabled={status === "countdown"}
                  className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-surface text-lg font-bold text-ink disabled:opacity-50"
                >
                  {status === "paused" ? "Resume" : "Pause"}
                </button>
                {manualSteps ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={status !== "running"}
                    className="h-16 rounded-2xl bg-accent text-lg font-bold text-accent-ink disabled:opacity-50"
                  >
                    Next movement
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={finish}
                disabled={status === "countdown"}
                className="h-12 rounded-[14px] border border-line bg-transparent font-semibold text-ink disabled:opacity-50"
              >
                Finish
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
