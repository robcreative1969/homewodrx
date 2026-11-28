"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { CodeStep } from "@/components/account/CodeStep";
import { field, FormError, label, primaryButton } from "@/components/account/ui";

const WAIT = "Wait for the human check to finish, then try again.";

/**
 * Forgot password: we email a login code, then they set a new password. A code works on
 * any device, unlike a reset link, which fails when opened in a different browser.
 */
export function ForgotForm() {
  const { box, token, reset } = useTurnstile();
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode(to: string): Promise<string | null> {
    if (!token) return WAIT;
    const { error: err } = await createClient().auth.signInWithOtp({
      email: to,
      options: { shouldCreateUser: false, captchaToken: token },
    });
    reset();
    return err ? friendlyAuthError(err.message) : null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const to = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!token) return setError(WAIT);
    setBusy(true);
    setError(null);
    const problem = await sendCode(to);
    setBusy(false);
    if (problem) return setError(problem);
    setSentTo(to);
  }

  return (
    <div className="flex flex-col gap-3">
      {sentTo ? (
        <CodeStep email={sentTo} next="/reset-password" resend={() => sendCode(sentTo)} onBack={() => setSentTo(null)} />
      ) : (
        <form id="forgot-form" onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor="forgot-email" className={label}>Email</label>
          <input id="forgot-email" name="email" type="email" autoComplete="email" required className={field} />
        </form>
      )}
      <div ref={box} className="min-h-[65px]" />
      {sentTo ? null : (
        <>
          <FormError>{error}</FormError>
          <button type="submit" form="forgot-form" disabled={busy} className={primaryButton}>
            {busy ? "Sending…" : "Email me a code"}
          </button>
        </>
      )}
    </div>
  );
}
