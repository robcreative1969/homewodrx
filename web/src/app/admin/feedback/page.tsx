import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Feedback" };
export const dynamic = "force-dynamic";

type Item = { id: string; type: string | null; message: string | null; email: string | null; page_url: string | null; created_at: string };

export default async function FeedbackPage() {
  const { supabase, user } = await requireAdmin();
  const { data, error } = await supabase.from("feedback").select("id,type,message,email,page_url,created_at").order("created_at", { ascending: false }).limit(200);
  const items = (data ?? []) as Item[];

  return (
    <>
      <AdminNav current="/admin/feedback" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Feedback</h1>
        <p className="m-0 text-sm text-ink-2">Messages sent from the site&apos;s feedback form, newest first.</p>
      </div>
      {error ? <p className="m-0 text-sm font-semibold text-accent-text">Couldn&apos;t load feedback: {error.message}</p> : null}
      {!error && !items.length ? (
        <p className="m-0 rounded-2xl border border-dashed border-chip-line p-5 text-sm text-ink-2">
          No feedback yet{user.email !== "rob@carlbloom.com" ? ". (The database only shows feedback to rob@carlbloom.com; you're logged in as another account.)" : "."}
        </p>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((f) => (
          <li key={f.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {f.type ? <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ink-2">{f.type}</span> : null}
              <span className="text-ink-3">{new Date(f.created_at).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })}</span>
              {f.page_url ? <span className="min-w-0 truncate font-mono text-xs text-ink-3">{f.page_url.replace(/^https?:\/\/(www\.)?homewodrx\.com/, "")}</span> : null}
            </div>
            <p className="m-0 whitespace-pre-wrap">{f.message}</p>
            {f.email ? <p className="m-0 text-sm text-ink-2">From <span className="select-all font-semibold text-ink">{f.email}</span></p> : <p className="m-0 text-sm text-ink-3">No email left</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
