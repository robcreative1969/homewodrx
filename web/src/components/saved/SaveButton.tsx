"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { field, primaryButton, secondaryButton } from "@/components/account/ui";
import { saveRef, saveTitle, type SaveTarget } from "@/lib/saved";

const pill = "inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3 text-sm font-semibold no-underline disabled:cursor-default disabled:opacity-60";
const off = `${pill} border-chip-line bg-surface text-ink`;
const on = `${pill} border-ink bg-ink text-ground`;

function Icon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4z" />
    </svg>
  );
}

function backHref(t: SaveTarget) {
  if (t.kind === "library") return `/workouts/${t.slug}`;
  if (t.kind === "daily20") return `/daily-wod?date=${t.date}`;
  return `/wodbuilder?${t.query}`;
}

/**
 * Save / Saved toggle for a workout. Reads the session in the browser, so the page
 * around it stays cached. Signed out, it goes to sign up and comes back here.
 */
export function SaveButton({ target }: { target: SaveTarget }) {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  // WOD Builder saves ask for a name first; null = the name field is closed.
  const [name, setName] = useState<string | null>(null);
  const ref = saveRef(target);

  useEffect(() => {
    let live = true;
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id ?? null;
      if (!live) return;
      setUserId(uid);
      if (!uid) return;
      const { data: row } = await supabase.from("saved_workouts").select("id").eq("user_id", uid).eq("kind", target.kind).eq("ref", ref).maybeSingle();
      if (live) setSavedId(row?.id ?? null);
    });
    return () => {
      live = false;
    };
  }, [target.kind, ref]);

  function tap() {
    if (target.kind === "builder" && !savedId) setName((n) => (n === null ? saveTitle(target) : null));
    else toggle();
  }

  async function toggle(title = saveTitle(target)) {
    if (!userId || busy) return;
    setBusy(true);
    setError(false);
    const supabase = createClient();
    if (savedId) {
      const { error: err } = await supabase.from("saved_workouts").delete().eq("id", savedId);
      if (err) setError(true);
      else setSavedId(null);
    } else {
      const { data, error: err } = await supabase
        .from("saved_workouts")
        .insert({
          user_id: userId,
          kind: target.kind,
          ref,
          title: title.trim().slice(0, 120) || saveTitle(target),
          workout: target.kind === "builder" ? target.workout : null,
        })
        .select("id")
        .single();
      if (err) setError(true);
      else {
        setSavedId(data.id);
        setName(null);
      }
    }
    setBusy(false);
  }

  if (userId === undefined) {
    return (
      <span className={off} aria-hidden="true">
        <Icon filled={false} />
        Save
      </span>
    );
  }

  if (userId === null) {
    return (
      <Link href={`/signup?next=${encodeURIComponent(backHref(target))}`} className={off}>
        <Icon filled={false} />
        Save
      </Link>
    );
  }

  const button = (
    <button
      type="button"
      onClick={tap}
      disabled={busy}
      aria-pressed={Boolean(savedId)}
      aria-expanded={target.kind === "builder" && !savedId ? name !== null : undefined}
      className={savedId ? on : off}
    >
      <Icon filled={Boolean(savedId)} />
      <span aria-live="polite">{error ? "Try again" : savedId ? "Saved" : "Save"}</span>
    </button>
  );

  if (name === null) return button;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toggle(name);
      }}
      className="flex w-full flex-col gap-2"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink-2">Name</span>
        <input autoFocus maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? "Saving…" : error ? "Try again" : "Save"}
        </button>
        <button type="button" onClick={() => setName(null)} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
