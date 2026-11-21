import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { listPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

type Item = { type: string; typeLabel: string; slug: string; name: string; detail: string; href: string | null; publicHref: string; updated: string | null };

const TYPES = [
  { value: "all", label: "Everything" },
  { value: "workouts", label: "Workouts" },
  { value: "movements", label: "Movements" },
  { value: "machines", label: "Machines" },
  { value: "stretches", label: "Stretches" },
  { value: "blog", label: "Blog" },
];

function norm(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export default async function ContentPage({ searchParams }: PageProps<"/admin/content">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const type = TYPES.some((t) => t.value === sp.type) ? String(sp.type) : "all";
  const terms = norm(q).split(" ").filter(Boolean);
  const want = (t: string) => type === "all" || type === t;

  const [w, m, mc, st] = await Promise.all([
    want("workouts") ? supabase.from("benchmark_workouts").select("slug,name,category,scheme,updated_at").order("name") : null,
    want("movements") ? supabase.from("movements").select("slug,name,category,equipment_category,updated_at").order("name") : null,
    want("machines") ? supabase.from("machines").select("slug,name,updated_at").order("name") : null,
    want("stretches") ? supabase.from("stretches").select("slug,name,modality,updated_at").order("name") : null,
  ]);

  let items: Item[] = [
    ...(w?.data ?? []).map((r) => ({ type: "workouts", typeLabel: "Workout", slug: r.slug, name: r.name, detail: r.scheme ?? "", href: `/admin/content/workouts/${r.slug}`, publicHref: `/workouts/${r.slug}`, updated: r.updated_at })),
    ...(m?.data ?? []).map((r) => ({ type: "movements", typeLabel: "Movement", slug: r.slug, name: r.name, detail: r.equipment_category ?? r.category ?? "", href: `/admin/content/movements/${r.slug}`, publicHref: `/movements/${r.slug}`, updated: r.updated_at })),
    ...(mc?.data ?? []).map((r) => ({ type: "machines", typeLabel: "Machine", slug: r.slug, name: r.name, detail: "", href: `/admin/content/machines/${r.slug}`, publicHref: `/machines/${r.slug}`, updated: r.updated_at })),
    ...(st?.data ?? []).map((r) => ({ type: "stretches", typeLabel: "Stretch", slug: r.slug, name: r.name, detail: r.modality ?? "", href: null, publicHref: `/stretches/${r.slug}`, updated: r.updated_at })),
    ...(want("blog") ? listPosts().map((p) => ({ type: "blog", typeLabel: "Blog post", slug: p.slug, name: p.title, detail: p.categoryLabel, href: null, publicHref: `/blog/${p.slug}`, updated: p.date })) : []),
  ];
  if (terms.length) items = items.filter((i) => { const t = norm(`${i.name} ${i.slug} ${i.detail}`); return terms.every((x) => t.includes(x)); });
  else items.sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
  const shown = items.slice(0, terms.length ? 200 : 40);

  return (
    <>
      <AdminNav current="/admin/content" />
      <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Content</h1>
      <form action="/admin/content" role="search" className="flex flex-col gap-3">
        <div className="flex gap-2">
          <label htmlFor="content-q" className="sr-only">Search all content</label>
          <input id="content-q" name="q" type="search" defaultValue={q} autoFocus placeholder="Search by name: Fran, leg press, pigeon…" className="h-12 min-w-0 flex-1 rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 text-base text-ink placeholder:text-ink-3" />
          <button type="submit" className="h-12 rounded-xl bg-accent px-5 font-bold text-accent-ink">Search</button>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Type">
          {TYPES.map((t) => (
            <label key={t.value} className="flex min-h-9 cursor-pointer items-center rounded-full border-[1.5px] border-chip-line px-3 text-sm font-semibold has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ground">
              <input type="radio" name="type" value={t.value} defaultChecked={t.value === type} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </form>
      <p className="m-0 text-sm text-ink-2">
        {terms.length ? `${items.length} ${items.length === 1 ? "match" : "matches"}` : "Recently changed"}
        {type !== "all" ? ` in ${TYPES.find((t) => t.value === type)?.label}` : ""}. Workouts, movements and machines can be edited here; stretches and blog posts open on the site.
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {shown.map((i) => (
          <li key={`${i.type}-${i.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
            <div className="flex min-w-0 flex-col">
              {i.href ? <Link href={i.href} className="truncate font-bold text-ink">{i.name}</Link> : <span className="truncate font-bold">{i.name}</span>}
              <span className="truncate text-[13px] text-ink-3">{i.typeLabel}{i.detail ? ` · ${i.detail}` : ""}</span>
            </div>
            <div className="flex shrink-0 gap-2 text-sm font-semibold">
              {i.href ? <Link href={i.href} className="text-accent-text">Edit</Link> : null}
              <a href={i.publicHref} target="_blank" rel="noopener" className="text-ink-2">View</a>
            </div>
          </li>
        ))}
      </ul>
      {items.length > shown.length ? <p className="m-0 text-sm text-ink-3">Showing {shown.length} of {items.length}. Search to narrow it down.</p> : null}
    </>
  );
}
