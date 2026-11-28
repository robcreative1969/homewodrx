import "server-only";
import type { Daily20 } from "@/lib/daily";
import type { GeneratedWorkout } from "@/lib/generator";
import { firstNumber, modeFromFormat, repLadder, type Session } from "@/lib/session";
import type { BenchmarkWorkout } from "@/lib/workouts";
import { scoreKindFor } from "@/lib/log";

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
    log: { source: "library", slug: w.slug, title: w.name, score: scoreKindFor(mode) },
  };
}

export function sessionFromDaily20(d: Daily20, today: boolean): Session {
  return {
    name: "The Daily 20",
    subtitle: `${d.formatLabel} · 20 min`,
    mode: d.format,
    minutes: d.format === "circuit" ? null : 20,
    rounds: d.rounds ?? null,
    rows: d.rows.map((r) => ({ name: r.movement, reps: repLadder(r.reps.replace(/^Minute \d+:\s*/, "").replace(/\s*reps$/, "")) })),
    backHref: today ? "/daily-wod" : `/daily-wod?date=${d.date}`,
    log: { source: "daily20", date: d.date, title: "The Daily 20", score: scoreKindFor(d.format) },
  };
}

/** A WOD Builder workout in workout mode. */
export function sessionFromGenerated(w: GeneratedWorkout, backHref: string, query: string): Session {
  return {
    name: w.title,
    subtitle: `${w.formatLabel} · ${w.minutes} min`,
    mode: w.format,
    minutes: w.format === "circuit" || w.format === "fortime" ? null : w.minutes,
    rounds: w.rounds ?? null,
    rows: w.rows.map((r) => ({ name: r.movement, reps: repLadder(r.reps.replace(/\s*reps$/, "")) })),
    backHref,
    log: { source: "builder", title: w.title, score: scoreKindFor(w.format), query },
  };
}
