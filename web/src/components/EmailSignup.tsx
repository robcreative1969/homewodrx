"use client";

import { useRef, useState } from "react";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

// The same human check as login. It only shows itself when Cloudflare is unsure about a visitor.
const TURNSTILE_SITE_KEY = "0x4AAAAAADLyVvXnAx5cEnfY";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

function loadTurnstile(): Promise<Turnstile> {
  const w = window as typeof window & { turnstile?: Turnstile; __tsLoading?: Promise<Turnstile> };
  if (w.turnstile) return Promise.resolve(w.turnstile);
  w.__tsLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => (w.turnstile ? resolve(w.turnstile) : reject(new Error("load")));
    s.onerror = () => reject(new Error("load"));
    document.head.append(s);
  });
  return w.__tsLoading;
}

/**
 * Sign-up for the Daily 20 email (or blog emails). Goes through the "subscribe" Edge
 * Function, which checks the human-check token before saving anything.
 */
export function EmailSignup({ source, title, text }: { source: "homepage_digest" | "blog"; title: string; text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ kind: "idle" | "busy" | "ok" | "error"; message?: string }>({ kind: "idle" });

  function token(): Promise<string> {
    return loadTurnstile().then(
      (ts) =>
        new Promise((resolve, reject) => {
          const id = ts.render(box.current!, {
            sitekey: TURNSTILE_SITE_KEY,
            appearance: "interaction-only",
            callback: (t: string) => {
              resolve(t);
              setTimeout(() => ts.remove(id), 0);
            },
            "error-callback": () => {
              ts.remove(id);
              reject(new Error("check"));
            },
          });
        }),
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState({ kind: "error", message: "Enter a valid email address." });
    setState({ kind: "busy" });
    try {
      const captchaToken = await token();
      const res = await fetch(`${supabaseUrl()}/functions/v1/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseAnonKey(), Authorization: `Bearer ${supabaseAnonKey()}` },
        body: JSON.stringify({ email, source, captchaToken }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setState({ kind: "ok", message: source === "blog" ? "You're in. New posts will come to your inbox." : "You're in. Look for the Daily 20 in your inbox tomorrow morning." });
    } catch (err) {
      const msg = err instanceof Error && err.message !== "load" && err.message !== "check" ? err.message : "The human check couldn't load. Refresh and try again.";
      setState({ kind: "error", message: msg });
    }
  }

  return (
    <section aria-labelledby={`signup-${source}`} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
      <div className="flex flex-col gap-1">
        <h2 id={`signup-${source}`} className="m-0 text-lg font-bold">{title}</h2>
        <p className="m-0 text-[15px] text-ink-2">{text}</p>
      </div>
      {state.kind === "ok" ? (
        <p role="status" className="m-0 font-semibold">{state.message}</p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
          <input id={`email-${source}`} name="email" type="email" required autoComplete="email" placeholder="you@email.com" className="h-12 min-w-0 flex-1 rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 text-base text-ink placeholder:text-ink-3" />
          <button type="submit" disabled={state.kind === "busy"} className="h-12 rounded-xl bg-accent px-5 font-bold text-accent-ink disabled:opacity-60">
            {state.kind === "busy" ? "Signing up…" : "Sign up free"}
          </button>
        </form>
      )}
      <div ref={box} />
      {state.kind === "error" ? <p role="alert" className="m-0 text-sm font-semibold text-accent-text">{state.message}</p> : null}
    </section>
  );
}
