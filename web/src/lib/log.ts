// Logging: what a result points at, how scores are typed and shown, and the
// consistency numbers on the History page. Safe to use in the browser.

export type ScoreKind = "time" | "rounds" | "reps";

/** What a "Mark as done" saves against. */
export type LogTarget =
  | { source: "library"; slug: string; title: string; score: ScoreKind }
  | { source: "daily20"; date: string; title: string; score: ScoreKind }
  /** query is the builder link without "?", so History can link back to it. */
  | { source: "builder"; title: string; score: ScoreKind; query?: string };

/** A row from public.results, as the log screens read it. */
export type LogEntry = {
  id: string;
  source: "library" | "daily20" | "builder" | "activity";
  title: string | null;
  benchmark_slug: string | null;
  daily20_date: string | null;
  /** Builder entries only; missing on rows logged before step 3. */
  builder_query?: string | null;
  activity_type: string | null;
  activity_name: string | null;
  distance_value: number | null;
  distance_unit: string | null;
  duration_seconds: number | null;
  score_display: string | null;
  score_seconds: number | null;
  score_rounds: number | null;
  score_reps: number | null;
  is_rx: boolean | null;
  notes: string | null;
  date: string;
  created_at: string;
};

export const LOG_COLUMNS =
  "id,source,title,benchmark_slug,daily20_date,activity_type,activity_name,distance_value,distance_unit,duration_seconds,score_display,score_seconds,score_rounds,score_reps,is_rx,notes,date,created_at";

/** Workout mode → how its score is typed. */
export function scoreKindFor(mode: string): ScoreKind {
  if (mode === "amrap") return "rounds";
  if (mode === "emom" || mode === "tabata") return "reps";
  return "time";
}

export const ACTIVITY_TYPES = [
  { value: "run", label: "Run" },
  { value: "walk", label: "Walk" },
  { value: "bike", label: "Bike" },
  { value: "row", label: "Row" },
  { value: "swim", label: "Swim" },
  { value: "hike", label: "Hike" },
  { value: "other", label: "Other" },
] as const;

export function activityLabel(type: string | null, name?: string | null) {
  if (type === "other" && name) return name;
  return ACTIVITY_TYPES.find((a) => a.value === type)?.label ?? "Activity";
}

/** "27:40" → 1660 seconds, "1:02:03" → 3723. A bare number is minutes: "45" → 2700. */
export function parseDuration(text: string): number | null {
  const t = text.trim();
  if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t)) return Math.round(Number(t) * 60);
  const parts = t.split(":");
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !/^\d+$/.test(p))) return null;
  const nums = parts.map(Number);
  const [h, m, s] = nums.length === 3 ? nums : [0, nums[0], nums[1]];
  if (s >= 60 || (nums.length === 3 && m >= 60)) return null;
  const total = h * 3600 + m * 60 + s;
  return total > 0 && total < 86400 ? total : null;
}

export function formatDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export function roundsDisplay(rounds: number, reps: number) {
  return `${rounds} ${rounds === 1 ? "round" : "rounds"}${reps ? ` + ${reps} reps` : ""}`;
}

/** The one line shown for an entry in lists: "7:42 · Rx", "Run · 3 mi · 27:40", "Done". */
export function entrySummary(e: LogEntry) {
  if (e.source === "activity") {
    const bits: string[] = [];
    if (e.distance_value) bits.push(`${Number(e.distance_value)} ${e.distance_unit ?? "mi"}`);
    if (e.duration_seconds) bits.push(formatDuration(e.duration_seconds));
    return bits.join(" · ") || "Done";
  }
  if (!e.score_display) return "Done";
  return e.is_rx === false ? `${e.score_display} · Scaled` : `${e.score_display} · Rx`;
}

export function entryTitle(e: LogEntry) {
  if (e.source === "activity") return activityLabel(e.activity_type, e.activity_name);
  return e.title || (e.source === "daily20" ? "The Daily 20" : "Workout");
}

export function entryHref(e: LogEntry): string | null {
  if (e.source === "library" && e.benchmark_slug) return `/workouts/${e.benchmark_slug}`;
  if (e.source === "daily20" && e.daily20_date) return `/daily-wod?date=${e.daily20_date}`;
  if (e.source === "builder" && e.builder_query) return `/wodbuilder?${e.builder_query}`;
  return null;
}

/** Best scored entry: fastest time, or most rounds then reps, or most reps. Unscored ones never count. */
export function bestEntry(entries: LogEntry[], kind: ScoreKind): LogEntry | null {
  let best: LogEntry | null = null;
  for (const e of entries) {
    if (kind === "time") {
      if (e.score_seconds == null) continue;
      if (!best || e.score_seconds < (best.score_seconds ?? Infinity)) best = e;
    } else if (kind === "rounds") {
      if (e.score_rounds == null) continue;
      const a = [Number(e.score_rounds), e.score_reps ?? 0];
      const b = best ? [Number(best.score_rounds), best.score_reps ?? 0] : null;
      if (!b || a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) best = e;
    } else {
      if (e.score_reps == null) continue;
      if (!best || e.score_reps > (best.score_reps ?? -1)) best = e;
    }
  }
  return best;
}

// Dates ------------------------------------------------------------------------------
// Days are plain "YYYY-MM-DD" strings in the person's own time zone.

export function localDay(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(day: string, n: number) {
  const [y, m, d] = day.split("-").map(Number);
  return localDay(new Date(y, m - 1, d + n));
}

/** Monday of the week the day is in. */
export function weekStart(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  const dow = (new Date(y, m - 1, d).getDay() + 6) % 7; // Monday = 0
  return addDays(day, -dow);
}

export function shortDate(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export type Consistency = {
  /** Weeks in a row with at least one logged day. This week counts once it has one. */
  weekStreak: number;
  /** Days in a row, ending today (or yesterday, so the morning doesn't read 0). */
  dayStreak: number;
  thisWeek: { day: string; logged: boolean; isToday: boolean; future: boolean }[];
  daysThisMonth: number;
  daysThisYear: number;
  totalEntries: number;
};

export function consistency(entries: LogEntry[], today = localDay()): Consistency {
  const days = new Set(entries.map((e) => e.date));
  const weeks = new Set([...days].map(weekStart));

  let week = weekStart(today);
  if (!weeks.has(week)) week = addDays(week, -7); // a new week isn't a break yet
  let weekStreak = 0;
  while (weeks.has(week)) {
    weekStreak++;
    week = addDays(week, -7);
  }

  let day = days.has(today) ? today : addDays(today, -1);
  let dayStreak = 0;
  while (days.has(day)) {
    dayStreak++;
    day = addDays(day, -1);
  }

  const monday = weekStart(today);
  const thisWeek = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    return { day: d, logged: days.has(d), isToday: d === today, future: d > today };
  });

  const month = today.slice(0, 7);
  const year = today.slice(0, 4);
  return {
    weekStreak,
    dayStreak,
    thisWeek,
    daysThisMonth: [...days].filter((d) => d.startsWith(month)).length,
    daysThisYear: [...days].filter((d) => d.startsWith(year)).length,
    totalEntries: entries.length,
  };
}
