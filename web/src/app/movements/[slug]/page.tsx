import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { VIDEO_PRIVACY_NOTE, VideoPlayer } from "@/components/VideoPlayer";
import { categoryLabel } from "@/lib/labels";
import {
  getMovement,
  listMovements,
  movementCategoryLabel,
  scalingLevelLabel,
  workoutsWithMovement,
} from "@/lib/movements";
import { youtubeId } from "@/lib/youtube";

export const revalidate = 3600;

export async function generateStaticParams() {
  const movements = await listMovements();
  return movements.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/movements/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMovement(slug);
  if (!m) return {};
  const title = `${m.name}: how to do them, with video`;
  const description = (m.description ?? "").slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `https://homewodrx.com/movements/${m.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function MovementPage({ params }: PageProps<"/movements/[slug]">) {
  const { slug } = await params;
  const m = await getMovement(slug);
  if (!m) notFound();

  const video = youtubeId(m.youtube_url);
  const workouts = await workoutsWithMovement(m.slug);
  const category = movementCategoryLabel(m.category);

  return (
    <div className="flex flex-col">
      {video ? (
        <div className="mx-auto w-full max-w-3xl sm:px-4 sm:pt-4">
          <VideoPlayer videoId={video} title={`${m.name} demo video`} rounded={false} priority />
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 pb-8">
        <section className="flex flex-col gap-2.5">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
            <Link href="/movements" className="text-ink-2">Movements</Link>
            {" › "}
            <Link href={`/movements?category=${m.category}`} className="text-ink-2">{category}</Link>
          </nav>
          <h1 className="m-0 text-[40px] leading-none font-extrabold tracking-tight">{m.name}</h1>
          {video ? <p className="m-0 text-[13px] text-ink-2">{VIDEO_PRIVACY_NOTE}</p> : null}
          {m.description ? <p className="m-0 text-ink-2">{m.description}</p> : null}
          {m.muscles ? (
            <dl className="m-0 rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm">
              <dt className="text-ink-3">Muscles</dt>
              <dd className="m-0 font-semibold">{m.muscles}</dd>
            </dl>
          ) : null}
        </section>

        {m.tips?.length ? (
          <Card title="How to do it" labelledBy="how-to">
            <ol className="m-0 flex flex-col gap-2 pl-5 text-[15px]">
              {m.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </Card>
        ) : null}

        {m.common_faults.length ? (
          <Card title="Common faults" labelledBy="faults">
            <ul className="m-0 flex list-none flex-col p-0 text-[15px]">
              {m.common_faults.map((f) => (
                <li key={f.mistake} className="flex flex-col border-t border-divider py-2.5">
                  <span className="font-bold">{f.mistake}</span>
                  <span className="text-ink-2">{f.fix}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {m.scaling_options.length ? (
          <Card title="Easier and harder versions" labelledBy="versions">
            <ul className="m-0 flex list-none flex-col p-0 text-[15px]">
              {m.scaling_options.map((s) => (
                <li key={`${s.level}-${s.movement}`} className="flex gap-3 border-t border-divider py-2.5">
                  <span className="w-[84px] shrink-0 font-bold">{scalingLevelLabel(s.level)}</span>
                  <span className="flex flex-col">
                    <span className="font-semibold">{s.movement}</span>
                    {s.notes ? <span className="text-ink-2">{s.notes}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {workouts.length ? (
          <section aria-labelledby="in-workouts" className="flex flex-col gap-2.5">
            <h2 id="in-workouts" className="m-0 px-1 text-lg font-bold">
              Workouts with {m.name.toLowerCase()}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {workouts.slice(0, 8).map((w) => (
                <Link
                  key={w.slug}
                  href={`/workouts/${w.slug}`}
                  className="flex flex-col rounded-[14px] border border-line bg-surface px-3.5 py-3 text-ink no-underline"
                >
                  <span className="text-[17px] font-extrabold">{w.name}</span>
                  <span className="text-[13px] text-ink-2">{categoryLabel(w.category)}</span>
                </Link>
              ))}
            </div>
            {workouts.length > 8 ? (
              <p className="m-0 px-1 text-sm text-ink-2">
                And <span className="font-mono">{workouts.length - 8}</span> more.
              </p>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
