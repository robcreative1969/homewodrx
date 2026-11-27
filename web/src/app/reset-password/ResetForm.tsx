"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError, passwordProblem } from "@/lib/account";
import { field, FormError, label, primaryButton } from "@/components/account/ui";

/** Sets a new password. Also used on Me to change it while signed in. */
export function NewPasswordForm({ done, button = "Save new password" }: { done?: string; button?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) return setError("The two passwords don't match.");
    const weak = passwordProblem(password);
    if (weak) return setError(weak);
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (err) return setError(friendlyAuthError(err.message));
    formEl.reset();
    if (done) {
      router.replace(done);
      router.refresh();
    } else setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="new-password" className={label}>New password</label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" required minLength={8} className={field} />
      <label htmlFor="confirm-password" className={label}>Type it again</label>
      <input id="confirm-password" name="confirm" type="password" autoComplete="new-password" required minLength={8} className={field} />
      <p className="m-0 -mt-1 text-[13px] text-ink-2">At least 8 characters, with letters and numbers.</p>
      <FormError>{error}</FormError>
      {saved ? <p role="status" className="m-0 text-sm font-semibold text-ink">Password changed.</p> : null}
      <button type="submit" disabled={busy} className={primaryButton}>
        {busy ? "Saving…" : button}
      </button>
    </form>
  );
}
