"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Cookie choice for Google Analytics. Shown automatically to visitors whose browser time
// zone is in Europe (where analytics stays off until they accept; see Analytics.tsx), and to
// anyone who opens it from "Cookie choices" in the footer.

const KEY = "hwrx-consent";
export const OPEN_EVENT = "hwrx-consent-open";

type Gtag = (...args: unknown[]) => void;

function inEurope() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return tz.startsWith("Europe/") || ["Atlantic/Reykjavik", "Atlantic/Canary", "Atlantic/Madeira", "Atlantic/Faroe", "Atlantic/Azores"].includes(tz);
  } catch {
    return false;
  }
}

function clearGaCookies() {
  const host = location.hostname.replace(/^www\./, "");
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=.${host}`, `; domain=${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    const show = () => setOpen(true);
    // Deferred so the first paint matches the server render.
    const t = !saved && inEurope() ? window.setTimeout(show, 0) : undefined;
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, []);

  function choose(value: "granted" | "denied") {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    gtag?.("consent", "update", { analytics_storage: value });
    if (value === "denied") clearGaCookies();
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-50 px-4 lg:bottom-4"
    >
      <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-ink shadow-lg">
        <p className="m-0">
          We use Google Analytics cookies to see how the site is used. No advertising cookies.{" "}
          <Link href="/cookies" className="font-semibold text-ink">Cookie Policy</Link>
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => choose("granted")} className="min-h-11 flex-1 rounded-full border-[1.5px] border-ink bg-ink px-4 font-semibold text-ground">
            Accept
          </button>
          <button type="button" onClick={() => choose("denied")} className="min-h-11 flex-1 rounded-full border-[1.5px] border-chip-line bg-surface px-4 font-semibold text-ink">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieChoicesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookie choices
    </button>
  );
}
