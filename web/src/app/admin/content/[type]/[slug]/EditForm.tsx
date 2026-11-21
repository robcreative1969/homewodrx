"use client";

import { useActionState } from "react";
import { saveContent, type SaveState } from "../../actions";
import type { Field } from "@/lib/contentTypes";
import { RowsEditor } from "./RowsEditor";

const input = "w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 py-2.5 text-base text-ink";

export function EditForm({ type, slug, fields, values }: { type: string; slug: string; fields: Field[]; values: Record<string, string> }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveContent, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="_type" value={type} />
      <input type="hidden" name="_slug" value={slug} />
      {fields.map((f) => {
        const id = `f-${f.key}`;
        if (f.kind === "bool") {
          return (
            <label key={f.key} htmlFor={id} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
              <input id={id} name={f.key} type="checkbox" defaultChecked={values[f.key] === "on"} className="h-5 w-5 accent-[var(--accent)]" />
              <span className="font-semibold">{f.label}</span>
            </label>
          );
        }
        return (
          <div key={f.key} className="flex flex-col gap-1.5">
            {f.kind === "rows" ? <span className="text-sm font-bold">{f.label}</span> : <label htmlFor={id} className="text-sm font-bold">{f.label}</label>}
            {f.kind === "rows" ? (
              <RowsEditor name={f.key} label={f.label} items={f.item ?? []} initial={values[f.key]} itemName={f.itemName} />
            ) : f.kind === "select" ? (
              <select id={id} name={f.key} defaultValue={values[f.key]} className={`${input} h-12`}>
                <option value="">—</option>
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.kind === "textarea" || f.kind === "lines" ? (
              <textarea
                id={id}
                name={f.key}
                defaultValue={values[f.key]}
                rows={f.rows ?? (f.kind === "lines" ? Math.max(3, values[f.key].split("\n").length + 1) : 4)}
                className={input}
              />
            ) : (
              <input id={id} name={f.key} type={f.kind === "url" ? "url" : f.kind === "number" ? "number" : "text"} defaultValue={values[f.key]} className={`${input} h-12`} />
            )}
            {f.help ? <span className="text-[13px] text-ink-3">{f.help}</span> : null}
          </div>
        );
      })}
      <div className="sticky bottom-[max(16px,env(safe-area-inset-bottom))] z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-lg">
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-accent px-6 font-bold text-accent-ink disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {state ? (
          <p role="status" className={`m-0 text-sm font-semibold ${state.ok ? "text-ink" : "text-accent-text"}`}>{state.message}</p>
        ) : (
          <p className="m-0 text-sm text-ink-3">Changes go live on both sites when you save.</p>
        )}
      </div>
    </form>
  );
}
