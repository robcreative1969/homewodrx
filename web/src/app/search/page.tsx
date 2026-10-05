import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/blog";
import { categoryLabel } from "@/lib/labels";
import { listMachines } from "@/lib/machines";
import { listMovements, movementCategoryLabel } from "@/lib/movements";
import { listRoutines, listStretches } from "@/lib/stretches";
import { listWorkouts } from "@/lib/workouts";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

type Hit = { href: string; title: string; detail: string };

function normalize(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const terms = normalize(query).split(" ").filter(Boolean);
  const matches = (...fields: (string | null | undefined)[]) => {
    const text = normalize(fields.filter(Boolean).join(" "));
    return terms.length > 0 && terms.every((t) => text.includes(t));
  };

  let groups: { label: string; hits: Hit[] }[] = [];
  if (terms.length) {
    const [workouts, movements, stretches, routines, machines] = await Promise.all([
      listWorkouts(),
      listMovements(),
      listStretches(),
      listRoutines(),
      listMachines(),
    ]);
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
          .map((m) => ({ href: `/movements/${m.slug}`, title: m.name, detail: movementCategoryLabel(m.category) })),
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
        label: "Blog",
        hits: listPosts()
          .filter((p) => matches(p.title, p.excerpt, ...p.tags))
          .map((p) => ({ href: `/blog/${p.slug}`, title: p.title, detail: p.categoryLabel })),
      },
    ].filter((g) => g.hits.length);
  }
  const total = groups.reduce((n, g) => n + g.hits.length, 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Search</h1>
      <form action="/search" role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">Search workouts, movements, stretches and the blog</label>
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
    </div>
  );
}
