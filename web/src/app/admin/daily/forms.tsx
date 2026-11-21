"use client";

import { useActionState } from "react";
import { RowsEditor } from "@/app/admin/content/[type]/[slug]/RowsEditor";
import { saveConfig, saveOverride, type DailyState } from "./actions";

const input = "w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 py-2.5 text-base text-ink";
const label = "text-sm font-bold";

export const FORMAT_OPTIONS = [
  { value: "amrap", label: "AMRAP" },
  { value: "emom", label: "EMOM" },
  { value: "fortime", label: "For Time" },
  { value: "circuit", label: "Circuit" },
  { value: "tabata", label: "Tabata" },
];
export const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
export const FOCUS_OPTIONS = [
  { value: "full-body", label: "Full Body" },
  { value: "upper-body", label: "Upper Body" },
  { value: "lower-body", label: "Lower Body" },
  { value: "legs-glutes", label: "Legs and Glutes" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Conditioning" },
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
];

function Status({ state, idle }: { state: DailyState; idle: string }) {
  return state ? (
    <p role="status" className={`m-0 text-sm font-semibold ${state.ok ? "text-ink" : "text-accent-text"}`}>{state.message}</p>
  ) : (
    <p className="m-0 text-sm text-ink-3">{idle}</p>
  );
}

export type OverrideValues = {
  date: string;
  title: string;
  format: string;
  minutes: string;
  rounds: string;
  difficulty: string;
  bodyFocus: string;
  description: string;
  scoring: string;
  rows: string; // JSON list of {movement, reps, tip}
};

export function OverrideForm({ values, hasOverride }: { values: OverrideValues; hasOverride: boolean }) {
  const [state, action, pending] = useActionState<DailyState, FormData>(saveOverride, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="o-date" className={label}>Date</label>
          <input id="o-date" name="date" type="date" defaultValue={values.date} required className={`${input} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="o-title" className={label}>Title</label>
          <input id="o-title" name="title" type="text" defaultValue={values.title} placeholder="The Daily 20" className={`${input} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="o-format" className={label}>Format</label>
          <select id="o-format" name="format" defaultValue={values.format} className={`${input} h-12`}>
            {FORMAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="o-minutes" className={label}>Minutes</label>
          <input id="o-minutes" name="minutes" type="number" min="1" max="90" defaultValue={values.minutes} className={`${input} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="o-rounds" className={label}>Rounds <span className="font-normal text-ink-3">(For Time, Circuit)</span></label>
          <input id="o-rounds" name="rounds" type="number" min="1" max="20" defaultValue={values.rounds} className={`${input} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="o-level" className={label}>Level</label>
          <select id="o-level" name="difficulty" defaultValue={values.difficulty} className={`${input} h-12`}>
            {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="o-focus" className={label}>Focus</label>
          <select id="o-focus" name="bodyFocus" defaultValue={values.bodyFocus} className={`${input} h-12`}>
            {FOCUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={label}>Movements</span>
        <RowsEditor
          name="rows"
          label="Movements"
          itemName="movement"
          initial={values.rows}
          items={[
            { key: "movement", label: "Movement", kind: "text", width: "m" },
            { key: "reps", label: "Reps", kind: "text", width: "s" },
            { key: "tip", label: "Tip", kind: "text", width: "l" },
          ]}
        />
        <span className="text-[13px] text-ink-3">Use names from the movement library (e.g. Kettlebell Swings) so they link to their pages.</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="o-desc" className={label}>Description</label>
        <textarea id="o-desc" name="description" rows={3} defaultValue={values.description} className={input} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="o-score" className={label}>Score line</label>
        <input id="o-score" name="scoring" type="text" defaultValue={values.scoring} placeholder="Your score is total rounds + reps." className={`${input} h-12`} />
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-3">
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-accent px-6 font-bold text-accent-ink disabled:opacity-60">
          {pending ? "Saving…" : hasOverride ? "Save changes" : "Save override"}
        </button>
        <Status state={state} idle="Replaces the generated workout for that date on both sites and in the email." />
      </div>
    </form>
  );
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ConfigForm({
  equipmentOptions,
  equipment,
  formatByDay,
  difficultyByDay,
  focusByDay,
}: {
  equipmentOptions: { value: string; label: string }[];
  equipment: string[];
  formatByDay: Record<string, string>;
  difficultyByDay: Record<string, string>;
  focusByDay: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<DailyState, FormData>(saveConfig, null);
  const sel = "h-10 w-full rounded-lg border-[1.5px] border-chip-line bg-surface px-2 text-sm text-ink";
  return (
    <form action={action} className="flex flex-col gap-4">
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className={`${label} mb-2`}>Equipment the Daily 20 may use</legend>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map((e) => (
            <label key={e.value} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-chip-line px-3 text-sm font-semibold has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ground">
              <input type="checkbox" name="equipment" value={e.value} defaultChecked={equipment.includes(e.value)} disabled={e.value === "bodyweight"} className="sr-only" />
              {e.label}
            </label>
          ))}
        </div>
        <span className="text-[13px] text-ink-3">Bodyweight is always included.</span>
      </fieldset>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-ink-3">
              <th className="py-2 pr-2 font-semibold">Day</th>
              <th className="py-2 pr-2 font-semibold">Format</th>
              <th className="py-2 pr-2 font-semibold">Level</th>
              <th className="py-2 font-semibold">Focus</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((d, i) => (
              <tr key={d} className="border-t border-divider">
                <th scope="row" className="py-2 pr-2 text-left font-bold">{d}</th>
                <td className="py-2 pr-2">
                  <select aria-label={`${d} format`} name={`format-${i}`} defaultValue={formatByDay[i]} className={sel}>
                    {FORMAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <select aria-label={`${d} level`} name={`difficulty-${i}`} defaultValue={difficultyByDay[i]} className={sel}>
                    {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
                <td className="py-2">
                  <select aria-label={`${d} focus`} name={`focus-${i}`} defaultValue={focusByDay[i]} className={sel}>
                    {FOCUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-accent px-6 font-bold text-accent-ink disabled:opacity-60">
          {pending ? "Saving…" : "Save weekly plan"}
        </button>
        <Status state={state} idle="Applies to every day without an override." />
      </div>
    </form>
  );
}
