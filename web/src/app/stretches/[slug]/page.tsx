import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { VIDEO_PRIVACY_NOTE, VideoPlayer } from "@/components/VideoPlayer";
import { focusLabels, getStretch, listStretches, modalityLabel, routinesWithStretch } from "@/lib/stretches";
import { youtubeId } from "@/lib/youtube";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await listStretches()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stretches/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getStretch(slug);
  if (!s) return {};
  const title = `${s.name}: how to do it, with video`;
  const description = (s.description ?? "").slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `https://homewodrx.com/stretches/${s.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function StretchPage({ params }: PageProps<"/stretches/[slug]">) {
  const { slug } = await params;
  const s = await getStretch(slug);
  if (!s) notFound();
  const video = youtubeId(s.youtube_url);
  const routines = await routinesWithStretch(s.slug);
  const holds = [
    ["Beginner", s.hold_beginner],
    ["Intermediate", s.hold_intermediate],
    ["Advanced", s.hold_advanced],
  ].filter(([, v]) => v) as [string, number][];

  return (
    <div className="flex flex-col">
      {video ? (
        <div className="mx-auto w-full max-w-3xl sm:px-4 sm:pt-4">
          <VideoPlayer videoId={video} title={`${s.name} demo video`} rounded={false} priority />
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 pb-8">
        <section className="flex flex-col gap-2.5">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
            <Link href="/stretches" className="text-ink-2">Stretches</Link>
          </nav>
          <h1 className="m-0 text-[40px] leading-none font-extrabold tracking-tight">{s.name}</h1>
          {video ? <p className="m-0 text-[13px] text-ink-2">{VIDEO_PRIVACY_NOTE}</p> : null}
          <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm">
            <div className="flex flex-col"><dt className="text-ink-3">Type</dt><dd className="m-0 font-semibold">{modalityLabel(s.modality)}</dd></div>
            <div className="flex flex-col"><dt className="text-ink-3">Focus</dt><dd className="m-0 font-semibold">{focusLabels(s.focus).join(", ")}</dd></div>
            {s.sides ? <div className="col-span-2 flex flex-col"><dt className="text-ink-3">Sides</dt><dd className="m-0 font-semibold">Do each side</dd></div> : null}
          </dl>
          {s.description ? <p className="m-0 text-ink-2">{s.description}</p> : null}
        </section>

        {holds.length ? (
          <Card title={s.modality === "static" || s.modality === "pnf" ? "How long to hold" : "How long"} labelledBy="holds">
            <dl className="m-0 grid grid-cols-3 gap-2 text-sm">
              {holds.map(([level, secs]) => (
                <div key={level} className="flex flex-col">
                  <dt className="font-bold">{level}</dt>
                  <dd className="m-0 font-mono">{secs} sec{s.sides ? " each side" : ""}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : null}

        {s.cues?.length ? (
          <Card title="How to do it" labelledBy="how-to">
            <ol className="m-0 flex flex-col gap-2 pl-5 text-[15px]">
              {s.cues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            {s.tip ? <p className="m-0 rounded-xl bg-surface-muted px-3.5 py-2.5 text-[15px]"><strong>Tip:</strong> {s.tip}</p> : null}
          </Card>
        ) : null}

        {routines.length ? (
          <section aria-labelledby="in-routines" className="flex flex-col gap-2.5">
            <h2 id="in-routines" className="m-0 px-1 text-lg font-bold">Routines with this stretch</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {routines.map((r) => (
                <Link key={r.slug} href={`/stretch-routines/${r.slug}`} className="flex flex-col rounded-[14px] border border-line bg-surface px-3.5 py-3 text-ink no-underline">
                  <span className="text-[17px] font-extrabold">{r.name}</span>
                  <span className="font-mono text-[13px] text-ink-2">{r.duration} min</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
