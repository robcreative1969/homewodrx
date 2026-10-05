import type { Metadata } from "next";
import Link from "next/link";
import { listRoutines, modalityLabel } from "@/lib/stretches";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Stretch routines",
  description: "Ready-made stretch and mobility routines for warming up, cooling down and recovery days, each with every step explained.",
  alternates: { canonical: "https://homewodrx.com/stretch-routines" },
};

export default async function RoutinesPage() {
  const routines = await listRoutines();
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <div className="flex flex-col gap-1">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
          <Link href="/stretches" className="text-ink-2">Stretches</Link>
        </nav>
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Stretch routines</h1>
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{routines.length}</span> routines, from five-minute warm-ups to full recovery sessions
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {routines.map((r) => (
          <li key={r.slug}>
            <Link href={`/stretch-routines/${r.slug}`} className="flex h-full flex-col gap-1 rounded-2xl border border-line bg-surface px-4 py-3.5 text-ink no-underline">
              <span className="text-[17px] font-bold">{r.name}</span>
              {r.tagline ? <span className="text-sm text-ink-2">{r.tagline}</span> : null}
              <span className="font-mono text-[13px] text-ink-2">
                {[r.duration ? `${r.duration} min` : null, modalityLabel(r.modality), `${(r.stretches ?? []).length} steps`].filter(Boolean).join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
