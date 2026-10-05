import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, listPosts, relatedPosts } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://homewodrx.com/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", publishedTime: post.date, images: [OG_IMAGE] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = relatedPosts(post);

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "HomeWODRx" },
    publisher: { "@type": "Organization", name: "HomeWODRx" },
    mainEntityOfPage: `https://homewodrx.com/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }}
      />
      <header className="flex flex-col gap-2.5">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
          <Link href="/blog" className="text-ink-2">Blog</Link>
          {" › "}
          <Link href={`/blog?category=${post.category}`} className="text-ink-2">{post.categoryLabel}</Link>
        </nav>
        <h1 className="m-0 text-[34px] leading-tight font-extrabold tracking-tight">{post.title}</h1>
        <p className="m-0 font-mono text-[13px] text-ink-2">
          {formatDate(post.date)} · {post.readTime} · by the team at HomeWODRx
        </p>
      </header>

      {post.toc.length ? (
        <details className="rounded-2xl border border-line bg-surface px-4 py-3">
          <summary className="cursor-pointer font-semibold">In this article</summary>
          <ol className="m-0 mt-2 flex flex-col gap-1.5 pl-5 text-[15px]">
            {post.toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-ink">{t.title}</a>
              </li>
            ))}
          </ol>
        </details>
      ) : null}

      {/* Imported from the old site by scripts/import-blog.mjs; written by Rob, not visitors. */}
      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

      {post.tags.length ? (
        <ul aria-label="Tags" className="m-0 flex list-none flex-wrap gap-2 p-0">
          {post.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface-muted px-3 py-1 text-[13px] font-semibold text-ink-2">{t}</li>
          ))}
        </ul>
      ) : null}

      {related.length ? (
        <section aria-labelledby="keep-reading" className="flex flex-col gap-2.5 border-t border-line pt-5">
          <h2 id="keep-reading" className="m-0 text-lg font-bold">Keep reading</h2>
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 text-ink no-underline"
            >
              <span className="text-xs font-bold tracking-wider text-accent-text uppercase">{p.categoryLabel}</span>
              <span className="text-[17px] leading-snug font-bold">{p.title}</span>
              <span className="font-mono text-xs text-ink-2">{p.readTime}</span>
            </Link>
          ))}
        </section>
      ) : null}
    </article>
  );
}
