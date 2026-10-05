import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { getRoutine, listRoutines, listStretches, modalityLabel } from "@/lib/stretches";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await listRoutines()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stretch-routines/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRoutine(slug);
  if (!r) return {};
  const description = (r.tagline ?? r.description ?? "").slice(0, 155);
  return {
    title: `${r.name}: ${r.duration} minute stretch routine`,
    description,
    alternates: { canonical: `https://homewodrx.com/stretch-routines/${r.slug}` },
  };
}

export default async function RoutinePage({ params }: PageProps<"/stretch-routines/[slug]">) {
  const { slug } = await params;
  const [r, stretches] = await Promise.all([getRoutine(slug), listStretches()]);
  if (!r) notFound();
  const known = new Set(stretches.map((s) => s.slug));
  const facts = [
    ["Time", r.duration ? `${r.duration} min` : null],
    ["Level", r.level_label],
    ["Type", modalityLabel(r.modality)],
    ["Focus", (r.focus ?? []).join(", ")],
    ["Equipment", r.equipment],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <Card>
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
          <Link href="/stretches" className="text-ink-2">Stretches</Link>
          {" › "}
          <Link href="/stretch-routines" className="text-ink-2">Routines</Link>
        </nav>
        <h1 className="m-0 text-[34px] leading-tight font-extrabold tracking-tight">{r.name}</h1>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          {facts.map(([label, value]) => (
            <div key={label} className="flex flex-col">
              <dt className="text-ink-3">{label}</dt>
              <dd className={`m-0 ${label === "Time" ? "font-mono font-bold" : "font-semibold"}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="Step by step" labelledBy="steps">
        <ol className="m-0 flex list-none flex-col p-0">
          {(r.stretches ?? []).map((s) => (
            <li key={`${s.step}-${s.name}`} className="flex gap-3 border-t border-divider py-3">
              <span className="w-6 shrink-0 font-mono font-bold text-accent-text">{s.step}</span>
              <span className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  {s.slug && known.has(s.slug) ? (
                    <Link href={`/stretches/${s.slug}`} className="font-bold text-ink">{s.name}</Link>
                  ) : (
                    <span className="font-bold">{s.name}</span>
                  )}
                  {s.dose ? <span className="font-mono text-[13px] text-ink-2">{s.dose}</span> : null}
                </span>
                {s.tip ? <span className="text-[15px] text-ink-2">{s.tip}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      {r.description ? (
        <section aria-labelledby="about" className="flex flex-col gap-1.5 px-1">
          <h2 id="about" className="m-0 text-lg font-bold">About this routine</h2>
          <p className="m-0 text-[15px] text-ink-2">{r.description}</p>
        </section>
      ) : null}

      {r.benefits?.length ? (
        <Card title="Why it helps" labelledBy="benefits">
          <ul className="m-0 flex flex-col gap-2 pl-5 text-[15px]">
            {r.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
