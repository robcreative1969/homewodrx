import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomBar, primaryAction } from "@/components/BottomBar";
import { Card } from "@/components/Card";
import { newSeed } from "@/lib/builderOptions";
import {
  STRETCH_FOCUSES,
  STRETCH_LEVELS,
  STRETCH_MINUTES,
  STRETCH_TYPES,
  buildStretchRoutine,
  parseStretchParams,
  stretchQuery,
} from "@/lib/stretchBuilder";
import { loadStretchPool } from "@/lib/stretches";

export async function generateMetadata({ searchParams }: PageProps<"/stretchbuilder">): Promise<Metadata> {
  const built = parseStretchParams(await searchParams);
  return {
    title: "Stretch Builder",
    description: "Pick the areas to stretch and how long you have, and the Stretch Builder puts together a routine with a follow-along timer. Free, no account needed.",
    alternates: { canonical: "https://homewodrx.com/stretchbuilder" },
    robots: built ? { index: false, follow: true } : undefined,
  };
}

const chip =
  "flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-chip-line bg-surface px-3.5 text-sm font-semibold text-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent";
const segment =
  "flex h-11 cursor-pointer items-center justify-center rounded-[9px] font-mono text-[15px] font-bold text-ink has-[:checked]:bg-ink has-[:checked]:text-ground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent";

export default async function StretchBuilderPage({ searchParams }: PageProps<"/stretchbuilder">) {
  const params = parseStretchParams(await searchParams);
  // A choice without a seed gets one, so every built routine has a link that rebuilds it.
  if (params && !params.seed) redirect(`/stretchbuilder?${stretchQuery(params, newSeed())}`);

  const routine = params?.seed ? buildStretchRoutine(await loadStretchPool(), params, params.seed) : null;
  const query = params ? stretchQuery(params) : "";
  const anotherHref = params ? `/stretchbuilder?${stretchQuery(params, null)}` : "/stretchbuilder";
  const focus = new Set(params?.focus ?? ["full"]);
  const types = new Set<string>(params?.types ?? STRETCH_TYPES.map((t) => t.code));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-5 pb-28">
      <section className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Stretch Builder</h1>
        <p className="m-0 text-ink-2">
          Pick what feels tight and how long you have. We&apos;ll build the routine and time it for you. Or browse the{" "}
          <Link href="/stretch-routines" className="font-semibold text-ink">ready-made routines</Link>.
        </p>
      </section>

      {params && !routine ? (
        <p className="m-0 rounded-2xl border border-line bg-surface p-4">
          There aren&apos;t enough stretches for those choices. Add another area or stretch type.
        </p>
      ) : null}

      {routine ? (
        <Card title={routine.title} labelledBy="built" aside={<span className="font-mono text-[13px] text-ink-2">{routine.steps.length} stretches · about {routine.minutes} min</span>}>
          {routine.extras ? (
            <p className="m-0 text-[15px] text-ink-2">
              There aren&apos;t many stretches just for that area, so {routine.extras} full-body {routine.extras === 1 ? "stretch fills" : "stretches fill"} out the time.
            </p>
          ) : null}
          <ol className="m-0 flex list-none flex-col p-0">
            {routine.steps.map((s, i) => (
              <li key={`${s.slug}-${i}`} className="flex gap-3 border-t border-divider py-3">
                <span className="w-6 shrink-0 font-mono font-bold text-accent-text">{i + 1}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <Link href={`/stretches/${s.slug}`} className="font-bold text-ink">{s.name}</Link>
                    <span className="font-mono text-[13px] text-ink-2">{s.dose}</span>
                  </span>
                  {s.tip ? <span className="text-[15px] text-ink-2">{s.tip}</span> : null}
                </span>
              </li>
            ))}
          </ol>
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

      <form id="builder-form" action="/stretchbuilder" className="flex flex-col gap-4" aria-labelledby="choices">
        <h2 id="choices" className={routine ? "m-0 mt-2 text-lg font-bold" : "sr-only"}>Your choices</h2>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Areas to stretch</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">1. Areas to stretch</p>
          <div className="flex flex-wrap gap-2">
            {STRETCH_FOCUSES.map((f) => (
              <label key={f.code} className={chip}>
                <input type="checkbox" name="focus" value={f.code} defaultChecked={focus.has(f.code)} className="sr-only" />
                {f.label}
              </label>
            ))}
          </div>
          <p className="m-0 text-[13px] text-ink-2">Pick one or more. Full Body overrides the rest.</p>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Time</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">2. Time</p>
          <div className="grid grid-cols-5 gap-1 rounded-xl bg-surface-muted p-1">
            {STRETCH_MINUTES.map((m) => (
              <label key={m} className={segment}>
                <input type="radio" name="t" value={m} defaultChecked={(params?.minutes ?? 10) === m} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
          <p className="m-0 text-[13px] text-ink-2">Minutes, including time to get into each stretch.</p>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Stretch types</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">3. Stretch types</p>
          <div className="flex flex-wrap gap-2">
            {STRETCH_TYPES.map((t) => (
              <label key={t.code} className={chip}>
                <input type="checkbox" name="type" value={t.code} defaultChecked={types.has(t.code)} className="sr-only" />
                {t.label}
              </label>
            ))}
          </div>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-[13px] text-ink-2">
            {STRETCH_TYPES.map((t) => (
              <li key={t.code}><strong className="text-ink">{t.label}:</strong> {t.help}</li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
          <legend className="sr-only">Level</legend>
          <p aria-hidden="true" className="m-0 text-[17px] font-bold">4. Level</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted p-1">
            {STRETCH_LEVELS.map((l) => (
              <label key={l.code} className={`${segment} font-sans text-sm`}>
                <input type="radio" name="lvl" value={l.code} defaultChecked={(params?.level ?? "i") === l.code} className="sr-only" />
                {l.label}
              </label>
            ))}
          </div>
          <p className="m-0 text-[13px] text-ink-2">Sets how long each stretch is held.</p>
        </fieldset>

        {routine ? (
          <button type="submit" className="h-14 rounded-[14px] border-[1.5px] border-ink bg-surface text-[17px] font-bold text-ink">
            Build with these choices
          </button>
        ) : null}
      </form>

      <BottomBar>
        {routine ? (
          <Link href={`/stretchbuilder/go?${query}`} className={primaryAction}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2.5M9 2h6" />
            </svg>
            Start follow-along
          </Link>
        ) : (
          <button type="submit" form="builder-form" className={primaryAction}>
            Build my routine
          </button>
        )}
      </BottomBar>
    </div>
  );
}
