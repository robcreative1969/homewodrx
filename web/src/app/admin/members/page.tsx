import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Members" };
export const dynamic = "force-dynamic";

type Member = { id: string; username: string | null; first_name: string | null; last_name: string | null; created_at: string; last_seen: string | null; total_results: number | null; is_admin: boolean | null };
type Result = { id: string; username: string | null; benchmark_slug: string | null; workout_type: string | null; score_display: string | null; is_rx: boolean | null; date: string | null; created_at: string };

/** Counts of members active and new in the last 30 days. */
function recentCounts(list: Member[]) {
  const since = Date.now() - 30 * 86400000;
  return {
    active: list.filter((m) => m.last_seen && Date.parse(m.last_seen) > since).length,
    newer: list.filter((m) => Date.parse(m.created_at) > since).length,
  };
}

function when(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" }) : "—";
}

export default async function MembersPage() {
  const { supabase } = await requireAdmin();
  // Only the fields an admin needs to see. Health details on profiles are never shown here.
  const [{ data: members, count }, { data: results }] = await Promise.all([
    supabase.from("profiles").select("id,username,first_name,last_name,created_at,last_seen,total_results,is_admin", { count: "exact" }).order("created_at", { ascending: false }).limit(200),
    supabase.from("results").select("id,username,benchmark_slug,workout_type,score_display,is_rx,date,created_at").order("created_at", { ascending: false }).limit(25),
  ]);
  const list = (members ?? []) as Member[];
  const recent = (results ?? []) as Result[];
  const { active, newer } = recentCounts(list);

  return (
    <>
      <AdminNav current="/admin/members" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Members</h1>
        <p className="m-0 text-sm text-ink-2">Accounts on homewodrx.com. Sign-up is on hold on the new site; these are from the current site.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Members", count ?? list.length],
          ["Joined, 30 days", newer],
          ["Active, 30 days", active],
        ].map(([label, v]) => (
          <div key={String(label)} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4">
            <span className="text-[13px] font-semibold tracking-wide text-ink-3 uppercase">{label}</span>
            <span className="font-mono text-[28px] leading-none font-extrabold tabular-nums">{Number(v).toLocaleString("en-US")}</span>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-base font-bold">Newest members</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-ink-3">
                <th className="py-2 pr-3 font-semibold">Username</th>
                <th className="py-2 pr-3 font-semibold">Name</th>
                <th className="py-2 pr-3 font-semibold">Joined</th>
                <th className="py-2 pr-3 font-semibold">Last seen</th>
                <th className="py-2 text-right font-semibold">Results</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-t border-divider">
                  <td className="py-2 pr-3 font-semibold">{m.username ?? "—"}{m.is_admin ? <span className="ml-2 rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-bold text-ground">ADMIN</span> : null}</td>
                  <td className="py-2 pr-3">{[m.first_name, m.last_name].filter(Boolean).join(" ") || "—"}</td>
                  <td className="py-2 pr-3 tabular-nums">{when(m.created_at)}</td>
                  <td className="py-2 pr-3 tabular-nums">{when(m.last_seen)}</td>
                  <td className="py-2 text-right font-mono tabular-nums">{m.total_results ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-base font-bold">Recent results</h2>
        {recent.length ? (
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
            {recent.map((r) => (
              <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-2 border-t border-divider py-2 first:border-t-0">
                <span><b>{r.username ?? "Someone"}</b> · {r.benchmark_slug ?? r.workout_type ?? "workout"}</span>
                <span className="font-mono tabular-nums">{r.score_display ?? "—"}{r.is_rx ? " Rx" : ""} <span className="font-sans text-ink-3">{when(r.date ?? r.created_at)}</span></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-sm text-ink-3">No results logged yet.</p>
        )}
      </section>
    </>
  );
}
