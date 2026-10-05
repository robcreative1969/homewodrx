import type { Metadata } from "next";
import Link from "next/link";
import { LibrarySwitch } from "@/components/LibrarySwitch";
import { STRETCH_FOCUS_FILTERS, focusLabels, listRoutines, listStretches, modalityLabel } from "@/lib/stretches";

export const metadata: Metadata = {
  title: "Stretches and mobility",
  description: "Stretches with demo videos, hold times for every level, and ready-made stretch routines for warming up, cooling down and recovery.",
  alternates: { canonical: "https://homewodrx.com/stretches" },
};

export default async function StretchesPage({ searchParams }: PageProps<"/stretches">) {
  const { focus } = await searchParams;
  const [all, routines] = await Promise.all([listStretches(), listRoutines()]);
  const active = typeof focus === "string" && STRETCH_FOCUS_FILTERS.some(([c]) => c === focus) ? focus : null;
  const stretches = active ? all.filter((s) => (s.focus ?? []).includes(active)) : all;
  const chip = (on: boolean) =>
    `flex min-h-11 items-center rounded-full border-[1.5px] px-3.5 text-sm font-semibold no-underline ${on ? "border-ink bg-ink text-ground" : "border-chip-line bg-surface text-ink"}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <LibrarySwitch current="stretches" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Stretches</h1>
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{all.length}</span> stretches and{" "}
          <Link href="/stretch-routines" className="font-semibold text-ink">
            <span className="font-mono">{routines.length}</span> ready-made routines
          </Link>
        </p>
      </div>

      <nav aria-label="Focus areas" className="-mx-4 overflow-x-auto px-4">
        <ul className="m-0 flex w-max list-none gap-2 p-0">
          <li><Link href="/stretches" aria-current={!active ? "page" : undefined} className={chip(!active)}>All</Link></li>
          {STRETCH_FOCUS_FILTERS.map(([code, label]) => (
            <li key={code}>
              <Link href={`/stretches?focus=${code}`} aria-current={active === code ? "page" : undefined} className={chip(active === code)}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {stretches.map((s) => (
          <li key={s.slug}>
            <Link href={`/stretches/${s.slug}`} className="flex h-full flex-col gap-0.5 rounded-2xl border border-line bg-surface px-4 py-3 text-ink no-underline">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[17px] font-bold">{s.name}</span>
                <span className="shrink-0 text-xs font-semibold text-ink-3">{modalityLabel(s.modality)}</span>
              </span>
              <span className="text-sm text-ink-2">{focusLabels(s.focus).join(", ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
