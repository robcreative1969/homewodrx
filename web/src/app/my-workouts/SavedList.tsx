"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { field, FormError, primaryButton, secondaryButton } from "@/components/account/ui";
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
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);

  async function rename() {
    if (!editing) return;
    const title = editing.name.trim().slice(0, 120);
    if (!title) return setRenameError("Type a name.");
    setSaving(true);
    setRenameError(null);
    const { error } = await createClient().from("saved_workouts").update({ title }).eq("id", editing.id);
    setSaving(false);
    if (error) return setRenameError("That didn't save. Check your connection and try again.");
    setItems((list) => list.map((x) => (x.id === editing.id ? { ...x, title } : x)));
    setEditing(null);
  }

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
        <h2 id="none-saved" className="m-0 text-lg font-bold">
          Nothing saved yet
        </h2>
        <p className="m-0 text-[15px] text-ink-2">Tap Save on any workout, The Daily 20 or a WOD Builder workout to keep it here.</p>
        <div className="flex gap-2">
          <Link href="/workouts" className={primaryButton}>
            Workouts
          </Link>
          <Link href="/wodbuilder" className={secondaryButton}>
            WOD Builder
          </Link>
        </div>
      </section>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-surface px-[18px] py-1">
      {items.map((s, i) => (
        <li key={s.id} className={`flex items-center justify-between gap-3 py-3 ${i ? "border-t border-divider" : ""}`}>
          {editing?.id === s.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                rename();
              }}
              className="flex w-full flex-col gap-2"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink-2">Name</span>
                <input autoFocus maxLength={120} value={editing.name} onChange={(e) => setEditing({ id: s.id, name: e.target.value })} className={field} />
              </label>
              <FormError>{renameError}</FormError>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className={primaryButton}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className={secondaryButton}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <Link href={savedHref(s)} className="flex min-w-0 flex-col text-ink no-underline">
                <span className="text-[17px] font-bold">{s.title}</span>
                <span className="text-sm text-ink-2">{detail(s)}</span>
              </Link>
              <span className="flex shrink-0">
                {s.kind === "builder" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setRenameError(null);
                      setEditing({ id: s.id, name: s.title });
                    }}
                    className="flex h-11 items-center rounded-xl px-2 text-sm font-semibold text-ink-2"
                    aria-label={`Rename ${s.title}`}
                  >
                    Rename
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(s)}
                  disabled={removing === s.id}
                  className="flex h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-ink-2 disabled:opacity-50"
                  aria-label={`Remove ${s.title}${s.kind === "daily20" ? `, ${shortDate(s.ref)}` : ""}`}
                >
                  Remove
                </button>
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
