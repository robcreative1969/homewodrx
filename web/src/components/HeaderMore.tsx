"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MORE_NAV } from "@/lib/nav";

/** The header's More menu (desktop only). Closes on a pick, Escape, or a click elsewhere. */
export function HeaderMore() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const current = MORE_NAV.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li ref={box} className="relative">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="header-more"
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-11 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-[15px] font-semibold hover:bg-surface-muted ${current ? "text-accent-text" : "text-ink"}`}
      >
        More
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={open ? "rotate-180" : ""}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul
        id="header-more"
        hidden={!open}
        className="absolute top-full right-0 z-40 m-0 mt-1 min-w-48 list-none rounded-xl border border-line bg-surface p-1.5 shadow-lg"
      >
        {MORE_NAV.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === l.href ? "page" : undefined}
              className="flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold text-ink no-underline hover:bg-surface-muted"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
