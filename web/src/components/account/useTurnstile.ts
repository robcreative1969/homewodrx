"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Cloudflare Turnstile. Supabase's CAPTCHA protection is on, so every sign-up, log-in and
// password reset must send a fresh token. Each token works once: call reset() after a try.
const TURNSTILE_SITE_KEY = "0x4AAAAAADLyVvXnAx5cEnfY";

type Turnstile = {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void }) => string;
  reset: (id?: string) => void;
};
type WithTurnstile = typeof window & { turnstile?: Turnstile };

export function useTurnstile() {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const w = window as WithTurnstile;
    const mount = () => {
      if (!box.current || !w.turnstile || widget.current) return;
      widget.current = w.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: setToken,
        "expired-callback": () => setToken(null),
      });
    };
    if (w.turnstile) {
      mount();
      return;
    }
    let s = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
    if (!s) {
      s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.dataset.turnstile = "";
      document.head.append(s);
    }
    s.addEventListener("load", mount);
    return () => s?.removeEventListener("load", mount);
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    (window as WithTurnstile).turnstile?.reset(widget.current ?? undefined);
  }, []);

  return { box, token, reset };
}
