"use client";

import Link from "next/link";
import { useSignedIn } from "./useSignedIn";
import { SignOutButton } from "./SignOutButton";
import { ACCOUNT_BENEFITS, primaryButton, secondaryButton } from "./ui";

/** Top of the More page: the way into an account on phones, where the header link is hidden. */
export function MoreAccount() {
  const signedIn = useSignedIn();
  if (signedIn === null) return <div className="min-h-[120px]" aria-hidden="true" />;

  if (signedIn) {
    const row = "flex min-h-14 items-center justify-between rounded-2xl border border-line bg-surface px-[18px] text-[17px] font-bold text-ink no-underline";
    return (
      <div className="flex flex-col gap-2">
        <Link href="/history" className={row}>
          Your history
          <span aria-hidden="true" className="text-ink-2">›</span>
        </Link>
        <Link href="/me" className={row}>
          Your account
          <span aria-hidden="true" className="text-ink-2">›</span>
        </Link>
        <SignOutButton className={secondaryButton} />
      </div>
    );
  }

  return (
    <section aria-labelledby="more-account" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
      <h2 id="more-account" className="m-0 text-lg font-bold">Free account</h2>
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[15px] text-ink-2">
        {ACCOUNT_BENEFITS.slice(0, 3).map((b) => (
          <li key={b} className="flex gap-2">
            <span aria-hidden="true" className="font-bold text-accent-text">✓</span>
            {b}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Link href="/signup" className={primaryButton}>Create account</Link>
        <Link href="/login" className={secondaryButton}>Log in</Link>
      </div>
    </section>
  );
}
