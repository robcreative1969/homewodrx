// What the admin content editor can edit, and how each field is shown and saved.
// Field kinds:
//   text, textarea, url     plain strings
//   select                  one of a fixed list
//   lines                   a list edited one item per line; stored as `store` (text[] or jsonb)
//   json                    JSON edited as text and checked before saving; stored as `store`
//   bool                    a checkbox

export type FieldKind = "text" | "textarea" | "url" | "select" | "lines" | "json" | "bool";
export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  help?: string;
  options?: { value: string; label: string }[];
  store?: "text[]" | "jsonb" | "jsontext";
  rows?: number;
};

export type ContentType = {
  type: "workouts" | "movements" | "machines";
  table: string;
  label: string;
  singular: string;
  publicPath: (slug: string) => string;
  fields: Field[];
};

const WORKOUT_CATEGORIES = [
  { value: "classic_benchmark", label: "Classic benchmark" },
  { value: "hero", label: "Hero WOD" },
  { value: "competition", label: "Competition / Open" },
  { value: "memorial", label: "Memorial" },
];

export const CONTENT_TYPES: Record<string, ContentType> = {
  workouts: {
    type: "workouts",
    table: "benchmark_workouts",
    label: "Workouts",
    singular: "workout",
    publicPath: (s) => `/workouts/${s}`,
    fields: [
      { key: "name", label: "Name", kind: "text" },
      { key: "category", label: "Category", kind: "select", options: WORKOUT_CATEGORIES },
      { key: "scheme", label: "Scheme", kind: "text", help: "The short line under the name, e.g. 21-15-9 For Time" },
      { key: "format", label: "Format", kind: "text", help: "For Time, AMRAP, EMOM…" },
      { key: "duration_estimate", label: "Typical time", kind: "text", help: "e.g. 2–8 min" },
      { key: "difficulty", label: "Difficulty", kind: "select", options: [{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }] },
      { key: "description", label: "About", kind: "textarea", rows: 6 },
      { key: "movements", label: "Movements", kind: "json", store: "jsonb", rows: 10, help: 'A list like [{"name":"Thrusters","reps":"21-15-9","rx_men":"95 lb","rx_women":"65 lb","tip":"…"}]' },
      { key: "scoring_notes", label: "Score line", kind: "textarea", rows: 2, help: 'Format: "Your score is your finish time. Sub-3 min is elite. Sub-5 min is strong."' },
      { key: "scaling_notes", label: "Scaling", kind: "textarea", rows: 4 },
      { key: "tips", label: "Tips", kind: "lines", store: "jsonb", help: "One tip per line" },
      { key: "coaching_tips", label: "Coaching tips", kind: "lines", store: "jsonb", help: "One tip per line" },
      { key: "faqs", label: "FAQs", kind: "json", store: "jsonb", rows: 10, help: 'A list like [{"question":"…","answer":"…"}]' },
      { key: "equipment", label: "Equipment", kind: "lines", store: "text[]", help: "One per line, e.g. barbell" },
      { key: "youtube_url", label: "Video", kind: "url", help: "YouTube link" },
    ],
  },
  movements: {
    type: "movements",
    table: "movements",
    label: "Movements",
    singular: "movement",
    publicPath: (s) => `/movements/${s}`,
    fields: [
      { key: "name", label: "Name", kind: "text" },
      { key: "category", label: "Category", kind: "text" },
      { key: "equipment_category", label: "Equipment group", kind: "text", help: "Used by the WOD Builder, e.g. kettlebell, dumbbells, bodyweight" },
      { key: "description", label: "Description", kind: "textarea", rows: 5 },
      { key: "muscles", label: "Muscles (sentence)", kind: "text" },
      { key: "muscle_groups", label: "Muscle groups", kind: "lines", store: "text[]", help: "One per line: glutes, hamstrings, quads, calves, inner-thighs, core, back, chest, shoulders, arms" },
      { key: "tips", label: "Coaching cues", kind: "lines", store: "jsonb", help: "One full sentence per line" },
      { key: "wod_tip", label: "WOD tip", kind: "text", help: "The one-line tip shown in built workouts" },
      { key: "scaling_options", label: "Scaling options", kind: "json", store: "jsontext", rows: 8, help: '[{"level":"beginner","movement":"…","notes":"…"}]' },
      { key: "common_faults", label: "Common mistakes", kind: "json", store: "jsontext", rows: 8, help: '[{"mistake":"…","fix":"…"}]' },
      { key: "youtube_url", label: "Video", kind: "url" },
      { key: "daily_wod_eligible", label: "Use in the WOD Builder and Daily 20", kind: "bool" },
      { key: "tabata_suitable", label: "Suits Tabata", kind: "bool" },
      { key: "timed", label: "Timed (seconds, not reps)", kind: "bool" },
      { key: "warmup_eligible", label: "Use in warm-ups", kind: "bool" },
      { key: "beginner_reps", label: "Beginner reps", kind: "json", store: "jsonb", rows: 1, help: "e.g. [6,8] or [\"500m\"]" },
      { key: "intermediate_reps", label: "Intermediate reps", kind: "json", store: "jsonb", rows: 1 },
      { key: "advanced_reps", label: "Advanced reps", kind: "json", store: "jsonb", rows: 1 },
    ],
  },
  machines: {
    type: "machines",
    table: "machines",
    label: "Machines",
    singular: "machine",
    publicPath: (s) => `/machines/${s}`,
    fields: [
      { key: "name", label: "Name", kind: "text" },
      { key: "overview", label: "Overview", kind: "textarea", rows: 6 },
      { key: "setup_notes", label: "Set it up", kind: "textarea", rows: 5 },
      { key: "common_mistakes", label: "Common mistakes", kind: "json", store: "jsonb", rows: 8, help: '[{"mistake":"…","fix":"…"}]' },
      { key: "safety_notes", label: "Safety", kind: "textarea", rows: 5, help: "Ends with the injury line" },
      { key: "muscle_groups", label: "Muscle groups", kind: "lines", store: "text[]", help: "One per line" },
      { key: "youtube_url", label: "Video", kind: "url" },
    ],
  },
};

/** The value as the form shows it. */
export function toFormValue(field: Field, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.kind === "lines") {
    const arr = typeof value === "string" ? safeParse(value) : value;
    return Array.isArray(arr) ? arr.map(String).join("\n") : String(value);
  }
  if (field.kind === "json") {
    const v = typeof value === "string" ? safeParse(value) ?? value : value;
    return typeof v === "string" ? v : JSON.stringify(v, null, 2);
  }
  return String(value);
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/** Turns submitted form text back into the stored value, or an error message. */
export function fromFormValue(field: Field, raw: FormDataEntryValue | null): { value: unknown } | { error: string } {
  if (field.kind === "bool") return { value: raw === "on" };
  const s = typeof raw === "string" ? raw.replace(/\r\n/g, "\n") : "";
  if (field.kind === "lines") {
    const items = s.split("\n").map((l) => l.trim()).filter(Boolean);
    return { value: items };
  }
  if (field.kind === "json") {
    if (!s.trim()) return { value: null };
    try {
      const parsed = JSON.parse(s);
      return { value: field.store === "jsontext" ? JSON.stringify(parsed) : parsed };
    } catch (e) {
      return { error: `${field.label}: that isn't valid JSON (${(e as Error).message}).` };
    }
  }
  if (field.kind === "url" && s.trim() && !/^https:\/\//.test(s.trim())) return { error: `${field.label}: use a full https:// link.` };
  if (field.kind === "select" && s && !field.options?.some((o) => o.value === s)) return { error: `${field.label}: pick one of the options.` };
  return { value: s.trim() === "" ? null : s.trim() };
}
