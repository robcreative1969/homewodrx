"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Remove a saved WOD Builder workout from its own page, then go back to the list. */
export function RemoveSaved({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm("Remove this workout from Your workouts?")) return;
    setBusy(true);
    const { error } = await createClient().from("saved_workouts").delete().eq("id", id);
    if (error) {
      setBusy(false);
      return window.alert("That didn't remove. Check your connection and try again.");
    }
    router.replace("/my-workouts");
    router.refresh();
  }

  return (
    <div className="flex">
      <button type="button" onClick={remove} disabled={busy} className="flex min-h-11 items-center rounded-xl px-2 text-sm font-semibold text-ink-2 disabled:opacity-50">
        {busy ? "Removing…" : "Remove from Your workouts"}
      </button>
    </div>
  );
}
