"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSignedIn } from "./useSignedIn";
import { SignOutButton } from "./SignOutButton";

const item = "flex min-h-11 w-full items-center rounded-lg px-3 text-left text-[15px] font-semibold text-ink no-underline hover:bg-surface-muted";

/**
 * Header account control (desktop). Signed out: "Log in". Signed in: a "Me" menu with
 * Your history, Your workouts, Your account and Log out, so logging out is two clicks from any page.
 * Hidden until the session is known.
 */
export function AccountLink() {
  const signedIn = useSignedIn();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

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

  if (signedIn === null) return <span className="hidden min-w-[150px] lg:block" aria-hidden="true" />;

  if (!signedIn) {
    // We can't tell whether a signed-out visitor has an account, so offer both.
    return (
      <div className="hidden items-center gap-1 lg:flex">
        <Link
          href="/login"
          className="flex min-h-11 items-center whitespace-nowrap rounded-lg px-2 text-[15px] font-semibold text-ink no-underline hover:bg-surface-muted"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="flex min-h-10 items-center whitespace-nowrap rounded-lg bg-accent px-3.5 text-[15px] font-bold text-accent-ink no-underline"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div ref={box} className="relative hidden lg:block">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="header-account"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 items-center gap-1 whitespace-nowrap rounded-lg px-2 text-[15px] font-semibold text-accent-text hover:bg-surface-muted"
      >
        Me
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={open ? "rotate-180" : ""}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id="header-account"
        hidden={!open}
        className="absolute top-full right-0 z-40 mt-1 flex min-w-48 flex-col rounded-xl border border-line bg-surface p-1.5 shadow-lg"
      >
        <Link href="/history" onClick={() => setOpen(false)} className={item}>Your history</Link>
        <Link href="/my-workouts" onClick={() => setOpen(false)} className={item}>Your workouts</Link>
        <Link href="/me" onClick={() => setOpen(false)} className={item}>Your account</Link>
        <SignOutButton className={item} onDone={() => setOpen(false)} />
      </div>
    </div>
  );
}
