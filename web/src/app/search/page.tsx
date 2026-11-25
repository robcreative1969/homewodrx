import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listPosts } from "@/lib/blog";
import { listGear } from "@/lib/shop";
import { categoryLabel } from "@/lib/labels";
import { listMachines } from "@/lib/machines";
import { bodyAreaLabel, listMovements } from "@/lib/movements";
import { listRoutines, listStretches } from "@/lib/stretches";
import { listWorkouts } from "@/lib/workouts";
import { LogSearch } from "@/components/SiteMetrics";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

type Hit = { href: string; title: string; detail: string };

/** A word and its simple stems, so "rower" finds "rowing" and "swings" finds "swing". */
function stems(t: string) {
  const out = [t];
  for (const end of ["ers", "er", "ing", "es", "s"]) {
    if (t.length > end.length + 2 && t.endsWith(end)) out.push(t.slice(0, -end.length));
  }
  return out;
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const terms = normalize(query).split(" ").filter(Boolean);
  const matches = (...fields: (string | null | undefined)[]) => {
    const text = normalize(fields.filter(Boolean).join(" "));
    return terms.length > 0 && terms.every((t) => stems(t).some((v) => text.includes(v)));
  };

  const [workouts, movements, stretches, routines, machines] = await Promise.all([
    listWorkouts(),
    listMovements(),
    listStretches(),
    listRoutines(),
    listMachines(),
  ]);
  const counts = {
    workouts: workouts.length,
    movements: movements.length,
    stretches: stretches.length,
    routines: routines.length,
    machines: machines.length,
    posts: listPosts().length,
    gear: listGear().reduce((n, sec) => n + sec.items.length, 0),
  };
  let groups: { label: string; hits: Hit[] }[] = [];
  if (terms.length) {
    groups = [
      {
        label: "Workouts",
        hits: workouts
          .filter((w) => matches(w.name, w.scheme, ...(w.movements ?? []).map((m) => m.name)))
          .map((w) => ({ href: `/workouts/${w.slug}`, title: w.name, detail: categoryLabel(w.category) })),
      },
      {
        label: "Movements",
        hits: movements
          .filter((m) => matches(m.name, m.muscles))
          .map((m) => ({ href: `/movements/${m.slug}`, title: m.name, detail: bodyAreaLabel(m.body_area) })),
      },
      {
        label: "Machines",
        hits: machines
          .filter((m) => matches(m.name, ...(m.muscle_groups ?? [])))
          .map((m) => ({ href: `/machines/${m.slug}`, title: m.name, detail: "Machine" })),
      },
      {
        label: "Stretches",
        hits: [
          ...stretches.filter((s) => matches(s.name)).map((s) => ({ href: `/stretches/${s.slug}`, title: s.name, detail: "Stretch" })),
          ...routines.filter((r) => matches(r.name, r.tagline)).map((r) => ({ href: `/stretch-routines/${r.slug}`, title: r.name, detail: "Stretch routine" })),
        ],
      },
      {
        label: "Gear",
        hits: listGear().flatMap((sec) =>
          sec.items
            .filter((it) => matches(it.name, it.description, sec.title))
            .map((it) => ({ href: `/shop#${sec.id}`, title: it.name, detail: `Gear · ${sec.title}` })),
        ),
      },
      {
        label: "Blog",
        hits: listPosts()
          .filter((p) => matches(p.title, p.excerpt, ...p.tags))
          .map((p) => ({ href: `/blog/${p.slug}`, title: p.title, detail: p.categoryLabel })),
      },
    ].filter((g) => g.hits.length);
  }
  const total = groups.reduce((n, g) => n + g.hits.length, 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5">
      <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Search</h1>
      <form action="/search" role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">Search workouts, movements, stretches, gear and the blog</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Fran, thrusters, hips…"
          className="h-12 min-w-0 flex-1 rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 text-base text-ink placeholder:text-ink-3"
        />
        <button type="submit" className="h-12 rounded-xl bg-accent px-5 font-bold text-accent-ink">Search</button>
      </form>

      {terms.length ? <LogSearch query={query} results={total} /> : null}
      {terms.length ? (
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{total}</span> {total === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
        </p>
      ) : null}

      {groups.map((g) => (
        <section key={g.label} aria-labelledby={`r-${g.label}`} className="flex flex-col gap-2">
          <h2 id={`r-${g.label}`} className="m-0 text-lg font-bold">
            {g.label} <span className="font-mono text-sm text-ink-2">{g.hits.length}</span>
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {g.hits.slice(0, 20).map((h) => (
              <li key={h.href}>
                <Link href={h.href} className="flex items-baseline justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-ink no-underline">
                  <span className="font-bold">{h.title}</span>
                  <span className="shrink-0 text-xs font-semibold text-ink-3">{h.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {terms.length && total === 0 ? (
        <p className="m-0 text-ink-2">Nothing matched. Try a shorter word, or one of these:</p>
      ) : null}

      {!terms.length || total === 0 ? <SearchStart counts={counts} /> : null}
    </div>
  );
}

const POPULAR = ["Fran", "Murph", "Cindy", "Kettlebell", "No equipment", "Hotel", "Pull-ups", "Rower", "Hips", "Thrusters", "Wall balls", "Jump rope"];

function SearchStart({ counts }: { counts: Record<string, number> }) {
  const browse = [
    { href: "/workouts", label: "Workouts", count: counts.workouts, img: "/images/banners/workouts.jpg" },
    { href: "/movements", label: "Movements", count: counts.movements, img: "/images/banners/movements.jpg" },
    { href: "/stretches", label: "Stretches", count: counts.stretches, img: "/images/banners/stretches.jpg" },
    { href: "/stretch-routines", label: "Stretch routines", count: counts.routines, img: "/images/banners/stretch-routines.jpg" },
    { href: "/machines", label: "Machines", count: counts.machines, img: "/images/banners/machines.jpg" },
    { href: "/blog", label: "Blog", count: counts.posts, img: "/images/blog/case-for-logging-workouts.jpg" },
    { href: "/shop", label: "Gear", count: counts.gear, img: "/images/banners/gear.jpg" },
    { href: "/daily-wod", label: "Today's Daily 20", count: null, img: "/images/banners/daily-20.jpg" },
  ];
  return (
    <>
      <section aria-labelledby="popular" className="flex flex-col gap-2.5">
        <h2 id="popular" className="m-0 text-lg font-bold">Popular searches</h2>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {POPULAR.map((t) => (
            <li key={t}>
              <Link href={`/search?q=${encodeURIComponent(t)}`} className="flex min-h-11 items-center rounded-full border-[1.5px] border-chip-line bg-surface px-3.5 text-sm font-semibold text-ink no-underline">
                {t}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="browse" className="flex flex-col gap-2.5">
        <h2 id="browse" className="m-0 text-lg font-bold">Browse everything</h2>
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {browse.map((b) => (
            <li key={b.href}>
              <Link href={b.href} className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-ink no-underline">
                <span className="relative block aspect-[16/10] w-full bg-surface-muted">
                  <Image src={b.img} alt="" fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw" className="object-cover" />
                </span>
                <span className="flex items-baseline justify-between gap-2 px-3.5 py-3">
                  <span className="font-bold">{b.label}</span>
                  {b.count != null ? <span className="font-mono text-xs text-ink-2">{b.count}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
