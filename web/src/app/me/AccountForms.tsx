"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError, USERNAME_PATTERN } from "@/lib/account";
import { field, FormError, label, secondaryButton } from "@/components/account/ui";

export function UsernameForm({ userId, current }: { userId: string; current: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = String(new FormData(e.currentTarget).get("username") ?? "").trim();
    setSaved(false);
    if (username === current) return;
    if (!USERNAME_PATTERN.test(username)) return setError("Usernames are 3 to 24 letters or numbers (_ . - are fine too).");
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: taken } = await supabase.rpc("username_exists", { p_username: username });
    if (taken === true && username.toLowerCase() !== current.toLowerCase()) {
      setBusy(false);
      return setError("That username is taken. Try another.");
    }
    const { error: err } = await supabase.from("profiles").update({ username }).eq("id", userId);
    setBusy(false);
    if (err) return setError(err.code === "23505" ? "That username is taken. Try another." : "That didn't save. Try again.");
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="me-username" className={label}>Username</label>
      <input id="me-username" name="username" defaultValue={current} required minLength={3} maxLength={24} className={field} />
      <FormError>{error}</FormError>
      {saved ? <p role="status" className="m-0 text-sm font-semibold text-ink">Saved.</p> : null}
      <button type="submit" disabled={busy} className={secondaryButton}>{busy ? "Saving…" : "Save username"}</button>
    </form>
  );
}

export function EmailForm({ current }: { current: string }) {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (email.toLowerCase() === current.toLowerCase()) return;
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.updateUser(
      { email },
      { emailRedirectTo: `${window.location.origin}/auth/callback?next=/me` },
    );
    setBusy(false);
    if (err) return setError(friendlyAuthError(err.message));
    setSentTo(email);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="me-email" className={label}>Email</label>
      <input id="me-email" name="email" type="email" autoComplete="email" defaultValue={current} required className={field} />
      <FormError>{error}</FormError>
      {sentTo ? (
        <p role="status" className="m-0 text-sm text-ink">
          Check your email. Your address changes once you open the confirmation link sent to <strong>{sentTo}</strong>
          {" "}(and, depending on your settings, to <strong>{current}</strong> too).
        </p>
      ) : null}
      <button type="submit" disabled={busy} className={secondaryButton}>{busy ? "Sending…" : "Change email"}</button>
    </form>
  );
}

export function DeleteAccount({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    // Old-site profile photos live in the avatars bucket under the person's id.
    const { data: files } = await supabase.storage.from("avatars").list(userId);
    if (files?.length) await supabase.storage.from("avatars").remove(files.map((f) => `${userId}/${f.name}`));
    const { error: err } = await supabase.rpc("delete_my_account");
    if (err) {
      setBusy(false);
      return setError("Your account wasn't deleted. Try again, or contact us.");
    }
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="self-start text-sm font-semibold text-accent-text underline">
        Delete my account
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-accent p-3.5">
      <p className="m-0 font-semibold">Delete your account for good?</p>
      <p className="m-0 text-[15px] text-ink-2">
        This removes your account and everything saved in it. If you get the Daily 20 by email, that stops too. It can&apos;t be undone.
      </p>
      <label htmlFor="me-delete" className={label}>Type DELETE to confirm</label>
      <input id="me-delete" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className={field} />
      <FormError>{error}</FormError>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className={secondaryButton}>Cancel</button>
        <button
          type="button"
          disabled={typed !== "DELETE" || busy}
          onClick={onDelete}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent font-bold text-accent-ink disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Delete account"}
        </button>
      </div>
    </div>
  );
}
