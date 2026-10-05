import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomBar, primaryAction } from "@/components/BottomBar";
import { Card } from "@/components/Card";
import { VideoPlayer } from "@/components/VideoPlayer";
import { categoryLabel, categoryParam, equipmentLabels, levelLabel } from "@/lib/labels";
import {
  getWorkout,
  listWorkouts,
  movementLinker,
  relatedWorkouts,
  scoreInstruction,
  scoreTargets,
} from "@/lib/workouts";
import { youtubeId } from "@/lib/youtube";

// Pages are built ahead of time and refreshed hourly; new workouts render on first visit.
export const revalidate = 3600;

export async function generateStaticParams() {
  const workouts = await listWorkouts();
  return workouts.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/workouts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = await getWorkout(slug);
  if (!w) return {};
  const title = w.scheme ? `${w.name}: ${w.scheme}` : `${w.name} workout`;
  const description = (w.description ?? "").slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `https://homewodrx.com/workouts/${w.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

// Cues hold technique only; score targets live in the Score section (CONTENT-GUIDE.md §4).
const SCORE_TALK = /\b(sub-\d|elite|under \d+\s*min|minutes? is)/i;

export default async function WorkoutPage({ params }: PageProps<"/workouts/[slug]">) {
  const { slug } = await params;
  const [w, all, linkFor] = await Promise.all([getWorkout(slug), listWorkouts(), movementLinker()]);
  if (!w) notFound();

  const video = youtubeId(w.youtube_url);
  const targets = scoreTargets(w.scoring_notes);
  const tiers = targets?.kind === "time" ? targets.tiers : [];
  const instruction = scoreInstruction(w.scoring_notes);
  const cues = (w.coaching_tips ?? []).filter((c) => !SCORE_TALK.test(c));
  const related = relatedWorkouts(w, all);
  const catParam = categoryParam(w.category);
  const maxMinutes = tiers.length ? tiers[tiers.length - 1].value : 0;
  // Reps that just repeat the scheme ("21 – 15 – 9" under "21-15-9 For Time") are shown once.
  const digits = (s: string | null | undefined) => (s ?? "").match(/\d+/g)?.join("-") ?? "";
  const schemeDigits = digits(w.scheme);
  const showReps = (reps?: string) => !!reps && !(schemeDigits && schemeDigits.startsWith(digits(reps)) && digits(reps));

  const facts = [
    ["Format", w.format],
    ["Level", levelLabel(w.difficulty)],
    ["Typical time", w.duration_estimate],
    ["Equipment", equipmentLabels(w.equipment).join(", ")],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-4 pb-28">
      <Card>
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
          <Link href="/workouts" className="text-ink-2">Workouts</Link>
          {" › "}
          <Link href={catParam ? `/workouts?category=${catParam}` : "/workouts"} className="text-ink-2">
            {categoryLabel(w.category)}
          </Link>
        </nav>
        <h1 className="m-0 text-[44px] leading-none font-extrabold tracking-tight">{w.name}</h1>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          {facts.map(([label, value]) => (
            <div key={label} className="flex flex-col">
              <dt className="text-ink-3">{label}</dt>
              <dd className={`m-0 ${label === "Typical time" ? "font-mono font-bold" : "font-semibold"}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="The workout" labelledBy="the-workout">
        {w.scheme ? (
          <p className="m-0 font-mono text-[26px] leading-tight font-bold tracking-tight text-accent-text">{w.scheme}</p>
        ) : null}
        <ul className="m-0 flex list-none flex-col p-0">
          {(w.movements ?? []).map((m, i) => {
            const mSlug = m.slug ?? linkFor(m.name);
            const load = [m.rx_men, m.rx_women].filter(Boolean).join(" / ");
            return (
              <li key={`${m.name}-${i}`} className="flex items-center justify-between gap-3 border-t border-divider py-3">
                <span className="flex flex-col">
                  {showReps(m.reps) ? <span className="font-mono text-sm text-ink-2">{m.reps}</span> : null}
                  {mSlug ? (
                    <Link href={`/movements/${mSlug}`} className="text-lg font-bold text-ink">{m.name}</Link>
                  ) : (
                    <span className="text-lg font-bold">{m.name}</span>
                  )}
                </span>
                {load ? <span className="shrink-0 font-mono text-sm text-ink-2">{load}</span> : null}
              </li>
            );
          })}
        </ul>
      </Card>

      {video ? (
        <Card title="Watch it first" labelledBy="watch-it-first">
          <VideoPlayer videoId={video} title={`${w.name} workout video`} />
        </Card>
      ) : null}

      {w.scoring_notes ? (
        <Card title="Score" labelledBy="score">
          {instruction ? <p className="m-0 text-ink-2">{instruction}</p> : null}
          {tiers.length ? (
            <>
              <div aria-hidden="true" className="flex flex-col gap-2">
                <div className="flex h-3 overflow-hidden rounded-md">
                  {tiers.map((t, i) => (
                    <div
                      key={t.label}
                      style={{ flex: t.value - (tiers[i - 1]?.value ?? 0) }}
                      className={["bg-ink", "bg-ink-3", "bg-chip-line", "bg-line"][i] ?? "bg-line"}
                    />
                  ))}
                </div>
                <div className="flex font-mono text-xs text-ink-2">
                  <span style={{ flex: tiers[0].value }}>0:00</span>
                  {tiers.slice(0, -1).map((t, i) => (
                    <span key={t.label} style={{ flex: tiers[i + 1].value - t.value }}>{t.value}:00</span>
                  ))}
                  <span>{maxMinutes}:00</span>
                </div>
              </div>
              <dl className="m-0 grid grid-cols-3 gap-2 text-sm">
                {tiers.map((t) => (
                  <div key={t.label} className="flex flex-col">
                    <dt className="font-bold">{t.label}</dt>
                    <dd className="m-0 font-mono">under {t.value}:00</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}
          {targets?.kind === "count" ? (
            <dl className="m-0 flex flex-col text-sm">
              {targets.tiers.map((t) => (
                <div key={t.label} className="flex items-baseline justify-between border-t border-divider py-2">
                  <dt className="font-bold">{t.label}</dt>
                  <dd className="m-0 font-mono">{t.value}+{targets.unit ? ` ${targets.unit}` : ""}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Card>
      ) : null}

      {w.scaling_notes ? (
        <Card title="Scaling" labelledBy="scaling">
          <p className="m-0 text-[15px]">{w.scaling_notes}</p>
        </Card>
      ) : null}

      {cues.length ? (
        <Card title="Coaching cues" labelledBy="coaching-cues">
          <ol className="m-0 flex flex-col gap-2.5 pl-5 text-[15px]">
            {cues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </Card>
      ) : null}

      {w.description ? (
        <section aria-labelledby="about" className="flex flex-col gap-1.5 px-1">
          <h2 id="about" className="m-0 text-lg font-bold">About {w.name}</h2>
          <p className="m-0 text-[15px] text-ink-2">{w.description}</p>
        </section>
      ) : null}

      {w.faqs?.length ? (
        <Card title="Questions" labelledBy="faq">
          <div className="flex flex-col">
            {w.faqs.map((f) => (
              <details key={f.question} className="border-t border-divider py-3">
                <summary className="cursor-pointer font-semibold">{f.question}</summary>
                <p className="m-0 mt-2 text-[15px] text-ink-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </Card>
      ) : null}

      {related.length ? (
        <section aria-labelledby="related" className="flex flex-col gap-2.5">
          <h2 id="related" className="m-0 px-1 text-lg font-bold">You might also like</h2>
          <div className="grid grid-cols-2 gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/workouts/${r.slug}`}
                className="flex flex-col rounded-[14px] border border-line bg-surface px-3.5 py-3 text-ink no-underline"
              >
                <span className="text-[17px] font-extrabold">{r.name}</span>
                <span className="text-[13px] text-ink-2">{categoryLabel(r.category)}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <BottomBar>
        <Link href={`/workouts/${w.slug}/go`} className={primaryAction}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5M9 2h6" />
          </svg>
          Start Timer
        </Link>
      </BottomBar>
    </div>
  );
}
