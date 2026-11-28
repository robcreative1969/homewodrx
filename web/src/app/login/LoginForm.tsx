"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { CodeStep } from "@/components/account/CodeStep";
import { field, FormError, label, primaryButton, secondaryButton } from "@/components/account/ui";

const WAIT = "Wait for the human check to finish, then try again.";

/** Log in with a password, or with a code we email (no password needed). */
export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const { box, token, reset } = useTurnstile();
  const [mode, setMode] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Emails a code to an existing account. Returns a message if it didn't work. */
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
    const form = new FormData(e.currentTarget);
    const to = String(form.get("email") ?? "").trim();
    if (!token) return setError(WAIT);
    setBusy(true);
    setError(null);

    if (mode === "code") {
      const problem = await sendCode(to);
      setBusy(false);
      if (problem) return setError(problem);
      setCodeSentTo(to);
      return;
    }

    const { error: err } = await createClient().auth.signInWithPassword({
      email: to,
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

  function switchMode() {
    setMode(mode === "password" ? "code" : "password");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {codeSentTo ? (
        <CodeStep email={codeSentTo} next={next} resend={() => sendCode(codeSentTo)} onBack={() => setCodeSentTo(null)} />
      ) : (
        <form id="login-form" onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor="login-email" className={label}>Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
          {mode === "password" ? (
            <>
              <div className="flex items-baseline justify-between">
                <label htmlFor="login-password" className={label}>Password</label>
                <Link href="/forgot-password" className="text-sm font-semibold text-accent-text">Forgot password?</Link>
              </div>
              <input id="login-password" name="password" type="password" autoComplete="current-password" required className={field} />
            </>
          ) : (
            <p className="m-0 -mt-1 text-[13px] text-ink-2">We&apos;ll email you a code to log in. No password needed.</p>
          )}
        </form>
      )}
      {/* One human check for every step, so "Send a new code" has one too. */}
      <div ref={box} className="min-h-[65px]" />
      {codeSentTo ? null : (
        <>
          <FormError>{error}</FormError>
          <button type="submit" form="login-form" disabled={busy} className={primaryButton}>
            {busy ? (mode === "code" ? "Sending…" : "Logging in…") : mode === "code" ? "Email me a code" : "Log in"}
          </button>
          <button type="button" onClick={switchMode} className={secondaryButton}>
            {mode === "password" ? "Email me a code instead" : "Use my password instead"}
          </button>
        </>
      )}
    </div>
  );
}
