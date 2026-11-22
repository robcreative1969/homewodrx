import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LibrarySwitch } from "@/components/LibrarySwitch";
import {
  BODY_AREAS,
  EQUIPMENT_GROUPS,
  bodyAreaLabel,
  equipmentGroup,
  legacyMovementFilter,
  listMovements,
} from "@/lib/movements";

type Search = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function readFilters(sp: Search) {
  const area = first(sp.area);
  const equipment = first(sp.equipment);
  return {
    area: area && BODY_AREAS[area] ? area : null,
    equipment: equipment && EQUIPMENT_GROUPS.some((g) => g.key === equipment) ? equipment : null,
  };
}

function filterHref(area: string | null, equipment: string | null) {
  const q = new URLSearchParams();
  if (area) q.set("area", area);
  if (equipment) q.set("equipment", equipment);
  const s = q.toString();
  return s ? `/movements?${s}` : "/movements";
}

function heading(area: string | null, equipment: string | null) {
  const parts = [area ? BODY_AREAS[area] : null, equipment ? EQUIPMENT_GROUPS.find((g) => g.key === equipment)?.label : null].filter(Boolean);
  return parts.length ? `${parts.join(" · ")} movements` : "Movements";
}

export async function generateMetadata({ searchParams }: PageProps<"/movements">): Promise<Metadata> {
  const { area, equipment } = readFilters(await searchParams);
  return {
    title: area || equipment ? heading(area, equipment) : "Movement library",
    description: "Every movement in every workout, with a demo video, how-to steps, common faults and easier and harder versions.",
    alternates: { canonical: "https://homewodrx.com/movements" },
  };
}

export default async function MovementsPage({ searchParams }: PageProps<"/movements">) {
  const sp = await searchParams;
  // Old links: /movements?category=kettlebell and the like.
  const legacy = first(sp.category);
  if (legacy) {
    const f = legacyMovementFilter(legacy);
    redirect(filterHref(f.area ?? null, f.equipment ?? null));
  }
  const { area, equipment } = readFilters(sp);
  const all = await listMovements();
  const inArea = (m: (typeof all)[number]) => !area || m.body_area === area;
  const inEquipment = (m: (typeof all)[number]) => !equipment || equipmentGroup(m.equipment_category).key === equipment;
  const movements = all.filter((m) => inArea(m) && inEquipment(m));

  // Counts show what each chip would give with the other row's choice kept.
  const areaCounts = new Map<string, number>();
  const equipmentCounts = new Map<string, number>();
  for (const m of all) {
    if (inEquipment(m) && m.body_area) areaCounts.set(m.body_area, (areaCounts.get(m.body_area) ?? 0) + 1);
    if (inArea(m)) {
      const g = equipmentGroup(m.equipment_category).key;
      equipmentCounts.set(g, (equipmentCounts.get(g) ?? 0) + 1);
    }
  }
  const chip = (on: boolean) =>
    `flex min-h-11 items-center whitespace-nowrap rounded-full border-[1.5px] px-3.5 text-sm font-semibold no-underline ${on ? "border-ink bg-ink text-ground" : "border-chip-line bg-surface text-ink"}`;
  const row = "m-0 flex list-none flex-wrap gap-2 p-0";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <LibrarySwitch current="movements" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">{heading(area, equipment)}</h1>
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{movements.length}</span> movements, each with a demo video
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <nav aria-label="Body area" className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-wider text-ink-3 uppercase">Body area</span>
          <ul className={row}>
            <li>
              <Link href={filterHref(null, equipment)} aria-current={!area ? "page" : undefined} className={chip(!area)}>All</Link>
            </li>
            {Object.entries(BODY_AREAS).map(([key, label]) =>
              areaCounts.get(key) ? (
                <li key={key}>
                  <Link href={filterHref(area === key ? null : key, equipment)} aria-current={area === key ? "page" : undefined} className={chip(area === key)}>
                    {label} <span className="ml-1.5 font-mono">{areaCounts.get(key)}</span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
        <nav aria-label="Equipment" className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-wider text-ink-3 uppercase">Equipment</span>
          <ul className={row}>
            <li>
              <Link href={filterHref(area, null)} aria-current={!equipment ? "page" : undefined} className={chip(!equipment)}>All</Link>
            </li>
            {EQUIPMENT_GROUPS.map((g) =>
              equipmentCounts.get(g.key) ? (
                <li key={g.key}>
                  <Link href={filterHref(area, equipment === g.key ? null : g.key)} aria-current={equipment === g.key ? "page" : undefined} className={chip(equipment === g.key)}>
                    {g.label} <span className="ml-1.5 font-mono">{equipmentCounts.get(g.key)}</span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
      </div>

      {movements.length ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
          {movements.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/movements/${m.slug}`}
                className="flex h-full flex-col gap-0.5 rounded-2xl border border-line bg-surface px-4 py-3 text-ink no-underline"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-bold">{m.name}</span>
                  <span className="shrink-0 text-xs font-semibold text-ink-3">
                    {[!area ? bodyAreaLabel(m.body_area) : null, !equipment ? equipmentGroup(m.equipment_category).label : null].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {m.muscles ? <span className="text-sm text-ink-2">{m.muscles}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 rounded-2xl border border-line bg-surface p-4">
          No movements match both filters. <Link href={filterHref(area, null)} className="font-semibold text-ink">Clear the equipment filter</Link>.
        </p>
      )}
    </div>
  );
}
