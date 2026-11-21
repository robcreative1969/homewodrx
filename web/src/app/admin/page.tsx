import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { loadSiteStats, type Count, type Day } from "@/lib/siteStats";

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
function DailyChart({ daily }: { daily: Day[] }) {
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
            <rect key={d.day} x={pad.l + bw * i + bw * 0.15} y={y(d.views)} width={bw * 0.7} height={Math.max(0, y(0) - y(d.views))} rx="2" fill="var(--accent)" opacity="0.85">
              <title>{`${fmtDay(d.day)}: ${d.views} views, ${d.visitors} visitors`}</title>
            </rect>
          ))}
          <path d={line} fill="none" stroke="var(--ink)" strokeWidth="2" />
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
      </figcaption>
    </figure>
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
  const { range } = await searchParams;
  const days = RANGES.find((r) => String(r) === range) ?? 30;
  const [stats, workouts, movements, machines, stretches] = await Promise.all([
    loadSiteStats(supabase, days),
    supabase.from("benchmark_workouts").select("id", { count: "exact", head: true }),
    supabase.from("movements").select("id", { count: "exact", head: true }),
    supabase.from("machines").select("id", { count: "exact", head: true }),
    supabase.from("stretches").select("id", { count: "exact", head: true }),
  ]);
  const totalDevices = stats.devices.reduce((a, d) => a + d.count, 0) || 1;
  const since = stats.since ? new Date(stats.since).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;

  return (
    <>
      <AdminNav current="/admin" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Dashboard</h1>
          <p className="m-0 text-sm text-ink-2">
            Visitors to homewodrx.com{since ? `, recorded since ${since}` : ""}. No cookies; each visitor is counted once per day.
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
        <Stat label="Site searches" value={n(stats.searchCount)} note={`${n(stats.emptySearches.reduce((a, s) => a + s.count, 0))} found nothing`} />
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-base font-bold">Per day</h2>
        {stats.views ? <DailyChart daily={stats.daily} /> : <p className="m-0 text-sm text-ink-3">No visits recorded in this period yet. The chart fills in as people visit homewodrx.com.</p>}
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <List title="Top pages" rows={stats.pages} empty="No page views yet." href={(p) => p} />
        <List title="Top workouts" rows={stats.workouts} empty="No workout pages viewed yet." href={(s) => `/workouts/${s}`} />
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
