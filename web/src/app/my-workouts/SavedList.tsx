"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { primaryButton, secondaryButton } from "@/components/account/ui";
import { shortDate } from "@/lib/log";
import { savedHref, type SavedListItem } from "@/lib/saved";

function detail(s: SavedListItem) {
  if (s.kind === "daily20") return shortDate(s.ref);
  if (s.kind === "builder") {
    return s.format_label && s.minutes ? `WOD Builder · ${s.format_label} · ${s.minutes} min` : "WOD Builder";
  }
  return "Workout library";
}

export function SavedList({ items: initial }: { items: SavedListItem[] }) {
  const [items, setItems] = useState(initial);
  const [removing, setRemoving] = useState<string | null>(null);

  async function remove(s: SavedListItem) {
    setRemoving(s.id);
    const { error } = await createClient().from("saved_workouts").delete().eq("id", s.id);
    setRemoving(null);
    if (error) return window.alert("That didn't remove. Check your connection and try again.");
    setItems((list) => list.filter((x) => x.id !== s.id));
  }

  if (!items.length) {
    return (
      <section aria-labelledby="none-saved" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
        <h2 id="none-saved" className="m-0 text-lg font-bold">Nothing saved yet</h2>
        <p className="m-0 text-[15px] text-ink-2">Tap Save on any workout, The Daily 20 or a WOD Builder workout to keep it here.</p>
        <div className="flex gap-2">
          <Link href="/workouts" className={primaryButton}>Workouts</Link>
          <Link href="/wodbuilder" className={secondaryButton}>WOD Builder</Link>
        </div>
      </section>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-surface px-[18px] py-1">
      {items.map((s, i) => (
        <li key={s.id} className={`flex items-center justify-between gap-3 py-3 ${i ? "border-t border-divider" : ""}`}>
          <Link href={savedHref(s)} className="flex min-w-0 flex-col text-ink no-underline">
            <span className="text-[17px] font-bold">{s.title}</span>
            <span className="text-sm text-ink-2">{detail(s)}</span>
          </Link>
          <button
            type="button"
            onClick={() => remove(s)}
            disabled={removing === s.id}
            className="flex h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-ink-2 disabled:opacity-50"
            aria-label={`Remove ${s.title}${s.kind === "daily20" ? `, ${shortDate(s.ref)}` : ""}`}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
