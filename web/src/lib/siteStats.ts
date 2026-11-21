import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Site metrics from public.site_events (cookie-free; see site/migrations/2026-11-20_site_metrics.sql).
// Only real visitors to the live site count: the preview and local copies are left out.
const LIVE_HOSTS = ["homewodrx.com", "www.homewodrx.com"];

type Event = {
  at: string;
  kind: "view" | "search";
  path: string;
  referrer: string | null;
  device: string | null;
  country: string | null;
  visitor: string | null;
  query: string | null;
  results: number | null;
};

export type Count = { label: string; count: number };
export type Day = { day: string; views: number; visitors: number };

export type SiteStats = {
  days: number;
  views: number;
  visits: number; // unique visitors per day, added up (the hash changes daily by design)
  today: { views: number; visits: number };
  daily: Day[];
  pages: Count[];
  workouts: Count[];
  referrers: Count[];
  devices: Count[];
  countries: Count[];
  searches: Count[];
  emptySearches: Count[];
  searchCount: number;
  since: string | null; // first event ever recorded, so the page can say how much history exists
};

/** Day key in US Eastern time, the site's home time zone. */
function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function top(map: Map<string, number>, n = 10): Count[] {
  return [...map].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, count]) => ({ label, count }));
}

function bump(map: Map<string, number>, key: string | null | undefined) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

/** Labels for where visitors came from: search engines and social networks by name. */
function referrerLabel(host: string | null) {
  if (!host) return "Direct or app";
  const h = host.replace(/^(m|l|lm|out)\./, "");
  if (/(^|\.)google\./.test(h)) return "Google";
  if (/(^|\.)bing\.com$/.test(h)) return "Bing";
  if (/duckduckgo\.com$/.test(h)) return "DuckDuckGo";
  if (/(facebook|fb)\.com$/.test(h)) return "Facebook";
  if (/instagram\.com$/.test(h)) return "Instagram";
  if (/tiktok\.com$/.test(h)) return "TikTok";
  if (/(youtube\.com|youtu\.be)$/.test(h)) return "YouTube";
  if (/pinterest\./.test(h)) return "Pinterest";
  if (/(t\.co|x\.com|twitter\.com)$/.test(h)) return "X";
  if (/reddit\.com$/.test(h)) return "Reddit";
  if (/bsky\.app$/.test(h)) return "Bluesky";
  if (/threads\.(net|com)$/.test(h)) return "Threads";
  return h;
}

export async function loadSiteStats(supabase: SupabaseClient, days = 30): Promise<SiteStats> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const rows: Event[] = [];
  // Pages of 1,000 (the API's limit per request).
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("site_events")
      .select("at,kind,path,referrer,device,country,visitor,query,results")
      .in("host", LIVE_HOSTS)
      .gte("at", since)
      .order("at", { ascending: true })
      .range(from, from + 999);
    if (error) throw new Error(`Could not load site metrics: ${error.message}`);
    rows.push(...((data ?? []) as Event[]));
    if (!data || data.length < 1000) break;
  }
  const { data: first } = await supabase.from("site_events").select("at").in("host", LIVE_HOSTS).order("at").limit(1).maybeSingle();

  const todayKey = dayKey(new Date().toISOString());
  const perDay = new Map<string, { views: number; visitors: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) perDay.set(dayKey(new Date(Date.now() - i * 86400000).toISOString()), { views: 0, visitors: new Set() });

  const pages = new Map<string, number>();
  const workouts = new Map<string, number>();
  const referrers = new Map<string, number>();
  const devices = new Map<string, number>();
  const countries = new Map<string, number>();
  const searches = new Map<string, number>();
  const empty = new Map<string, number>();
  const firstSeenToday = new Set<string>(); // count each visitor's referrer once per day
  let views = 0;
  let searchCount = 0;

  for (const e of rows) {
    const d = dayKey(e.at);
    if (e.kind === "search") {
      searchCount++;
      bump(searches, e.query);
      if (e.results === 0) bump(empty, e.query);
      continue;
    }
    views++;
    const slot = perDay.get(d);
    if (slot) {
      slot.views++;
      if (e.visitor) slot.visitors.add(e.visitor);
    }
    const path = e.path.replace(/\.html$/, "").replace(/\/$/, "") || "/";
    bump(pages, path);
    const w = path.match(/^\/workouts?\/([^/]+)$/);
    if (w) bump(workouts, w[1]);
    const key = `${d}|${e.visitor ?? e.at}`;
    if (!firstSeenToday.has(key)) {
      firstSeenToday.add(key);
      bump(referrers, referrerLabel(e.referrer));
      bump(devices, e.device ?? "unknown");
      bump(countries, e.country ?? "Unknown");
    }
  }

  const daily = [...perDay].map(([day, v]) => ({ day, views: v.views, visitors: v.visitors.size }));
  const t = perDay.get(todayKey);
  return {
    days,
    views,
    visits: daily.reduce((n, d) => n + d.visitors, 0),
    today: { views: t?.views ?? 0, visits: t?.visitors.size ?? 0 },
    daily,
    pages: top(pages),
    workouts: top(workouts),
    referrers: top(referrers, 8),
    devices: top(devices, 3),
    countries: top(countries, 8),
    searches: top(searches),
    emptySearches: top(empty),
    searchCount,
    since: first?.at ?? null,
  };
}
