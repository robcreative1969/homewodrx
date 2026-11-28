"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Logs out in the browser, so every "Me" link and menu hears about it at once
 * (a server-only log out left the header saying "Me"). Then goes home.
 */
export function useSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }
  return { signOut, busy };
}

export function SignOutButton({ className, onDone }: { className: string; onDone?: () => void }) {
  const { signOut, busy } = useSignOut();
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        await signOut();
        onDone?.();
      }}
      className={className}
    >
      {busy ? "Logging out…" : "Log out"}
    </button>
  );
}
