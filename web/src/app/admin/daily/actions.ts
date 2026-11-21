"use server";

import { revalidatePath, updateTag } from "next/cache";
import { LIBRARY_TAG } from "@/lib/supabase/public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { isDateString } from "@/lib/daily";

export type DailyState = { ok: boolean; message: string } | null;

const FORMATS = ["amrap", "emom", "fortime", "circuit", "tabata"];
const LEVELS = ["beginner", "intermediate", "advanced"];
const FOCUSES = ["full-body", "upper-body", "lower-body", "core", "cardio", "legs-glutes", "push", "pull"];

function refreshDaily() {
  updateTag(LIBRARY_TAG);
  revalidatePath("/");
  revalidatePath("/daily-wod");
  revalidatePath("/api/daily-20");
  revalidatePath("/admin/daily");
}

/** Saves a hand-picked workout for one date; it replaces the generated one on both sites and in the email. */
export async function saveOverride(_prev: DailyState, form: FormData): Promise<DailyState> {
  const { supabase } = await requireAdmin();
  const date = String(form.get("date") ?? "");
  if (!isDateString(date)) return { ok: false, message: "Pick a date." };
  const format = String(form.get("format") ?? "");
  if (!FORMATS.includes(format)) return { ok: false, message: "Pick a format." };
  let rows: { movement?: string; reps?: string; tip?: string }[] = [];
  try {
    rows = JSON.parse(String(form.get("rows") ?? "[]"));
  } catch {
    return { ok: false, message: "Couldn't read the movements. Reload and try again." };
  }
  rows = rows
    .map((r) => ({ movement: String(r.movement ?? "").trim(), reps: String(r.reps ?? "").trim(), tip: String(r.tip ?? "").trim() }))
    .filter((r) => r.movement);
  if (!rows.length) return { ok: false, message: "Add at least one movement." };
  const minutes = Number(form.get("minutes"));
  const rounds = Number(form.get("rounds"));
  const level = String(form.get("difficulty") ?? "");
  const focus = String(form.get("bodyFocus") ?? "");

  const workout_data = {
    title: String(form.get("title") ?? "").trim() || "The Daily 20",
    format,
    description: String(form.get("description") ?? "").trim(),
    scoring: String(form.get("scoring") ?? "").trim(),
    rows: rows.map((r) => ({ movement: r.movement, reps: r.reps, ...(r.tip ? { tip: r.tip } : {}) })),
    // Same shape the old admin saved, so the old site and the daily email read it too.
    duration: Number.isFinite(minutes) && minutes > 0 ? minutes : 20,
    ...(format === "fortime" ? { timeCap: Number.isFinite(minutes) && minutes > 0 ? minutes : 20 } : {}),
    isManual: true,
    ...(Number.isFinite(rounds) && rounds > 0 ? { rounds } : {}),
    ...(LEVELS.includes(level) ? { difficulty: level } : {}),
    ...(FOCUSES.includes(focus) ? { bodyFocus: focus } : {}),
  };
  const { error } = await supabase.from("daily_wods").upsert({ wod_date: date, workout_data, is_manual: true }, { onConflict: "wod_date" });
  if (error) return { ok: false, message: `Not saved: ${error.message}` };
  refreshDaily();
  return { ok: true, message: `Saved. ${date} now shows this workout on both sites and in that morning's email.` };
}

export async function deleteOverride(form: FormData) {
  const { supabase } = await requireAdmin();
  const date = String(form.get("date") ?? "");
  if (isDateString(date)) await supabase.from("daily_wods").delete().eq("wod_date", date);
  refreshDaily();
  redirect("/admin/daily");
}

/** Saves the weekly plan the generator follows. Keeps settings this page doesn't show (the old email reads some). */
export async function saveConfig(_prev: DailyState, form: FormData): Promise<DailyState> {
  const { supabase } = await requireAdmin();
  const { data: current } = await supabase.from("daily_wod_config").select("config").eq("id", 1).maybeSingle();
  const equipment = form.getAll("equipment").map(String);
  if (!equipment.includes("bodyweight")) equipment.unshift("bodyweight");
  const byDay = (prefix: string, allowed: string[]) => {
    const out: Record<string, string> = {};
    for (let d = 0; d < 7; d++) {
      const v = String(form.get(`${prefix}-${d}`) ?? "");
      if (!allowed.includes(v)) throw new Error(`Bad value for day ${d}`);
      out[String(d)] = v;
    }
    return out;
  };
  let config;
  try {
    config = {
      ...((current?.config as Record<string, unknown>) ?? {}),
      equipment,
      formatByDay: byDay("format", FORMATS),
      difficultyByDay: byDay("difficulty", LEVELS),
      bodyFocusByDay: byDay("focus", FOCUSES),
    };
  } catch {
    return { ok: false, message: "Every day needs a format, level and focus." };
  }
  const { error } = await supabase.from("daily_wod_config").upsert({ id: 1, config, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) return { ok: false, message: `Not saved: ${error.message}` };
  refreshDaily();
  return { ok: true, message: "Saved. Days without an override follow the new plan, on both sites." };
}
