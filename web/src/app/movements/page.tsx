import type { Metadata } from "next";
import Link from "next/link";
import { LibrarySwitch } from "@/components/LibrarySwitch";
import { MOVEMENT_CATEGORIES, listMovements, movementCategoryLabel } from "@/lib/movements";

export async function generateMetadata({ searchParams }: PageProps<"/movements">): Promise<Metadata> {
  const { category } = await searchParams;
  const label = typeof category === "string" && MOVEMENT_CATEGORIES[category];
  return {
    title: label ? `${label} movements` : "Movement library",
    description: "Every movement in every workout, with a demo video, how-to steps, common faults and easier and harder versions.",
    alternates: { canonical: "https://homewodrx.com/movements" },
  };
}

export default async function MovementsPage({ searchParams }: PageProps<"/movements">) {
  const { category } = await searchParams;
  const all = await listMovements();
  const active = typeof category === "string" && MOVEMENT_CATEGORIES[category] ? category : null;
  const movements = active ? all.filter((m) => m.category === active) : all;
  const counts = new Map<string, number>();
  for (const m of all) counts.set(m.category, (counts.get(m.category) ?? 0) + 1);
  // Machine movements stay in the list (Rob, Q1) but the Machines section replaces their filter.
  const tabs = Object.keys(MOVEMENT_CATEGORIES).filter((c) => counts.get(c) && c !== "latpulldown");
  const chip = (on: boolean) =>
    `flex min-h-11 items-center rounded-full border-[1.5px] px-3.5 text-sm font-semibold no-underline ${on ? "border-ink bg-ink text-ground" : "border-chip-line bg-surface text-ink"}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <LibrarySwitch current="movements" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">
          {active ? `${movementCategoryLabel(active)} movements` : "Movements"}
        </h1>
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{movements.length}</span> movements, each with a demo video
        </p>
      </div>

      <nav aria-label="Movement types" className="-mx-4 overflow-x-auto px-4">
        <ul className="m-0 flex w-max list-none gap-2 p-0">
          <li>
            <Link href="/movements" aria-current={!active ? "page" : undefined} className={chip(!active)}>
              All <span className="ml-1.5 font-mono">{all.length}</span>
            </Link>
          </li>
          {tabs.map((c) => (
            <li key={c}>
              <Link href={`/movements?category=${c}`} aria-current={active === c ? "page" : undefined} className={chip(active === c)}>
                {movementCategoryLabel(c)} <span className="ml-1.5 font-mono">{counts.get(c)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {movements.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/movements/${m.slug}`}
              className="flex h-full flex-col gap-0.5 rounded-2xl border border-line bg-surface px-4 py-3 text-ink no-underline"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[17px] font-bold">{m.name}</span>
                {!active ? <span className="shrink-0 text-xs font-semibold text-ink-3">{movementCategoryLabel(m.category)}</span> : null}
              </span>
              {m.muscles ? <span className="text-sm text-ink-2">{m.muscles}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
