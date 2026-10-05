import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, listPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "WOD guides, scaling strategies, home gym builds and training advice for athletes who train at the box, the health club, or at home.",
  alternates: { canonical: "https://homewodrx.com/blog" },
};

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { category } = await searchParams;
  const all = listPosts();
  const categories = [...new Map(all.map((p) => [p.category, p.categoryLabel])).entries()];
  const active = typeof category === "string" && categories.some(([c]) => c === category) ? category : null;
  const posts = active ? all.filter((p) => p.category === active) : all;
  const chip = (on: boolean) =>
    `flex min-h-11 items-center rounded-full border-[1.5px] px-3.5 text-sm font-semibold no-underline ${on ? "border-ink bg-ink text-ground" : "border-chip-line bg-surface text-ink"}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Blog</h1>
        <p className="m-0 text-ink-2">WOD guides, scaling, home gym builds and training advice.</p>
      </div>

      <nav aria-label="Blog categories" className="-mx-4 overflow-x-auto px-4">
        <ul className="m-0 flex w-max list-none gap-2 p-0">
          <li>
            <Link href="/blog" aria-current={!active ? "page" : undefined} className={chip(!active)}>All</Link>
          </li>
          {categories.map(([code, label]) => (
            <li key={code}>
              <Link href={`/blog?category=${code}`} aria-current={active === code ? "page" : undefined} className={chip(active === code)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 text-ink no-underline"
            >
              <span className="text-xs font-bold tracking-wider text-accent-text uppercase">{p.categoryLabel}</span>
              <span className="text-[17px] leading-snug font-bold">{p.title}</span>
              <span className="text-sm text-ink-2">{p.excerpt}</span>
              <span className="font-mono text-xs text-ink-2">
                {formatDate(p.date)} · {p.readTime}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
