import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wordmark } from "@/components/Wordmark";
import { MAIN_NAV } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Wordmark />
        <nav aria-label="Main" className="flex items-center gap-1">
          <ul className="m-0 hidden list-none items-center gap-1 p-0 lg:flex">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-11 items-center rounded-lg px-2.5 text-[15px] font-semibold text-ink no-underline hover:bg-surface-muted">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <span className="header-menu">
            <MobileMenu />
          </span>
        </nav>
      </div>
    </header>
  );
}
