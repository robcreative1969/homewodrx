"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  friendlyAuthError,
  passwordProblem,
  USERNAME_PATTERN,
} from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { CodeStep } from "@/components/account/CodeStep";
import {
  field,
  FormError,
  label,
  primaryButton,
} from "@/components/account/ui";

const WAIT = "Wait for the human check to finish, then try again.";

export function SignupForm({ next }: { next: string }) {
  const router = useRouter();
  const { box, token, reset } = useTurnstile();
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  /** No password: a code signs them up and logs them in. Returns a message if it failed. */
  async function sendCode(email: string, name: string): Promise<string | null> {
    if (!token) return WAIT;
    const { error: err } = await createClient().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        captchaToken: token,
        data: { username: name },
      },
    });
    reset();
    return err ? friendlyAuthError(err.message) : null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("username") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!USERNAME_PATTERN.test(name)) {
      return setError(
        "Usernames are 3 to 24 letters or numbers (_ . - are fine too).",
      );
    }
    const weak = password ? passwordProblem(password) : null;
    if (weak) return setError(weak);
    if (!token) return setError(WAIT);

    setBusy(true);
    setError(null);
    const supabase = createClient();

    const { data: taken } = await supabase.rpc("username_exists", {
      p_username: name,
    });
    if (taken === true) {
      setBusy(false);
      return setError("That username is taken. Try another.");
    }

    if (!password) {
      const problem = await sendCode(email, name);
      setBusy(false);
      if (problem) return setError(problem);
      setSentTo(email);
      return;
    }

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken: token,
        data: { username: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) {
      setBusy(false);
      setError(friendlyAuthError(err.message));
      reset();
      return;
    }
    // Supabase answers an already-used email with a user that has no identities (it
    // doesn't say so outright, to keep addresses private).
    if (data.user && data.user.identities?.length === 0) {
      setBusy(false);
      reset();
      return setError(
        "There's already an account with that email. Log in, or reset your password if you've forgotten it.",
      );
    }
    // Signed in straight away when email confirmation is off; otherwise they confirm first.
    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }
    setSentTo(email);
    setBusy(false);
  }

  // Both ways end here: a password sign-up's confirmation email carries the same kind of code.
  const codeStep = sentTo ? (
    <CodeStep
      email={sentTo}
      next={next}
      resend={async () => {
        if (!token) return WAIT;
        const { error: err } = await createClient().auth.resend({
          type: "signup",
          email: sentTo,
          options: { captchaToken: token },
        });
        reset();
        // A no-password sign-up has no pending confirmation to resend, so send a fresh login code.
        if (err) return sendCode(sentTo, username);
        return null;
      }}
      onBack={() => setSentTo(null)}
    />
  ) : null;

  return (
    <div className="flex flex-col gap-3">
      {codeStep ?? (
        <form
          id="signup-form"
          onSubmit={onSubmit}
          className="flex flex-col gap-3"
        >
          <label htmlFor="signup-username" className={label}>
            Username
          </label>
          <input
            id="signup-username"
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={24}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="[A-Za-z0-9_.\-]{3,24}"
            aria-describedby="signup-username-hint"
            className={field}
          />
          <p
            id="signup-username-hint"
            className="m-0 -mt-1 text-[13px] text-ink-2"
          >
            Only you see your results. Letters and numbers, 3 to 24.
          </p>
          <label htmlFor="signup-email" className={label}>
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={field}
          />
          <label htmlFor="signup-password" className={label}>
            Password (optional)
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            aria-describedby="signup-password-hint"
            className={field}
          />
          <p
            id="signup-password-hint"
            className="m-0 -mt-1 text-[13px] text-ink-2"
          >
            At least 8 characters, with letters and numbers. Or leave it blank
            and log in with a code we email you.
          </p>
        </form>
      )}
      <div ref={box} className="min-h-[65px]" />
      {codeStep ? null : (
        <>
          <FormError>{error}</FormError>
          <button
            type="submit"
            form="signup-form"
            disabled={busy}
            className={primaryButton}
          >
            {busy ? "Creating your account…" : "Create free account"}
          </button>
          <p className="m-0 text-[13px] text-ink-2">
            By creating an account you agree to the{" "}
            <a href="/terms" className="text-accent-text">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent-text">
              Privacy Policy
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
