import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomBar, primaryAction } from "@/components/BottomBar";
import { Card } from "@/components/Card";
import {
  EQUIPMENT,
  FOCUSES,
  FORMATS,
  LEVELS,
  MINUTES,
  builderQuery,
  equipmentLabel,
  newSeed,
  parseBuilderParams,
} from "@/lib/builderOptions";
import { generateWorkout } from "@/lib/generator";
import { loadMovementPool } from "@/lib/movementPool";

export async function generateMetadata({ searchParams }: PageProps<"/wodbuilder">): Promise<Metadata> {
  const built = parseBuilderParams(await searchParams);
  return {
    title: "WOD Builder",
    description: "Tell the WOD Builder your equipment, time and focus, and it builds a workout for you. Free, no account needed.",
    alternates: { canonical: "https://homewodrx.com/wodbuilder" },
    // Built workouts have endless addresses; only the builder itself belongs in search.
    robots: built ? { index: false, follow: true } : undefined,
  };
}

const chip =
  "flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-chip-line bg-surface px-3.5 text-sm font-semibold text-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent";
const segment =
  "flex h-11 cursor-pointer items-center justify-center rounded-[9px] font-mono text-[15px] font-bold text-ink has-[:checked]:bg-ink has-[:checked]:text-ground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent";

export default async function BuilderPage({ searchParams }: PageProps<"/wodbuilder">) {
  const params = parseBuilderParams(await searchParams);
  // A choice without a seed gets one, so every built workout has a link that rebuilds it.
  if (params && !params.seed) redirect(`/wodbuilder?${builderQuery(params, newSeed())}`);

  const workout = params?.seed ? generateWorkout(await loadMovementPool(), params, params.seed) : null;
  const query = params ? builderQuery(params) : "";
  const anotherHref = params ? `/wodbuilder?${builderQuery(params, null)}` : "/wodbuilder";
  const chosen = new Set(params?.equipment ?? []);
  const focus = new Set(params?.focus ?? ["full-body"]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-5 pb-28">
      <section className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">WOD Builder</h1>
        <p className="m-0 text-ink-2">Tell us what you have and how long you&apos;ve got. We&apos;ll build the workout.</p>
      </section>

      {params && !workout ? (
        <p className="m-0 rounded-2xl border border-line bg-surface p-4">
          There aren&apos;t enough movements for those choices. Add some equipment or pick a wider focus.
        </p>
      ) : null}

      {workout ? (
        <Card title={workout.title} labelledBy="built" aside={<span className="font-mono text-[13px] text-ink-2">{workout.formatLabel} · {workout.minutes} min</span>}>
          <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
            <div className="flex flex-col"><dt className="text-ink-3">Level</dt><dd className="m-0 font-semibold">{LEVELS.find((l) => l.code === params?.level)?.label}</dd></div>
            <div className="flex flex-col"><dt className="text-ink-3">Focus</dt><dd className="m-0 font-semibold">{params?.focus.map((f) => FOCUSES.find((x) => x.code === f)?.label).join(", ")}</dd></div>
            <div className="flex flex-col"><dt className="text-ink-3">Equipment</dt><dd className="m-0 font-semibold">{workout.equipment.length ? workout.equipment.map(equipmentLabel).join(", ") : "None"}</dd></div>
          </dl>
          <p className="m-0 text-[15px]">{workout.description}</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {workout.rows.map((r) => (
              <li key={r.slug} className="flex flex-col border-t border-divider py-3">
                <span className="flex items-baseline justify-between gap-3">
                  <Link href={`/movements/${r.slug}`} className="text-lg font-bold text-ink">{r.movement}</Link>
                  {/* "1000m Row" already says its distance */}
                  {r.reps && !r.movement.toLowerCase().includes(r.reps.toLowerCase()) ? (
                    <span className="shrink-0 font-mono text-sm text-ink-2">{r.reps}</span>
                  ) : null}
                </span>
                {r.tip ? <span className="text-sm text-ink-2">{r.tip}</span> : null}
              </li>
            ))}
          </ul>
          <p className="m-0 rounded-xl bg-surface-muted px-3.5 py-2.5 text-[15px]"><strong>Score:</strong> {workout.scoring}</p>
          <div className="flex flex-wrap gap-2">
            <Link href={anotherHref} className="flex min-h-11 items-center rounded-xl border-[1.5px] border-ink px-4 font-bold text-ink no-underline">
              Build another
            </Link>
            <a href="#choices" className="flex min-h-11 items-center rounded-xl px-2 font-semibold text-ink">
              Change my choices
            </a>
          </div>
        </Card>
      ) : null}

      <form id="builder-form" action="/wodbuilder" className="flex flex-col gap-4" aria-labelledby="choices">
        <h2 id="choices" className={workout ? "m-0 mt-2 text-lg font-bold" : "sr-only"}>Your choices</h2>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Your equipment</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">1. Your equipment</p>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map((e) => (
              <label key={e.code} className={chip}>
                <input type="checkbox" name="eq" value={e.code} defaultChecked={chosen.has(e.code)} className="sr-only" />
                {e.label}
              </label>
            ))}
          </div>
          <p className="m-0 text-[13px] text-ink-2">Bodyweight movements are always included.</p>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Time</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">2. Time</p>
          <div className="grid grid-cols-5 gap-1 rounded-xl bg-surface-muted p-1">
            {MINUTES.map((m) => (
              <label key={m} className={segment}>
                <input type="radio" name="t" value={m} defaultChecked={(params?.minutes ?? 20) === m} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
          <p className="m-0 text-[13px] text-ink-2">Minutes, not counting warm-up and cool-down.</p>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Focus</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">3. Focus</p>
          <div className="flex flex-wrap gap-2">
            {FOCUSES.map((f) => (
              <label key={f.code} className={chip}>
                <input type="checkbox" name="focus" value={f.code} defaultChecked={focus.has(f.code)} className="sr-only" />
                {f.label}
              </label>
            ))}
          </div>
          <p className="m-0 text-[13px] text-ink-2">Pick one or more. Full Body overrides the rest.</p>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Format</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">4. Format</p>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <label key={f.code} className={chip}>
                <input type="radio" name="fmt" value={f.code} defaultChecked={(params?.format ?? "any") === f.code} className="sr-only" />
                {f.label}
              </label>
            ))}
          </div>
          <Link href="/blog/wod-formats-explained" className="text-sm font-semibold text-ink">What do these mean?</Link>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Level</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">5. Level</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted p-1">
            {LEVELS.map((l) => (
              <label key={l.code} className={`${segment} font-sans text-sm`}>
                <input type="radio" name="lvl" value={l.code} defaultChecked={(params?.level ?? "intermediate") === l.code} className="sr-only" />
                {l.label}
              </label>
            ))}
          </div>
        </fieldset>

        {workout ? (
          <button type="submit" className="h-14 rounded-[14px] border-[1.5px] border-ink bg-surface text-[17px] font-bold text-ink">
            Build with these choices
          </button>
        ) : null}
      </form>

      <BottomBar>
        {workout ? (
          <Link href={`/wodbuilder/go?${query}`} className={primaryAction}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2.5M9 2h6" />
            </svg>
            Start Timer
          </Link>
        ) : (
          <button type="submit" form="builder-form" className={primaryAction}>
            Build my workout
          </button>
        )}
      </BottomBar>
    </div>
  );
}
