// One-time import of the old site's legal pages (privacy, terms, cookies, disclaimer)
// into web/content/legal/<slug>.json. Run from web/: `node scripts/import-legal.mjs`.
// The wording is kept exactly as published (only the brand spelling is unified); the
// page furniture (table of contents, cross-links) is rebuilt by the new pages.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const SITE = join(import.meta.dirname, "..", "..", "site");
const OUT = join(import.meta.dirname, "..", "content", "legal");
mkdirSync(OUT, { recursive: true });

for (const slug of ["privacy", "terms", "cookies", "disclaimer"]) {
  const root = parse(readFileSync(join(SITE, `${slug}.html`), "utf8"), { comment: false });
  const title = root.querySelector("h1.page-title")?.text.trim();
  const updated = root.querySelector(".page-meta")?.text.replace(/^Last updated:\s*/i, "").trim();
  const article = root.querySelector("article.legal-content");
  if (!title || !article) throw new Error(`Missing title or body in ${slug}.html`);
  article.querySelectorAll("script, style, button").forEach((n) => n.remove());
  const sections = article.querySelectorAll(".legal-section").map((s) => ({ id: s.id, title: s.querySelector("h2")?.text.trim() ?? "" }));
  const bodyHtml = article.innerHTML
    .replace(/HomeWodRX|HomeWODrx|HomeWodRx|HOMEWODRX/g, "HomeWODRx")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify({ slug, title, updated, sections, bodyHtml }, null, 2) + "\n");
  console.log(slug, title, updated, sections.length, "sections");
}
