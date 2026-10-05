import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, categoryLabel } from "@/lib/labels";
import { listWorkouts } from "@/lib/workouts";

export async function generateMetadata({ searchParams }: PageProps<"/workouts">): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = CATEGORIES.find((c) => c.param === category);
  const title = cat ? cat.label : "Benchmark workouts";
  return {
    title,
    description: "Classic Benchmarks, Hero WODs, Competition WODs and Memorials & Tributes, each with scaling, coaching cues and a video.",
    alternates: { canonical: cat ? `https://homewodrx.com/workouts?category=${cat.param}` : "https://homewodrx.com/workouts" },
  };
}

export default async function WorkoutsPage({ searchParams }: PageProps<"/workouts">) {
  const { category, cat: legacyCat } = await searchParams;
  const all = await listWorkouts();
  // Old site links use ?cat=<database code>; new links use ?category=<short name>.
  const active = CATEGORIES.find((c) => c.param === category || c.code === legacyCat);
  const workouts = active ? all.filter((w) => w.category === active.code) : all;
  const counts = new Map<string, number>();
  for (const w of all) counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
  // Categories with no workouts stay hidden (CONTENT-GUIDE.md decision 5).
  const tabs = CATEGORIES.filter((c) => counts.get(c.code));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">{active ? active.label : "Workouts"}</h1>
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{workouts.length}</span>{" "}
          {active ? "workouts" : "benchmark workouts, each with scaling, coaching cues and a video"}
        </p>
      </div>

      <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4">
        <ul className="m-0 flex w-max list-none gap-2 p-0">
          <li>
            <Link
              href="/workouts"
              aria-current={!active ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-full border-[1.5px] px-3.5 text-sm font-semibold no-underline ${!active ? "border-ink bg-ink text-ground" : "border-chip-line bg-surface text-ink"}`}
            >
              All <span className="ml-1.5 font-mono">{all.length}</span>
            </Link>
          </li>
          {tabs.map((c) => {
            const on = active?.code === c.code;
            return (
              <li key={c.code}>
                <Link
                  href={`/workouts?category=${c.param}`}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-full border-[1.5px] px-3.5 text-sm font-semibold no-underline ${on ? "border-ink bg-ink text-ground" : "border-chip-line bg-surface text-ink"}`}
                >
                  {c.label} <span className="ml-1.5 font-mono">{counts.get(c.code)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {workouts.map((w) => (
          <li key={w.slug}>
            <Link
              href={`/workouts/${w.slug}`}
              className="flex h-full flex-col gap-1 rounded-2xl border border-line bg-surface px-4 py-3.5 text-ink no-underline"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-lg font-extrabold">{w.name}</span>
                {!active ? <span className="shrink-0 text-xs font-semibold text-ink-3">{categoryLabel(w.category)}</span> : null}
              </span>
              <span className="font-mono text-[13px] text-ink-2">
                {[w.scheme ?? w.format, w.duration_estimate].filter(Boolean).join(" · ")}
              </span>
              <span className="text-sm text-ink-2">
                {(w.movements ?? []).slice(0, 3).map((m) => m.name).join(", ")}
                {(w.movements ?? []).length > 3 ? ` +${(w.movements ?? []).length - 3} more` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
