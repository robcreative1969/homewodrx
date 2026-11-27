"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { field, FormError, label, primaryButton } from "@/components/account/ui";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const { box, token, reset } = useTurnstile();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return setError("Wait for the human check to finish, then try again.");
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      options: { captchaToken: token },
    });
    if (err) {
      setBusy(false);
      setError(friendlyAuthError(err.message));
      reset();
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="login-email" className={label}>Email</label>
      <input id="login-email" name="email" type="email" autoComplete="email" required className={field} />
      <div className="flex items-baseline justify-between">
        <label htmlFor="login-password" className={label}>Password</label>
        <Link href="/forgot-password" className="text-sm font-semibold text-accent-text">Forgot password?</Link>
      </div>
      <input id="login-password" name="password" type="password" autoComplete="current-password" required className={field} />
      <div ref={box} className="min-h-[65px]" />
      <FormError>{error}</FormError>
      <button type="submit" disabled={busy} className={primaryButton}>
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
