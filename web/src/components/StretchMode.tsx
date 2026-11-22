"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StretchSession } from "@/lib/stretchSession";

type Status = "ready" | "countdown" | "running" | "paused" | "done";

// Time to get into position before each stretch, and to change sides.
const SETUP = 10;
const SWITCH = 5;

type Segment = {
  step: number;
  kind: "setup" | "hold" | "switch" | "manual";
  /** 1 or 2 for stretches done on both sides. */
  side: 0 | 1 | 2;
  /** Length in seconds; null waits for a tap. */
  seconds: number | null;
};

function clock(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Full-screen follow-along timer for a stretch routine, in the style of workout mode. */
export function StretchMode({ session }: { session: StretchSession }) {
  const { steps } = session;
  const segments = useMemo(() => {
    const out: Segment[] = [];
    steps.forEach((s, i) => {
      out.push({ step: i, kind: "setup", side: 0, seconds: SETUP });
      const kind = s.seconds ? "hold" : "manual";
      if (s.sides && s.seconds) {
        out.push({ step: i, kind, side: 1, seconds: s.seconds });
        out.push({ step: i, kind: "switch", side: 2, seconds: SWITCH });
        out.push({ step: i, kind, side: 2, seconds: s.seconds });
      } else {
        out.push({ step: i, kind, side: 0, seconds: s.seconds });
      }
    });
    return out;
  }, [steps]);

  const [status, setStatus] = useState<Status>("ready");
  const [countdown, setCountdown] = useState(3);
  const [seg, setSeg] = useState(0);
  const [segAccum, setSegAccum] = useState(0); // ms in this segment before the current run
  const [segStart, setSegStart] = useState<number | null>(null);
  const [totalAccum, setTotalAccum] = useState(0);
  const [now, setNow] = useState(0);
  const [sound, setSound] = useState(true);
  const audio = useRef<AudioContext | null>(null);
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null);
  const lastBeep = useRef(-1);

  const running = status === "running" && segStart !== null;
  const inSeg = (segAccum + (running ? now - segStart : 0)) / 1000;
  const total = (totalAccum + segAccum + (running ? now - segStart : 0)) / 1000;
  const current = segments[seg];

  const beep = useCallback(
    (freq = 880, ms = 180) => {
      if (!sound || !audio.current) return;
      const ctx = audio.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime;
      const end = t + ms / 1000;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.01);
      gain.gain.setValueAtTime(0.5, end - 0.02);
      gain.gain.linearRampToValueAtTime(0, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(end);
    },
    [sound],
  );

  const release = () => {
    wakeLock.current?.release().catch(() => {});
    wakeLock.current = null;
  };

  const advance = useCallback(
    (at: number) => {
      setTotalAccum((t) => t + segAccum + (segStart !== null ? at - segStart : 0));
      setSegAccum(0);
      lastBeep.current = -1;
      if (seg >= segments.length - 1) {
        setSegStart(null);
        setStatus("done");
        beep(660, 600);
        release();
        return;
      }
      const next = segments[seg + 1];
      setSeg(seg + 1);
      setSegStart(at);
      beep(next.kind === "hold" || next.kind === "manual" ? 1320 : 1100, next.kind === "hold" ? 300 : 150);
    },
    [seg, segments, segAccum, segStart, beep],
  );

  // 3-2-1 before the first stretch.
  useEffect(() => {
    if (status !== "countdown") return;
    beep(880, 150);
    const id = window.setTimeout(() => {
      if (countdown <= 1) {
        const t = performance.now();
        setSegStart(t);
        setNow(t);
        setStatus("running");
        beep(1320, 300);
      } else {
        setCountdown((c) => c - 1);
      }
    }, 1000);
    return () => window.clearTimeout(id);
  }, [status, countdown, beep]);

  // Moves through timed segments and beeps the last three seconds of each hold.
  useEffect(() => {
    if (status !== "running" || segStart === null || !current) return;
    const id = window.setInterval(() => {
      const t = performance.now();
      setNow(t);
      if (current.seconds === null) return;
      const el = (segAccum + t - segStart) / 1000;
      if (el >= current.seconds) {
        advance(t);
        return;
      }
      const left = Math.ceil(current.seconds - el);
      if (left !== lastBeep.current && left <= 3 && current.kind === "hold") {
        lastBeep.current = left;
        beep(880, 120);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [status, segStart, segAccum, current, advance, beep]);

  useEffect(
    () => () => {
      wakeLock.current?.release().catch(() => {});
      audio.current?.close().catch(() => {});
    },
    [],
  );

  async function start() {
    try {
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
    if (status === "running" && segStart !== null) {
      setSegAccum((a) => a + performance.now() - segStart);
      setSegStart(null);
      setStatus("paused");
    } else if (status === "paused") {
      const t = performance.now();
      setSegStart(t);
      setNow(t);
      setStatus("running");
    }
  }

  function finish() {
    setTotalAccum((t) => t + segAccum + (segStart !== null ? performance.now() - segStart : 0));
    setSegAccum(0);
    setSegStart(null);
    setStatus("done");
    beep(660, 600);
    release();
  }

  const step = current ? steps[current.step] : null;
  const nextStep = current ? steps[current.step + 1] : null;
  const sideLabel = current?.side === 1 ? "First side" : current?.side === 2 ? "Second side" : null;
  let label = "Hold";
  if (current?.kind === "setup") label = "Get into position";
  else if (current?.kind === "switch") label = "Switch sides";
  else if (current?.kind === "manual") label = step?.dose ?? "Your pace";
  else if (sideLabel) label = `Hold · ${sideLabel.toLowerCase()}`;
  const bigValue = current?.seconds ? clock(current.seconds - inSeg) : clock(total);

  return (
    <div className="workout-mode fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ground text-ink">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <Link href={session.backHref} aria-label="Close stretch mode" className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-ink">
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
            <ol className="m-0 flex list-none flex-col gap-0 rounded-[20px] bg-surface p-5">
              {steps.map((s, i) => (
                <li key={`${s.name}-${i}`} className="flex gap-3 border-t border-line py-2 first:border-t-0">
                  <span className="w-5 shrink-0 font-mono font-bold text-accent-text">{i + 1}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-bold">{s.name}</span>
                    <span className="font-mono text-sm text-ink-2">{s.dose}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="m-0 text-center text-sm text-ink-2">
              You get {SETUP} seconds to get into each stretch. Timed holds move on by themselves; for reps, tap Done when you&apos;ve finished.
            </p>
            <button type="button" onClick={start} className="mt-auto h-16 rounded-2xl bg-accent text-lg font-bold text-accent-ink">
              Start
            </button>
          </div>
        ) : status === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="text-[13px] font-semibold tracking-[2px] text-ink-3 uppercase">Finished</span>
            <span className="font-mono text-7xl font-extrabold tracking-tighter">{clock(total)}</span>
            <p className="m-0 max-w-sm text-ink-2">Nice work. Breathe easy for a minute before you get up.</p>
            <Link href={session.backHref} className="flex h-14 w-full max-w-sm items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink no-underline">
              Done
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1 pt-3" aria-live="polite">
              <span className="text-center text-[13px] font-semibold tracking-[2px] text-ink-3 uppercase">
                {status === "countdown" ? "Get ready" : status === "paused" ? "Paused" : label}
              </span>
              <span className="font-mono text-[88px] leading-none font-extrabold tracking-[-3px] sm:text-[112px]">
                {status === "countdown" ? countdown : bigValue}
              </span>
              <span className="mt-1 text-sm text-ink-2">
                Stretch {(current?.step ?? 0) + 1} of {steps.length}
                {current?.seconds === null ? "" : ` · ${clock(total)} total`}
              </span>
            </div>

            {step ? (
              <div className="flex flex-col gap-1.5 rounded-[20px] bg-surface px-5 py-5">
                <span className="text-[13px] font-semibold tracking-[2px] text-accent-text uppercase">
                  {current?.kind === "setup" ? "Next up" : "Now"}
                  {sideLabel && current?.kind !== "setup" ? ` · ${sideLabel}` : ""}
                </span>
                <span className="text-[28px] leading-tight font-extrabold">{step.name}</span>
                <span className="font-mono text-[15px] text-ink-2">{step.dose}</span>
                {step.tip ? <span className="text-[15px] text-ink-2">{step.tip}</span> : null}
              </div>
            ) : null}

            {nextStep ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3.5">
                <span className="text-sm text-ink-3">Then</span>
                <span className="text-right font-bold">{nextStep.name}</span>
              </div>
            ) : null}

            <div className="mt-auto flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={pause}
                  disabled={status === "countdown"}
                  className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-surface text-lg font-bold text-ink disabled:opacity-50"
                >
                  {status === "paused" ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={() => advance(performance.now())}
                  disabled={status !== "running"}
                  className="h-16 rounded-2xl bg-accent text-lg font-bold text-accent-ink disabled:opacity-50"
                >
                  {current?.kind === "manual" ? "Done, next" : "Skip"}
                </button>
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
