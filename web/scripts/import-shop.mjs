// One-time import of the old site's Gear page (site/shop.html) into web/content/shop.json.
// Run from web/: `node scripts/import-shop.mjs`. Keeps every pick, description and
// affiliate link exactly; only the brand spelling and section titles' capitals change.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const SITE = join(import.meta.dirname, "..", "..", "site");
const root = parse(readFileSync(join(SITE, "shop.html"), "utf8"));

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s&/-])([a-z])/g, (_m, p, c) => p + c.toUpperCase()).replace(/\bAnd\b/g, "and");

const sections = root.querySelectorAll("section.gear-section").map((sec) => ({
  id: sec.id,
  title: titleCase(sec.querySelector(".section-hdr h2")?.text.trim() ?? sec.id),
  items: sec.querySelectorAll("a.gear-card").map((a) => ({
    name: a.querySelector(".card-name")?.text.trim().replace(/HomeWodRX|HomeWODrx/g, "HomeWODRx") ?? "",
    description: a.querySelector(".card-desc")?.text.trim().replace(/HomeWodRX|HomeWODrx/g, "HomeWODRx") ?? "",
    // Amazon closed the affiliate account (Nov 2026): plain product links, no tracking tag.
    url: (a.getAttribute("href") ?? "").replace(/([?&])tag=homewodrx0f-20&/, "$1").replace(/[?&]tag=homewodrx0f-20/, ""),
    cta: a.querySelector(".card-cta")?.text.trim().replace(/\s*→\s*$/, "") ?? "Shop Amazon",
  })),
}));

const total = sections.reduce((n, s) => n + s.items.length, 0);
writeFileSync(join(import.meta.dirname, "..", "content", "shop.json"), JSON.stringify({ sections }, null, 2) + "\n");
console.log(sections.length, "sections,", total, "items");
for (const s of sections) console.log(" ", s.id, s.title, s.items.length);
