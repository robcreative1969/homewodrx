import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountLink } from "@/components/account/AccountLink";
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
                <Link href={item.href} className="flex min-h-11 items-center whitespace-nowrap rounded-lg px-2 text-[15px] font-semibold text-ink no-underline hover:bg-surface-muted xl:px-2.5">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <AccountLink />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
