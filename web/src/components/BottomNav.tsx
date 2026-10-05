"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { MAIN_NAV } from "@/lib/nav";

// The phone tab bar (hidden from lg up, where the header menu shows). Pages with a
// bottom action bar (workout and builder screens) hide it; see globals.css. When the
// Planner and accounts land, Search and More become Plan and Me.

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
    match: ["/wodbuilder"],
    icon: icon(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="3" /></>),
  },
  {
    label: "Search",
    href: "/search",
    match: ["/search"],
    icon: icon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const panelId = useId();

  // Close the More panel on navigation (adjusted during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (moreOpen) setMoreOpen(false);
  }

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const isCurrent = (tab: Tab) => tab.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
  const tabClass = (on: boolean) =>
    `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold no-underline ${on ? "text-accent-text" : "text-ink-2"}`;

  return (
    <div data-bottom-nav className="lg:hidden">
      {moreOpen ? (
        <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setMoreOpen(false)} aria-hidden="true" />
      ) : null}
      <div
        id={panelId}
        hidden={!moreOpen}
        className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-40 rounded-t-2xl border-t border-line bg-surface shadow-lg"
      >
        <ul className="m-0 flex list-none flex-col px-4 py-2">
          {MAIN_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex min-h-12 items-center border-b border-divider text-[17px] font-semibold text-ink no-underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="m-0 flex list-none p-0">
          {TABS.map((tab) => {
            const on = isCurrent(tab);
            return (
              <li key={tab.label} className="flex flex-1">
                <Link href={tab.href} aria-current={on ? "page" : undefined} className={tabClass(on)}>
                  {tab.icon}
                  {tab.label}
                </Link>
              </li>
            );
          })}
          <li className="flex flex-1">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls={panelId}
              onClick={() => setMoreOpen((o) => !o)}
              className={tabClass(moreOpen)}
            >
              {icon(<><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>)}
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
