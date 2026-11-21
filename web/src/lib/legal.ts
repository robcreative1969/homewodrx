import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LegalSlug = "privacy" | "terms" | "cookies" | "disclaimer";
export type LegalPage = { slug: LegalSlug; title: string; updated: string; sections: { id: string; title: string }[]; bodyHtml: string };

export const LEGAL_LINKS: { slug: LegalSlug; label: string }[] = [
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms of Service" },
  { slug: "cookies", label: "Cookie Policy" },
  { slug: "disclaimer", label: "Disclaimer" },
];

/** A legal page imported from the old site by scripts/import-legal.mjs. */
export function getLegalPage(slug: LegalSlug): LegalPage {
  return JSON.parse(readFileSync(join(process.cwd(), "content", "legal", `${slug}.json`), "utf8")) as LegalPage;
}
