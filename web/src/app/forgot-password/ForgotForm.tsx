"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { field, FormError, FormNote, label, primaryButton } from "@/components/account/ui";

export function ForgotForm() {
  const { box, token, reset } = useTurnstile();
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return setError("Wait for the human check to finish, then try again.");
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.resetPasswordForEmail(email, {
      captchaToken: token,
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (err) {
      setError(friendlyAuthError(err.message));
      reset();
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <FormNote>
        If there&apos;s an account for <strong>{sentTo}</strong>, a link to set a new password is on its way. Open it on this device.
      </FormNote>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="forgot-email" className={label}>Email</label>
      <input id="forgot-email" name="email" type="email" autoComplete="email" required className={field} />
      <div ref={box} className="min-h-[65px]" />
      <FormError>{error}</FormError>
      <button type="submit" disabled={busy} className={primaryButton}>
        {busy ? "Sending…" : "Email me a link"}
      </button>
    </form>
  );
}
