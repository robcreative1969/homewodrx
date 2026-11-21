import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Item = { name: string; description: string; url: string; cta: string };
type Section = { id: string; title: string; items: Item[] };

export const metadata: Metadata = {
  title: "Gear",
  description: "Hand-picked equipment, apparel, supplements and recovery gear for training at the box, the health club, or at home.",
  alternates: { canonical: "https://homewodrx.com/shop" },
};

// Imported from the old site's Gear page by scripts/import-shop.mjs.
function loadShop(): Section[] {
  return (JSON.parse(readFileSync(join(process.cwd(), "content", "shop.json"), "utf8")) as { sections: Section[] }).sections;
}

export default function ShopPage() {
  const sections = loadShop();
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pt-5 pb-16">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Gear</h1>
        <p className="m-0 max-w-[62ch] text-ink-2">Equipment, apparel and supplements for functional fitness, hand-picked across every budget and training style.</p>
      </div>
      <nav aria-label="Gear categories" className="-mx-4 overflow-x-auto px-4">
        <ul className="m-0 flex w-max list-none gap-2 p-0">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex min-h-10 items-center rounded-full border-[1.5px] border-chip-line bg-surface px-3.5 text-sm font-semibold text-ink no-underline">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {sections.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`} className="flex scroll-mt-20 flex-col gap-3">
          <h2 id={`h-${s.id}`} className="m-0 flex items-baseline gap-2 text-xl font-extrabold">
            {s.title} <span className="font-mono text-sm font-bold text-ink-3">{s.items.length}</span>
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {s.items.map((i) => (
              <li key={i.url + i.name}>
                <a href={i.url} target="_blank" rel="noopener" className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 text-ink no-underline">
                  <span className="text-[17px] font-bold">{i.name}</span>
                  <span className="flex-1 text-sm text-ink-2">{i.description}</span>
                  <span className="text-sm font-bold text-accent-text">{i.cta} →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
