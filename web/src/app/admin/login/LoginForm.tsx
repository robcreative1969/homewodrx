"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Cloudflare Turnstile: Supabase requires a human-check token on every sign-in.
const TURNSTILE_SITE_KEY = "0x4AAAAAADLyVvXnAx5cEnfY";

type Turnstile = {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void; theme?: string }) => string;
  reset: (id?: string) => void;
};

export function LoginForm() {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const w = window as typeof window & { turnstile?: Turnstile };
    const mount = () => {
      if (!box.current || !w.turnstile || widget.current) return;
      widget.current = w.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: setToken,
        "expired-callback": () => setToken(null),
      });
    };
    if (w.turnstile) mount();
    else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = mount;
      document.head.append(s);
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return setError("Wait for the human check to finish, then try again.");
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      options: { captchaToken: token },
    });
    if (err) {
      setBusy(false);
      setError(err.message === "Invalid login credentials" ? "That email and password don't match." : err.message);
      setToken(null);
      (window as typeof window & { turnstile?: Turnstile }).turnstile?.reset(widget.current ?? undefined);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  const field = "h-12 rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 text-base text-ink";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="admin-email" className="text-sm font-semibold text-ink-2">Email</label>
      <input id="admin-email" name="email" type="email" autoComplete="email" required className={field} />
      <label htmlFor="admin-password" className="text-sm font-semibold text-ink-2">Password</label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required className={field} />
      <div ref={box} className="min-h-[65px]" />
      {error ? <p role="alert" className="m-0 text-sm font-semibold text-accent-text">{error}</p> : null}
      <button type="submit" disabled={busy} className="h-12 rounded-xl bg-accent font-bold text-accent-ink disabled:opacity-60">
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
