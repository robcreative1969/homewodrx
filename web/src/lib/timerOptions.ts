import type { Session, SessionMode } from "@/lib/session";

// The standalone timer: any workout, timed in workout mode. Link format:
// /timer/go?mode=amrap&min=20   /timer/go?mode=tabata&blocks=2

export const TIMER_MODES: { mode: SessionMode; label: string; help: string }[] = [
  { mode: "amrap", label: "AMRAP", help: "Counts down. As many rounds as possible before time runs out." },
  { mode: "fortime", label: "For Time", help: "Counts up until you tap Finish, with an optional time cap." },
  { mode: "emom", label: "EMOM", help: "A new minute starts with a beep. Work, then rest until the next one." },
  { mode: "tabata", label: "Tabata", help: "20 seconds of work, 10 of rest, 8 rounds per exercise." },
];

export type TimerParams = { mode: SessionMode; minutes: number; blocks: number };

type Search = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const clamp = (n: number, lo: number, hi: number, d: number) => (Number.isFinite(n) && n >= lo && n <= hi ? Math.round(n) : d);

export function parseTimer(sp: Search): TimerParams {
  const m = first(sp.mode);
  const mode = TIMER_MODES.some((t) => t.mode === m) ? (m as SessionMode) : "amrap";
  return { mode, minutes: clamp(Number(first(sp.min)), 1, 90, mode === "fortime" ? 20 : 12), blocks: clamp(Number(first(sp.blocks)), 1, 8, 1) };
}

export function timerSession(p: TimerParams): Session {
  const label = TIMER_MODES.find((t) => t.mode === p.mode)?.label ?? "Timer";
  if (p.mode === "tabata") {
    return {
      name: "Tabata",
      subtitle: `${p.blocks} ${p.blocks === 1 ? "exercise" : "exercises"} · ${p.blocks * 4} min`,
      mode: "tabata",
      minutes: null,
      rounds: null,
      rows: Array.from({ length: p.blocks }, (_, i) => ({ name: p.blocks === 1 ? "Your exercise" : `Exercise ${i + 1}`, reps: [""] })),
      backHref: "/timer",
    };
  }
  return {
    name: label,
    subtitle: p.mode === "fortime" ? `Time cap ${p.minutes} min` : `${p.minutes} min`,
    mode: p.mode,
    minutes: p.minutes,
    rounds: null,
    rows: [{ name: "Your workout", reps: [""] }],
    backHref: "/timer",
  };
}
