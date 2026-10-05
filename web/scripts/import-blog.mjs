// One-time import of the old site's blog posts (site/blog/*.html) into
// web/content/blog/<slug>.json. Run from web/: `node scripts/import-blog.mjs`.
// Keeps each article body as HTML, drops page furniture (table of contents widget,
// sign-up promos, tags strip, related links, scripts) and applies CONTENT-GUIDE.md
// naming. Re-running overwrites the JSON files.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const SITE = join(import.meta.dirname, "..", "..", "site");
const OUT = join(import.meta.dirname, "..", "content", "blog");
mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(readFileSync(join(SITE, "blog-posts.json"), "utf8"));

const DROP = [
  ".mobile-toc",
  ".inline-cta",
  ".article-footer",
  ".related-strip",
  ".sidebar-cta",
  ".share-card",
  ".print-logo",
  "script",
  "style",
  "button",
];

// CONTENT-GUIDE.md §2–3. URLs are lowercase "homewodrx", so these never touch links.
const RENAME = [
  [/HomeWodRX|HomeWODrx|HomeWodRx|HOMEWODRX/g, "HomeWODRx"],
  [/Smart WOD Builder/g, "WOD Builder"],
  [/Smart Stretch Builder|Stretch Generator/g, "Stretch Builder"],
  // Broken on the old site: there was never a /daily20 page.
  [/href="\/daily20"/g, 'href="/daily-wod"'],
];

function clean(html) {
  let out = html;
  for (const [from, to] of RENAME) out = out.replace(from, to);
  return out
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

function isoDate(text) {
  const d = new Date(`${text} 12:00:00 UTC`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

let count = 0;
for (const post of posts) {
  const file = join(SITE, post.file);
  const root = parse(readFileSync(file, "utf8"), { comment: false });
  const article = root.querySelector("article.article-content");
  if (!article) throw new Error(`No article body in ${post.file}`);

  const toc = root
    .querySelectorAll(".mobile-toc-body a")
    .map((a) => ({ id: (a.getAttribute("href") ?? "").replace(/^#/, ""), title: a.text.trim() }))
    .filter((t) => t.id);
  const tags = root.querySelectorAll(".article-tag").map((t) => t.text.trim());
  const description =
    root.querySelector('meta[name="description"]')?.getAttribute("content") ?? post.excerpt;

  for (const selector of DROP) article.querySelectorAll(selector).forEach((n) => n.remove());

  const record = {
    slug: post.slug,
    title: clean(post.title),
    excerpt: clean(post.excerpt),
    description: clean(description),
    category: post.category,
    categoryLabel: post.categoryLabel,
    date: isoDate(post.date),
    readTime: post.readTime,
    tags,
    toc,
    bodyHtml: clean(article.innerHTML),
  };
  if (!record.date) throw new Error(`Unreadable date "${post.date}" in ${post.file}`);
  writeFileSync(join(OUT, `${post.slug}.json`), JSON.stringify(record, null, 2) + "\n");
  count++;
}

console.log(`Imported ${count} posts into ${OUT}`);
