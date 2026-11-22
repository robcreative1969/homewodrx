// What the admin content editor can edit, and how each field is shown and saved.
// Field kinds:
//   text, textarea, url     plain strings
//   select                  one of a fixed list
//   lines                   a list edited one item per line; stored as `store` (text[] or jsonb)
//   rows                    a list of small records (movements, FAQs…), edited as a row of boxes
//                           each; stored as `store` (jsonb or JSON text)
//   reps                    a rep range typed as "6-8", "10" or "500m"; stored as a jsonb list
//   bool                    a checkbox

export type FieldKind = "text" | "textarea" | "url" | "number" | "select" | "lines" | "rows" | "reps" | "bool";
export type ItemField = { key: string; label: string; kind: "text" | "textarea" | "select"; options?: { value: string; label: string }[]; width?: "s" | "m" | "l" };
export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  help?: string;
  options?: { value: string; label: string }[];
  store?: "text[]" | "jsonb" | "jsontext";
  rows?: number;
  item?: ItemField[]; // for kind "rows"
  itemName?: string; // "movement", "question"… for the Add button
};

const MISTAKE: ItemField[] = [
  { key: "mistake", label: "Mistake", kind: "text", width: "l" },
  { key: "fix", label: "Fix", kind: "textarea", width: "l" },
];

export type ContentType = {
  type: "workouts" | "movements" | "machines" | "stretches";
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
  { value: "variation", label: "Variation (not official)" },
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
      { key: "movements", label: "Movements", kind: "rows", store: "jsonb", itemName: "movement", help: "In workout order. Rx weights are optional.", item: [
        { key: "name", label: "Movement", kind: "text", width: "m" },
        { key: "reps", label: "Reps", kind: "text", width: "s" },
        { key: "rx_men", label: "Rx men", kind: "text", width: "s" },
        { key: "rx_women", label: "Rx women", kind: "text", width: "s" },
        { key: "tip", label: "Tip", kind: "text", width: "l" },
      ] },
      { key: "scoring_notes", label: "Score line", kind: "textarea", rows: 2, help: 'Format: "Your score is your finish time. Sub-3 min is elite. Sub-5 min is strong."' },
      { key: "scaling_notes", label: "Scaling", kind: "textarea", rows: 4 },
      { key: "tips", label: "Tips", kind: "lines", store: "jsonb", help: "One tip per line" },
      { key: "coaching_tips", label: "Coaching tips", kind: "lines", store: "jsonb", help: "One tip per line" },
      { key: "faqs", label: "FAQs", kind: "rows", store: "jsonb", itemName: "question", item: [
        { key: "question", label: "Question", kind: "text", width: "l" },
        { key: "answer", label: "Answer", kind: "textarea", width: "l" },
      ] },
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
      { key: "scaling_options", label: "Scaling options", kind: "rows", store: "jsontext", itemName: "option", item: [
        { key: "level", label: "Level", kind: "select", width: "s", options: [{ value: "beginner", label: "Beginner" }, { value: "scaled", label: "Scaled" }, { value: "rx", label: "Rx" }] },
        { key: "movement", label: "Movement", kind: "text", width: "m" },
        { key: "notes", label: "Notes", kind: "text", width: "l" },
      ] },
      { key: "common_faults", label: "Common mistakes", kind: "rows", store: "jsontext", itemName: "mistake", item: MISTAKE },
      { key: "youtube_url", label: "Video", kind: "url" },
      { key: "daily_wod_eligible", label: "Use in the WOD Builder and Daily 20", kind: "bool" },
      { key: "tabata_suitable", label: "Suits Tabata", kind: "bool" },
      { key: "timed", label: "Timed (seconds, not reps)", kind: "bool" },
      { key: "warmup_eligible", label: "Use in warm-ups", kind: "bool" },
      { key: "beginner_reps", label: "Beginner reps", kind: "reps", help: 'A range like 6-8, one number like 10, or a distance or time like 500m or 30s' },
      { key: "intermediate_reps", label: "Intermediate reps", kind: "reps" },
      { key: "advanced_reps", label: "Advanced reps", kind: "reps" },
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
      { key: "common_mistakes", label: "Common mistakes", kind: "rows", store: "jsonb", itemName: "mistake", item: MISTAKE },
      { key: "safety_notes", label: "Safety", kind: "textarea", rows: 5, help: "Ends with the injury line" },
      { key: "muscle_groups", label: "Muscle groups", kind: "lines", store: "text[]", help: "One per line" },
      { key: "youtube_url", label: "Video", kind: "url" },
    ],
  },
  stretches: {
    type: "stretches",
    table: "stretches",
    label: "Stretches",
    singular: "stretch",
    publicPath: (s) => `/stretches/${s}`,
    fields: [
      { key: "name", label: "Name", kind: "text" },
      { key: "modality", label: "Type", kind: "select", options: [{ value: "static", label: "Static (hold)" }, { value: "dynamic", label: "Dynamic (moving)" }, { value: "pnf", label: "PNF" }, { value: "yoga", label: "Yoga" }] },
      { key: "focus", label: "Focus areas", kind: "lines", store: "text[]", help: "One per line: hips, hamstrings, quads, shoulders, back, chest, calves, wrists, full" },
      { key: "description", label: "Description", kind: "textarea", rows: 5 },
      { key: "cues", label: "How to do it", kind: "lines", store: "text[]", help: "One step per line" },
      { key: "tip", label: "Tip", kind: "text" },
      { key: "sides", label: "Do each side", kind: "bool" },
      { key: "hold_beginner", label: "Hold, beginner (seconds)", kind: "number", help: "Leave the holds empty for moving stretches; they show reps instead" },
      { key: "hold_intermediate", label: "Hold, intermediate (seconds)", kind: "number" },
      { key: "hold_advanced", label: "Hold, advanced (seconds)", kind: "number" },
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
  if (field.kind === "rows") {
    const v = typeof value === "string" ? safeParse(value) : value;
    return JSON.stringify(Array.isArray(v) ? v : []);
  }
  if (field.kind === "reps") {
    const v = typeof value === "string" ? safeParse(value) ?? value : value;
    if (Array.isArray(v)) return v.length === 2 && v.every((x) => typeof x === "number") ? `${v[0]}-${v[1]}` : v.map(String).join(", ");
    return String(v ?? "");
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
  if (field.kind === "rows") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(s || "[]");
    } catch {
      return { error: `${field.label}: couldn't read the rows. Reload the page and try again.` };
    }
    if (!Array.isArray(parsed)) return { error: `${field.label}: couldn't read the rows.` };
    // Drop rows left completely empty; keep every other key as it was.
    const keys = (field.item ?? []).map((i) => i.key);
    const rows = parsed
      .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
      .map((r) => Object.fromEntries(Object.entries(r).filter(([k, v]) => !(keys.includes(k) && (v === "" || v === null)))))
      .filter((r) => keys.some((k) => typeof r[k] === "string" && String(r[k]).trim()));
    return { value: field.store === "jsontext" ? JSON.stringify(rows) : rows };
  }
  if (field.kind === "reps") {
    const t = s.trim();
    if (!t) return { value: null };
    const range = t.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (range) return { value: [Number(range[1]), Number(range[2])] };
    if (/^\d+$/.test(t)) return { value: [Number(t)] };
    return { value: t.split(",").map((x) => x.trim()).filter(Boolean).map((x) => (/^\d+$/.test(x) ? Number(x) : x)) };
  }
  if (field.kind === "number") {
    if (!s.trim()) return { value: null };
    const n = Number(s);
    return Number.isFinite(n) && n >= 0 ? { value: Math.round(n) } : { error: `${field.label}: enter a number.` };
  }
  if (field.kind === "url" && s.trim() && !/^https:\/\//.test(s.trim())) return { error: `${field.label}: use a full https:// link.` };
  if (field.kind === "select" && s && !field.options?.some((o) => o.value === s)) return { error: `${field.label}: pick one of the options.` };
  return { value: s.trim() === "" ? null : s.trim() };
}
