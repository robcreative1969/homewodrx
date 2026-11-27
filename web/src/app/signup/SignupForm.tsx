"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError, passwordProblem, USERNAME_PATTERN } from "@/lib/account";
import { useTurnstile } from "@/components/account/useTurnstile";
import { field, FormError, FormNote, label, primaryButton } from "@/components/account/ui";

export function SignupForm({ next }: { next: string }) {
  const router = useRouter();
  const { box, token, reset } = useTurnstile();
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!USERNAME_PATTERN.test(username)) {
      return setError("Usernames are 3 to 24 letters or numbers (_ . - are fine too).");
    }
    const weak = passwordProblem(password);
    if (weak) return setError(weak);
    if (!token) return setError("Wait for the human check to finish, then try again.");

    setBusy(true);
    setError(null);
    const supabase = createClient();

    const { data: taken } = await supabase.rpc("username_exists", { p_username: username });
    if (taken === true) {
      setBusy(false);
      return setError("That username is taken. Try another.");
    }

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken: token,
        data: { username },
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
      return setError("There's already an account with that email. Log in, or reset your password if you've forgotten it.");
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

  if (sentTo) {
    return (
      <FormNote>
        Check your email. We sent a link to <strong>{sentTo}</strong>. Open it on this device to finish signing up.
      </FormNote>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="signup-username" className={label}>Username</label>
      <input
        id="signup-username"
        name="username"
        autoComplete="username"
        required
        minLength={3}
        maxLength={24}
        pattern="[A-Za-z0-9_.\-]{3,24}"
        aria-describedby="signup-username-hint"
        className={field}
      />
      <p id="signup-username-hint" className="m-0 -mt-1 text-[13px] text-ink-2">Only you see your results. Letters and numbers, 3 to 24.</p>
      <label htmlFor="signup-email" className={label}>Email</label>
      <input id="signup-email" name="email" type="email" autoComplete="email" required className={field} />
      <label htmlFor="signup-password" className={label}>Password</label>
      <input
        id="signup-password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        aria-describedby="signup-password-hint"
        className={field}
      />
      <p id="signup-password-hint" className="m-0 -mt-1 text-[13px] text-ink-2">At least 8 characters, with letters and numbers.</p>
      <div ref={box} className="min-h-[65px]" />
      <FormError>{error}</FormError>
      <button type="submit" disabled={busy} className={primaryButton}>
        {busy ? "Creating your account…" : "Create free account"}
      </button>
      <p className="m-0 text-[13px] text-ink-2">
        By creating an account you agree to the <a href="/terms" className="text-accent-text">Terms</a> and{" "}
        <a href="/privacy" className="text-accent-text">Privacy Policy</a>.
      </p>
    </form>
  );
}
