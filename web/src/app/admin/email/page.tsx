import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { listPosts } from "@/lib/blog";
import { BroadcastForm } from "./BroadcastForm";

export const metadata: Metadata = { title: "Email" };
export const dynamic = "force-dynamic";

type Subscriber = { id: string; email: string; source: string | null; subscribed_at: string };

export default async function EmailPage() {
  const { supabase } = await requireAdmin();
  const [subs, members] = await Promise.all([
    supabase.from("email_subscribers").select("id,email,source,subscribed_at", { count: "exact" }).order("subscribed_at", { ascending: false }).limit(100),
    supabase.from("profiles").select("notifications").not("notifications", "is", null),
  ]);
  const list = (subs.data ?? []) as Subscriber[];
  const prefs = (members.data ?? []).map((m) => (m.notifications ?? {}) as Record<string, boolean>);
  const recipients = {
    blog: prefs.filter((n) => n.blog === true || n.content === true).length,
    product: prefs.filter((n) => n.product === true).length,
  };
  const posts = listPosts().map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt }));

  return (
    <>
      <AdminNav current="/admin/email" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Email</h1>
        <p className="m-0 text-sm text-ink-2">
          Announcements and blog emails go to members who opted in. The Daily 20 email goes out by itself every morning at 6:00 AM Eastern.
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-lg font-bold">Send an email</h2>
        <BroadcastForm posts={posts} recipients={recipients} />
      </section>

      <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="m-0 text-lg font-bold">Email sign-ups</h2>
          <span className="font-mono text-sm font-bold tabular-nums">{(subs.count ?? list.length).toLocaleString("en-US")}</span>
        </div>
        {subs.error ? (
          <p className="m-0 text-sm text-ink-3">The sign-up list isn&apos;t readable from the admin yet.</p>
        ) : list.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-ink-3">
                  <th className="py-2 pr-3 font-semibold">Email</th>
                  <th className="py-2 pr-3 font-semibold">From</th>
                  <th className="py-2 font-semibold">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id} className="border-t border-divider">
                    <td className="py-2 pr-3 select-all">{s.email}</td>
                    <td className="py-2 pr-3 text-ink-2">{s.source ?? "—"}</td>
                    <td className="py-2 tabular-nums">{new Date(s.subscribed_at).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="m-0 text-sm text-ink-3">No sign-ups yet.</p>
        )}
      </section>
    </>
  );
}
