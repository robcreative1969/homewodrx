import "server-only";
import type { Daily20 } from "@/lib/daily";
import { firstNumber, modeFromFormat, repLadder, type Session } from "@/lib/session";
import type { BenchmarkWorkout } from "@/lib/workouts";

export function sessionFromBenchmark(w: BenchmarkWorkout): Session {
  const mode = modeFromFormat(w.format);
  const minutes =
    mode === "amrap" || mode === "emom"
      ? firstNumber(w.format) ?? firstNumber(w.duration_estimate) ?? 20
      : null;
  const stated = (w.scheme ?? "").match(/(\d+)\s*rounds?/i);
  return {
    name: w.name,
    subtitle: w.scheme ?? w.format ?? "",
    mode,
    minutes,
    rounds: stated ? Number(stated[1]) : null,
    rows: (w.movements ?? []).map((m) => ({
      name: m.name,
      reps: repLadder(m.reps),
      load: [m.rx_men, m.rx_women].filter(Boolean).join(" / ") || undefined,
    })),
    backHref: `/workouts/${w.slug}`,
  };
}

export function sessionFromDaily20(d: Daily20, today: boolean): Session {
  return {
    name: "The Daily 20",
    subtitle: `${d.formatLabel} · 20 min`,
    mode: d.format,
    minutes: d.format === "circuit" ? null : 20,
    rounds: d.rounds ?? null,
    rows: d.rows.map((r) => ({ name: r.movement, reps: [r.reps.replace(/^Minute \d+:\s*/, "")] })),
    backHref: today ? "/daily-wod" : `/daily-wod?date=${d.date}`,
  };
}
