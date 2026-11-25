import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { loadDayDetail, loadSiteStats, type Count, type Day, type DayDetail } from "@/lib/siteStats";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

function n(v: number) {
  return v.toLocaleString("en-US");
}

function fmtDay(key: string) {
  return new Date(`${key}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4">
      <span className="text-[13px] font-semibold tracking-wide text-ink-3 uppercase">{label}</span>
      <span className="font-mono text-[32px] leading-none font-extrabold tabular-nums">{value}</span>
      {note ? <span className="text-[13px] text-ink-3">{note}</span> : null}
    </div>
  );
}

/** Daily page views as bars, with unique visitors as a line. One scale for both. */
function DailyChart({ daily, range, selected }: { daily: Day[]; range: number; selected: string | null }) {
  const W = 720;
  const H = 180;
  const pad = { l: 36, r: 8, t: 10, b: 24 };
  const max = Math.max(4, ...daily.map((d) => d.views));
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const bw = (W - pad.l - pad.r) / daily.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / top);
  const line = daily.map((d, i) => `${i ? "L" : "M"}${pad.l + bw * i + bw / 2},${y(d.visitors)}`).join(" ");
  const labelEvery = Math.ceil(daily.length / 7);
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[520px]" role="img" aria-label="Page views and visitors per day">
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <line x1={pad.l} x2={W - pad.r} y1={y(step * k)} y2={y(step * k)} stroke="var(--divider)" strokeWidth="1" />
              <text x={pad.l - 6} y={y(step * k) + 4} textAnchor="end" fontSize="11" fill="var(--ink-3)" className="tabular-nums">{step * k}</text>
            </g>
          ))}
          {daily.map((d, i) => (
            <a key={d.day} href={selected === d.day ? `/admin?range=${range}` : `/admin?range=${range}&day=${d.day}#day`} aria-label={`${fmtDay(d.day)}: ${d.views} views, ${d.visitors} visitors. Show the day's activity`}>
              <title>{`${fmtDay(d.day)}: ${d.views} views, ${d.visitors} visitors. Click for details`}</title>
              <rect x={pad.l + bw * i} y={pad.t} width={bw} height={y(0) - pad.t} fill={selected === d.day ? "var(--divider)" : "transparent"} opacity="0.6" className="cursor-pointer" />
              <rect x={pad.l + bw * i + bw * 0.15} y={y(d.views)} width={bw * 0.7} height={Math.max(0, y(0) - y(d.views))} rx="2" fill="var(--accent)" opacity={selected && selected !== d.day ? "0.45" : "0.85"} className="cursor-pointer" />
            </a>
          ))}
          <path d={line} fill="none" stroke="var(--ink)" strokeWidth="2" pointerEvents="none" />
          {daily.map((d, i) =>
            i % labelEvery === 0 || i === daily.length - 1 ? (
              <text key={d.day} x={pad.l + bw * i + bw / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--ink-3)">{fmtDay(d.day)}</text>
            ) : null,
          )}
        </svg>
      </div>
      <figcaption className="flex gap-4 text-[13px] text-ink-2">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />Page views</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-3.5 bg-ink" />Visitors</span>
        <span className="ml-auto text-ink-3">Click a day for its activity</span>
      </figcaption>
    </figure>
  );
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
}

/** One day's activity: totals, views by hour, the breakdowns and each visitor's path. */
function DayPanel({ detail, range }: { detail: DayDetail; range: number }) {
  const label = new Date(`${detail.day}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const maxHour = Math.max(1, ...detail.hourly);
  return (
    <section id="day" className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border-2 border-accent bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-xl font-extrabold">{label}</h2>
        <Link href={`/admin?range=${range}`} className="text-sm font-semibold text-ink">Close</Link>
      </div>
      <p className="m-0 text-sm text-ink-2">
        <b className="font-mono tabular-nums text-ink">{n(detail.visitors)}</b> visitors · <b className="font-mono tabular-nums text-ink">{n(detail.views)}</b> page views · <b className="font-mono tabular-nums text-ink">{n(detail.searches.reduce((a, s) => a + s.count, 0))}</b> searches. Times are US Eastern.
      </p>
      <figure className="m-0 flex flex-col gap-1">
        <div className="flex h-24 items-end gap-[3px]" role="img" aria-label="Page views by hour">
          {detail.hourly.map((v, h) => (
            <span key={h} title={`${h % 12 || 12} ${h < 12 ? "AM" : "PM"}: ${v} views`} className="flex-1 rounded-t-sm bg-accent" style={{ height: `${Math.max(v ? 4 : 1, (v / maxHour) * 100)}%`, opacity: v ? 0.85 : 0.2 }} />
          ))}
        </div>
        <figcaption className="flex justify-between text-[11px] text-ink-3"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></figcaption>
      </figure>
      <div className="grid gap-3 md:grid-cols-2">
        <List title="Pages" rows={detail.pages} empty="No page views." href={(p) => p} />
        <List title="Where visitors came from" rows={detail.referrers} empty="No visitors." />
        <List title="Countries" rows={detail.countries} empty="No visitors." />
        <List title="Devices" rows={detail.devices} empty="No visitors." />
        {detail.searches.length ? <List title="Searches" rows={detail.searches} empty="" href={(q) => `/search?q=${encodeURIComponent(q)}`} /> : null}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-base font-bold">Visitors, in order of arrival</h3>
        {detail.journeys.length ? (
          <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
            {detail.journeys.map((j) => (
              <li key={j.visitor}>
                <details className="rounded-lg border border-line px-3 py-2 text-sm">
                  <summary className="cursor-pointer">
                    <span className="font-mono font-bold tabular-nums">{fmtTime(j.first)}</span> · {j.referrer} · {j.country} · <span className="capitalize">{j.device}</span> · {j.pages.length} {j.pages.length === 1 ? "page" : "pages"}
                  </summary>
                  <ol className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
                    {j.pages.map((pg, k) => (
                      <li key={k} className="flex gap-3">
                        <span className="w-[72px] shrink-0 font-mono text-ink-3 tabular-nums">{fmtTime(pg.at)}</span>
                        <Link href={pg.path} className="min-w-0 truncate text-ink">{pg.path}</Link>
                      </li>
                    ))}
                  </ol>
                </details>
              </li>
            ))}
          </ol>
        ) : (
          <p className="m-0 text-sm text-ink-3">No visitors on this day.</p>
        )}
      </div>
    </section>
  );
}

function List({ title, rows, empty, href }: { title: string; rows: Count[]; empty: string; href?: (label: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
      <h2 className="m-0 text-base font-bold">{title}</h2>
      {rows.length ? (
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {rows.map((r) => (
            <li key={r.label} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-2.5 py-1.5 text-sm">
              <span className="absolute inset-y-0 left-0 bg-surface-muted" style={{ width: `${(r.count / max) * 100}%` }} aria-hidden="true" />
              <span className="relative min-w-0 truncate">
                {href ? <Link href={href(r.label)} className="text-ink">{r.label}</Link> : r.label}
              </span>
              <span className="relative font-mono font-bold tabular-nums">{n(r.count)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="m-0 text-sm text-ink-3">{empty}</p>
      )}
    </section>
  );
}

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  const { supabase } = await requireAdmin();
  const { range, day } = await searchParams;
  const days = RANGES.find((r) => String(r) === range) ?? 30;
  const pickedDay = typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
  const [stats, workouts, movements, machines, stretches, names] = await Promise.all([
    loadSiteStats(supabase, days),
    supabase.from("benchmark_workouts").select("id", { count: "exact", head: true }),
    supabase.from("movements").select("id", { count: "exact", head: true }),
    supabase.from("machines").select("id", { count: "exact", head: true }),
    supabase.from("stretches").select("id", { count: "exact", head: true }),
    supabase.from("benchmark_workouts").select("slug,name"),
  ]);
  const detail = pickedDay ? await loadDayDetail(supabase, pickedDay) : null;
  const workoutName = new Map((names.data ?? []).map((w) => [w.slug, w.name]));
  const topWorkouts = stats.workouts.map((w) => ({ label: workoutName.get(w.label) ?? w.label, count: w.count, slug: w.label }));
  const totalDevices = stats.devices.reduce((a, d) => a + d.count, 0) || 1;
  const since = stats.since ? new Date(stats.since).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }) : null;

  return (
    <>
      <AdminNav current="/admin" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Dashboard</h1>
          <p className="m-0 text-sm text-ink-2">
            Visitors to homewodrx.com{since ? `, recorded since ${since}` : ""}, from the site&apos;s own cookie-free counter; each visitor is counted once per day. Google Analytics has its own reports.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-surface-muted p-1" role="group" aria-label="Time range">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin?range=${r}`}
              aria-current={r === days ? "true" : undefined}
              className="flex h-9 items-center rounded-lg px-3 font-mono text-sm font-bold text-ink no-underline aria-[current=true]:bg-ink aria-[current=true]:text-ground"
            >
              {r} days
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Visitors today" value={n(stats.today.visits)} note={`${n(stats.today.views)} page views`} />
        <Stat label={`Visitors, ${days} days`} value={n(stats.visits)} note="added up day by day" />
        <Stat label={`Page views, ${days} days`} value={n(stats.views)} />
        <Stat label="Site searches" value={n(stats.searchCount)} note={(() => { const none = stats.emptySearches.reduce((a, s) => a + s.count, 0); return stats.searchCount === 0 ? "None yet" : none === 0 ? "All found results" : `${n(none)} found nothing`; })()} />
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-base font-bold">Per day</h2>
        {stats.views ? <DailyChart daily={stats.daily} range={days} selected={pickedDay} /> : <p className="m-0 text-sm text-ink-3">No visits recorded in this period yet. The chart fills in as people visit homewodrx.com.</p>}
      </section>

      {detail ? <DayPanel detail={detail} range={days} /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <List title="Top pages" rows={stats.pages} empty="No page views yet." href={(p) => p} />
        <List title="Top workouts" rows={topWorkouts} empty="No workout pages viewed yet." href={(name) => `/workouts/${topWorkouts.find((w) => w.label === name)?.slug ?? ""}`} />
        <List title="Where visitors come from" rows={stats.referrers} empty="No visitors yet." />
        <section className="flex min-w-0 flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
          <h2 className="m-0 text-base font-bold">Devices</h2>
          {stats.devices.length ? (
            <>
              <div className="flex h-3 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                {stats.devices.map((d, i) => (
                  <span key={d.label} className={i === 0 ? "bg-accent" : i === 1 ? "bg-ink" : "bg-ink-3"} style={{ width: `${(d.count / totalDevices) * 100}%` }} />
                ))}
              </div>
              <ul className="m-0 flex list-none flex-wrap gap-4 p-0 text-sm">
                {stats.devices.map((d) => (
                  <li key={d.label} className="capitalize">{d.label} <b className="font-mono tabular-nums">{Math.round((d.count / totalDevices) * 100)}%</b></li>
                ))}
              </ul>
            </>
          ) : (
            <p className="m-0 text-sm text-ink-3">No visitors yet.</p>
          )}
          <h2 className="m-0 mt-2 text-base font-bold">Countries</h2>
          {stats.countries.length ? (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0 text-sm">
              {stats.countries.map((c) => (
                <li key={c.label} className="rounded-full border border-line px-2.5 py-0.5">{c.label} <b className="font-mono tabular-nums">{n(c.count)}</b></li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-sm text-ink-3">No visitors yet.</p>
          )}
        </section>
        <List title="What people search for" rows={stats.searches} empty="No site searches yet." href={(q) => `/search?q=${encodeURIComponent(q)}`} />
        <List title="Searches that found nothing" rows={stats.emptySearches} empty="None yet. These show content worth adding." />
      </div>

      <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-base font-bold">Library</h2>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 text-sm">
          <li><b className="font-mono tabular-nums">{n(workouts.count ?? 0)}</b> workouts</li>
          <li><b className="font-mono tabular-nums">{n(movements.count ?? 0)}</b> movements</li>
          <li><b className="font-mono tabular-nums">{n(machines.count ?? 0)}</b> machines</li>
          <li><b className="font-mono tabular-nums">{n(stretches.count ?? 0)}</b> stretches</li>
        </ul>
      </section>
    </>
  );
}
