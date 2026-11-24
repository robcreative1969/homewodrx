import Link from "next/link";
import { LEGAL_LINKS, getLegalPage, type LegalSlug } from "@/lib/legal";

export function LegalArticle({ slug }: { slug: LegalSlug }) {
  const page = getLegalPage(slug);
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pt-5 pb-16 [&>*]:max-w-3xl">
      <header className="flex flex-col gap-1">
        <span className="font-mono text-xs font-bold tracking-[1.5px] text-ink-3 uppercase">Legal</span>
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">{page.title}</h1>
        <p className="m-0 text-sm text-ink-2">Last updated: {page.updated}</p>
      </header>
      {page.sections.length > 2 ? (
        <nav aria-label="On this page" className="rounded-2xl border border-line bg-surface p-4">
          <p className="m-0 mb-2 text-sm font-bold">On this page</p>
          <ol className="m-0 grid list-none gap-1 p-0 text-sm sm:grid-cols-2">
            {page.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-ink-2">{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <article className="article-body legal-body" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
      <nav aria-label="Other legal pages" className="flex flex-wrap gap-x-4 gap-y-1 border-t border-divider pt-4 text-sm">
        {LEGAL_LINKS.filter((l) => l.slug !== slug).map((l) => (
          <Link key={l.slug} href={`/${l.slug}`} className="font-semibold text-ink-2">{l.label}</Link>
        ))}
      </nav>
    </div>
  );
}
