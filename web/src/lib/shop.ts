import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

export type GearItem = { name: string; description: string; url: string; cta: string };
export type GearSection = { id: string; title: string; items: GearItem[] };

/** The Gear page's sections, imported from the old site by scripts/import-shop.mjs. */
export const listGear = cache(
  (): GearSection[] =>
    (JSON.parse(readFileSync(join(process.cwd(), "content", "shop.json"), "utf8")) as { sections: GearSection[] }).sections,
);
