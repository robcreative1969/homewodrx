import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SAVED_LIST_COLUMNS, type SavedListItem } from "@/lib/saved";
import { SavedList } from "./SavedList";

export const metadata: Metadata = { title: "Your workouts", robots: { index: false } };

export default async function MyWorkoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-workouts");
  // Saves are private: the database only returns this person's own rows.
  const { data } = await supabase
    .from("saved_workouts")
    .select(SAVED_LIST_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-5 pb-28">
      <div>
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Your workouts</h1>
        <p className="m-0 text-ink-2">Workouts you&apos;ve saved, newest first.</p>
      </div>
      <SavedList items={(data as SavedListItem[] | null) ?? []} />
    </div>
  );
}
