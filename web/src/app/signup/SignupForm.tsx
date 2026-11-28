"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError, USERNAME_PATTERN } from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { CodeStep } from "@/components/account/CodeStep";
import { field, FormError, label, primaryButton } from "@/components/account/ui";

const WAIT = "Wait for the human check to finish, then try again.";

/**
 * Sign up with a username and email only. We email a code; typing it in creates the
 * account and logs them in. A password can be added later on the Me page.
 */
export function SignupForm({ next }: { next: string }) {
  const { box, token, reset } = useTurnstile();
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  /** Emails the code. Returns a message if it didn't work. */
  async function sendCode(to: string): Promise<string | null> {
    if (!token) return WAIT;
    const { error: err } = await createClient().auth.signInWithOtp({
      email: to,
      options: { shouldCreateUser: true, captchaToken: token, data: { username: username.trim() } },
    });
    reset();
    return err ? friendlyAuthError(err.message) : null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = username.trim();
    const to = email.trim();
    if (!USERNAME_PATTERN.test(name)) return setError("Usernames are 3 to 24 letters or numbers (_ . - are fine too).");
    if (!token) return setError(WAIT);

    setBusy(true);
    setError(null);
    const { data: taken } = await createClient().rpc("username_exists", { p_username: name });
    if (taken === true) {
      setBusy(false);
      return setError("That username is taken. Try another.");
    }
    const problem = await sendCode(to);
    setBusy(false);
    if (problem) return setError(problem);
    setSentTo(to);
  }

  return (
    <div className="flex flex-col gap-3">
      {sentTo ? (
        <CodeStep email={sentTo} next={next} resend={() => sendCode(sentTo)} onBack={() => setSentTo(null)} />
      ) : (
        <form id="signup-form" onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor="signup-username" className={label}>Username</label>
          <input
            id="signup-username"
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9_.\-]{3,24}"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-describedby="signup-username-hint"
            className={field}
          />
          <p id="signup-username-hint" className="m-0 -mt-1 text-[13px] text-ink-2">3 to 24 letters or numbers.</p>
          <label htmlFor="signup-email" className={label}>Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="signup-email-hint"
            className={field}
          />
          <p id="signup-email-hint" className="m-0 -mt-1 text-[13px] text-ink-2">We&apos;ll email you a code to finish signing up.</p>
        </form>
      )}
      <div ref={box} className="min-h-[65px]" />
      {sentTo ? null : (
        <>
          <FormError>{error}</FormError>
          <button type="submit" form="signup-form" disabled={busy} className={primaryButton}>
            {busy ? "Sending your code…" : "Create free account"}
          </button>
          <p className="m-0 text-[13px] text-ink-2">
            By creating an account you agree to the <a href="/terms" className="text-accent-text">Terms</a> and{" "}
            <a href="/privacy" className="text-accent-text">Privacy Policy</a>.
          </p>
        </>
      )}
    </div>
  );
}
