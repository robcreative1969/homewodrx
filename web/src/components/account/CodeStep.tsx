"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/account";
import { field, FormError, FormNote, label, primaryButton } from "./ui";

/**
 * Second screen of a code sign-in or sign-up: type the code from the email. A code works
 * on any device, unlike an email link, which can fail in a different browser.
 * `resend` asks for a new code (it needs a fresh human check, so the caller handles it).
 */
export function CodeStep({
  email,
  next,
  resend,
  onBack,
}: {
  email: string;
  next: string;
  resend: () => Promise<string | null>;
  onBack: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") ?? "").replace(/\D/g, "");
    if (code.length < 6) return setError("Enter the code from the email.");
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.verifyOtp({ email, token: code, type: "email" });
    if (err) {
      setBusy(false);
      return setError(friendlyAuthError(err.message));
    }
    router.replace(next);
    router.refresh();
  }

  async function onResend() {
    setError(null);
    setNote(null);
    const problem = await resend();
    if (problem) setError(problem);
    else setNote("We sent a new code. Use the newest one.");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <FormNote>
        We emailed a code to <strong>{email}</strong>. It can take a minute to arrive. Check spam if you don&apos;t see it.
      </FormNote>
      <label htmlFor="otp-code" className={label}>Code</label>
      <input
        id="otp-code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]{6,12}"
        maxLength={12}
        required
        autoFocus
        className={`${field} text-center text-xl tracking-[0.3em]`}
      />
      <FormError>{error}</FormError>
      {note ? <p role="status" className="m-0 text-sm font-semibold text-ink">{note}</p> : null}
      <button type="submit" disabled={busy} className={primaryButton}>
        {busy ? "Checking…" : "Continue"}
      </button>
      <div className="flex justify-between text-sm font-semibold">
        <button type="button" onClick={onBack} className="min-h-11 text-accent-text">Use a different email</button>
        <button type="button" onClick={onResend} className="min-h-11 text-accent-text">Send a new code</button>
      </div>
    </form>
  );
}
