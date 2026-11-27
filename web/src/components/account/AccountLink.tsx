"use client";

import Link from "next/link";
import { useSignedIn } from "./useSignedIn";

/** "Log in" in the header, or "Me" once signed in. Hidden until the session is known. */
export function AccountLink() {
  const signedIn = useSignedIn();
  if (signedIn === null) return <span className="hidden min-w-[60px] lg:block" aria-hidden="true" />;
  return (
    <Link
      href={signedIn ? "/me" : "/login"}
      className="hidden min-h-11 items-center whitespace-nowrap rounded-lg px-2 text-[15px] font-semibold text-accent-text no-underline hover:bg-surface-muted lg:flex"
    >
      {signedIn ? "Me" : "Log in"}
    </Link>
  );
}
