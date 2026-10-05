import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getMachine, listMachines, machineMovements, muscleGroupLabels } from "@/lib/machines";
import { youtubeId } from "@/lib/youtube";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await listMachines()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/machines/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMachine(slug);
  if (!m) return {};
  const title = `${m.name}: setup, technique and safety`;
  const description = (m.overview ?? "").slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `https://homewodrx.com/machines/${m.slug}` },
    openGraph: { title, description, type: "article", images: [OG_IMAGE] },
  };
}

export default async function MachinePage({ params }: PageProps<"/machines/[slug]">) {
  const { slug } = await params;
  const m = await getMachine(slug);
  if (!m) notFound();
  const [movements] = await Promise.all([machineMovements(m.id)]);
  const video = youtubeId(m.youtube_url);
  const muscles = muscleGroupLabels(m.muscle_groups);

  return (
    <div className="flex flex-col">
      {video ? (
        <div className="mx-auto w-full max-w-3xl sm:px-4 sm:pt-4">
          <VideoPlayer videoId={video} title={`${m.name} video`} rounded={false} priority />
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 pb-8">
        <section className="flex flex-col gap-2.5">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
            <Link href="/machines" className="text-ink-2">Machines</Link>
          </nav>
          <h1 className="m-0 text-[40px] leading-none font-extrabold tracking-tight">{m.name}</h1>
          {muscles.length ? (
            <dl className="m-0 rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm">
              <dt className="text-ink-3">Muscles</dt>
              <dd className="m-0 font-semibold">{muscles.join(", ")}</dd>
            </dl>
          ) : null}
          {m.overview ? <p className="m-0 text-ink-2">{m.overview}</p> : null}
        </section>

        {m.setup_notes ? (
          <Card title="Set it up" labelledBy="setup">
            <p className="m-0 text-[15px]">{m.setup_notes}</p>
          </Card>
        ) : null}

        {m.common_mistakes?.length ? (
          <Card title="Common mistakes" labelledBy="mistakes">
            <ul className="m-0 flex list-none flex-col p-0 text-[15px]">
              {m.common_mistakes.map((f) => (
                <li key={f.mistake} className="flex flex-col border-t border-divider py-2.5">
                  <span className="font-bold">{f.mistake}</span>
                  <span className="text-ink-2">{f.fix}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {m.safety_notes ? (
          <Card title="Safety" labelledBy="safety">
            <p className="m-0 text-[15px]">{m.safety_notes}</p>
          </Card>
        ) : null}

        {movements.length ? (
          <section aria-labelledby="movements" className="flex flex-col gap-2.5">
            <h2 id="movements" className="m-0 px-1 text-lg font-bold">Movements on this machine</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {movements.map((mv) => (
                <Link key={mv.slug} href={`/movements/${mv.slug}`} className="flex flex-col rounded-[14px] border border-line bg-surface px-3.5 py-3 text-ink no-underline">
                  <span className="text-[17px] font-bold">{mv.name}</span>
                  {mv.muscles ? <span className="text-[13px] text-ink-2">{mv.muscles}</span> : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
