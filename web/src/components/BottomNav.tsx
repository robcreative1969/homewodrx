"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSignedIn } from "@/components/account/useSignedIn";

// The phone tab bar (hidden from lg up, where the header menu shows). It shows on every
// page; workout and builder screens stack their action bar above it (BottomBar).
// More is a page of its own (/more) for everything the other tabs don't cover.

type Tab = { label: string; href: string; match: string[]; icon: ReactNode };

const icon = (path: ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
);

const TABS: Tab[] = [
  {
    label: "Today",
    href: "/daily-wod",
    match: ["/daily-wod"],
    icon: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  },
  {
    label: "Library",
    href: "/workouts",
    match: ["/workouts", "/movements", "/stretches", "/stretch-routines", "/machines"],
    icon: icon(<><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" /></>),
  },
  {
    label: "Build",
    href: "/wodbuilder",
    match: ["/wodbuilder", "/stretchbuilder"],
    icon: icon(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="3" /></>),
  },
  {
    label: "Search",
    href: "/search",
    match: ["/search"],
    icon: icon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  },
  {
    label: "More",
    href: "/more",
    match: ["/more", "/me", "/login", "/signup", "/forgot-password", "/reset-password", "/blog", "/shop", "/timer", "/contact", "/privacy", "/terms", "/cookies", "/disclaimer"],
    icon: icon(<><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  // Signed in, the More tab is labelled Me: the More page starts with the account.
  const signedIn = useSignedIn();
  const isCurrent = (tab: Tab) => tab.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <nav
      data-bottom-nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="m-0 flex list-none p-0">
        {TABS.map((tab) => {
          const on = isCurrent(tab);
          return (
            <li key={tab.label} className="flex flex-1">
              <Link
                href={tab.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold no-underline ${on ? "text-accent-text" : "text-ink-2"}`}
              >
                {tab.icon}
                {tab.href === "/more" && signedIn ? "Me" : tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
