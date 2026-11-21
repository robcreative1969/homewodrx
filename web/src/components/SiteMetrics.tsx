"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

// Cookie-free page views and site searches, the same as the live site sends (see
// site/js/consent.js). No cookies, no personal data; the admin dashboard reads them.

function device() {
  const w = Math.min(screen.width || 0, window.innerWidth || 9999);
  return w < 700 ? "mobile" : w < 1100 ? "tablet" : "desktop";
}

function send(body: Record<string, unknown>) {
  if (location.hostname === "localhost") return;
  try {
    fetch(`${supabaseUrl()}/rest/v1/rpc/log_site_event`, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", apikey: supabaseAnonKey(), Authorization: `Bearer ${supabaseAnonKey()}` },
      body: JSON.stringify(body),
    }).catch(() => {});
  } catch {
    // Metrics must never break the page.
  }
}

export function SiteMetrics() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (path.startsWith("/admin")) return;
    // The referrer only means something on the first page of a visit.
    const referrer = first.current ? document.referrer || null : null;
    first.current = false;
    send({ p_kind: "view", p_host: location.hostname, p_path: path, p_referrer: referrer, p_device: device() });
  }, [path]);
  return null;
}

/** Logs one site search once the results are on screen. */
export function LogSearch({ query, results }: { query: string; results: number }) {
  useEffect(() => {
    if (query.trim().length < 2) return;
    send({ p_kind: "search", p_host: location.hostname, p_path: "/search", p_device: device(), p_query: query, p_results: results });
  }, [query, results]);
  return null;
}
