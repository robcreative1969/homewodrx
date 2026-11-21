import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

const LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/shop", label: "Gear" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm">
        <Wordmark onDark height={32} />
        <p className="m-0">
          The training platform for functional fitness athletes, at the box, the health club, or
          at home.
        </p>
        <nav aria-label="Site information" className="flex flex-wrap gap-x-4 gap-y-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-semibold text-footer-ink">{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
