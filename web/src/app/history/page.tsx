import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LOG_COLUMNS, type LogEntry } from "@/lib/log";
import { HistoryView } from "./HistoryView";

export const metadata: Metadata = { title: "History", robots: { index: false } };

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/history");
  // Results are private: the database only returns this person's own rows.
  const { data } = await supabase
    .from("results")
    .select(LOG_COLUMNS)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(2000);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-5 pb-28">
      <div>
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">History</h1>
        <p className="m-0 text-ink-2">Every workout and activity you&apos;ve logged.</p>
      </div>
      <HistoryView entries={(data as LogEntry[] | null) ?? []} />
    </div>
  );
}
