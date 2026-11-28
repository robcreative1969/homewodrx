"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { field, FormError, label, primaryButton, secondaryButton } from "@/components/account/ui";
import { ACTIVITY_TYPES, activityLabel, localDay, parseDuration } from "@/lib/log";

/** Log something that isn't a workout on the site: a run, a walk, a ride, a game of pickleball. */
export function ActivityForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [type, setType] = useState<string>("run");
  const [name, setName] = useState("");
  const [distance, setDistance] = useState("");
  const [unit, setUnit] = useState<"mi" | "km">("mi");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(localDay());
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (type === "other" && !name.trim()) return setError("Say what you did, like Pickleball or Yoga.");
    let dist: number | null = null;
    if (distance.trim()) {
      dist = Number(distance);
      if (!Number.isFinite(dist) || dist <= 0 || dist >= 100000) return setError("Type the distance as a number, like 3 or 5.2.");
      dist = Math.round(dist * 100) / 100;
    }
    const seconds = time.trim() ? parseDuration(time) : null;
    if (time.trim() && !seconds) return setError("Type the time as minutes (45) or minutes and seconds (27:40).");
    if (!date || date > localDay()) return setError("Pick today or an earlier day.");

    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      setBusy(false);
      return setError("You've been logged out. Log in again, then try again.");
    }
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle();
    const { error: err } = await supabase.from("results").insert({
      user_id: userId,
      username: profile?.username ?? "",
      source: "activity",
      title: activityLabel(type, name.trim()),
      activity_type: type,
      activity_name: type === "other" ? name.trim().slice(0, 60) : null,
      distance_value: dist,
      distance_unit: dist ? unit : null,
      duration_seconds: seconds,
      notes: notes.trim() || null,
      date,
    });
    setBusy(false);
    if (err) return setError("That didn't save. Check your connection and try again.");
    onDone();
  }

  return (
    <form onSubmit={save} aria-labelledby="log-activity" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
      <h2 id="log-activity" className="m-0 text-lg font-bold">Log an activity</h2>

      <fieldset className="m-0 border-0 p-0">
        <legend className={`${label} mb-1.5`}>What you did</legend>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_TYPES.map((a) => (
            <label key={a.value} className={`flex h-11 cursor-pointer items-center rounded-xl border-[1.5px] px-4 font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink ${type === a.value ? "border-accent bg-accent text-accent-ink" : "border-chip-line bg-surface text-ink"}`}>
              <input type="radio" name="activity" value={a.value} checked={type === a.value} onChange={() => setType(a.value)} className="sr-only" />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      {type === "other" ? (
        <label className="flex flex-col gap-1.5">
          <span className={label}>Name</span>
          <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Pickleball, yoga, a hike with the kids" className={field} />
        </label>
      ) : null}

      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className={label}>Distance</span>
          <input inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value.replace(/[^\d.]/g, ""))} placeholder="Optional" className={field} />
        </label>
        <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
          <legend className={`${label} mb-1.5`}>Unit</legend>
          <div className="flex gap-1.5">
            {(["mi", "km"] as const).map((u) => (
              <label key={u} className={`flex h-12 w-14 cursor-pointer items-center justify-center rounded-xl border-[1.5px] font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink ${unit === u ? "border-accent bg-accent text-accent-ink" : "border-chip-line bg-surface text-ink"}`}>
                <input type="radio" name="unit" value={u} checked={unit === u} onChange={() => setUnit(u)} className="sr-only" />
                {u}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={label}>Time</span>
        <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Optional, like 45 or 27:40" className={field} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={label}>Date</span>
        <input type="date" max={localDay()} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={label}>Note</span>
        <textarea rows={2} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className={`${field} h-auto py-2.5`} />
      </label>

      <FormError>{error}</FormError>
      <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Saving…" : "Save activity"}</button>
      <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>
    </form>
  );
}
