import type { Metadata } from "next";
import { TIMER_MODES } from "@/lib/timerOptions";

export const metadata: Metadata = {
  title: "WOD Timer",
  description: "A free workout timer for AMRAP, For Time, EMOM and Tabata, with beeps and a 3-2-1 countdown.",
  alternates: { canonical: "https://homewodrx.com/timer" },
};

const input = "h-12 w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 text-base text-ink";

export default function TimerPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-5 pb-16">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">WOD Timer</h1>
        <p className="m-0 text-ink-2">Pick a format and a length, then start. Beeps count you in and mark each minute or interval.</p>
      </div>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
        {TIMER_MODES.map((t) => (
          <li key={t.mode}>
            <form action="/timer/go" className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
              <input type="hidden" name="mode" value={t.mode} />
              <div className="flex flex-col gap-1">
                <h2 className="m-0 text-xl font-extrabold">{t.label}</h2>
                <p className="m-0 text-sm text-ink-2">{t.help}</p>
              </div>
              {t.mode === "tabata" ? (
                <label className="flex flex-col gap-1.5 text-sm font-bold">
                  Exercises
                  <select name="blocks" defaultValue="1" className={input}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} ({n * 4} min)</option>)}
                  </select>
                </label>
              ) : (
                <label className="flex flex-col gap-1.5 text-sm font-bold">
                  {t.mode === "fortime" ? "Time cap (minutes)" : "Minutes"}
                  <input name="min" type="number" min="1" max="90" defaultValue={t.mode === "fortime" ? 20 : t.mode === "emom" ? 10 : 12} className={input} />
                </label>
              )}
              <button type="submit" className="mt-auto h-12 rounded-xl bg-accent font-bold text-accent-ink">Start {t.label}</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
