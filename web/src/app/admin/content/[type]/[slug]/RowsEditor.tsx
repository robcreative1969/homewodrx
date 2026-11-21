"use client";

import { useState } from "react";
import type { ItemField } from "@/lib/contentTypes";

type Row = Record<string, unknown>;

const box = "w-full rounded-lg border-[1.5px] border-chip-line bg-surface px-3 py-2 text-[15px] text-ink";
const widths = { s: "sm:col-span-2", m: "sm:col-span-4", l: "sm:col-span-6" } as const;

/**
 * A list of small records edited as one card per row (a workout's movements, its FAQs…).
 * The whole list travels to the server as JSON in one hidden field.
 */
export function RowsEditor({ name, label, items, initial, itemName = "row" }: { name: string; label: string; items: ItemField[]; initial: string; itemName?: string }) {
  const [rows, setRows] = useState<Row[]>(() => {
    try {
      const v = JSON.parse(initial || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  });

  const set = (i: number, key: string, value: string) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value } : row)));
  const move = (i: number, d: -1 | 1) =>
    setRows((r) => {
      const j = i + d;
      if (j < 0 || j >= r.length) return r;
      const copy = [...r];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const remove = (i: number) => setRows((r) => r.filter((_, j) => j !== i));
  const add = () => setRows((r) => [...r, {}]);

  const iconBtn = "flex h-9 min-w-9 items-center justify-center rounded-lg border border-line px-2 text-sm font-semibold text-ink-2 disabled:opacity-30";
  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      {rows.length === 0 ? <p className="m-0 rounded-xl border border-dashed border-chip-line px-3.5 py-3 text-sm text-ink-3">No {itemName}s yet.</p> : null}
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((row, i) => (
          <li key={i} className="flex flex-col gap-2 rounded-xl border border-line bg-surface-muted p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-ink-3">
                {itemName.toUpperCase()} {i + 1}
              </span>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={iconBtn} aria-label={`Move ${itemName} ${i + 1} up`}>↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className={iconBtn} aria-label={`Move ${itemName} ${i + 1} down`}>↓</button>
                <button type="button" onClick={() => remove(i)} className={`${iconBtn} text-accent-text`} aria-label={`Remove ${itemName} ${i + 1}`}>Remove</button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
              {items.map((f) => {
                const id = `${name}-${i}-${f.key}`;
                const v = row[f.key] == null ? "" : String(row[f.key]);
                return (
                  <div key={f.key} className={`flex min-w-0 flex-col gap-1 ${widths[f.width ?? "l"]}`}>
                    <label htmlFor={id} className="text-xs font-semibold text-ink-2">{f.label}</label>
                    {f.kind === "select" ? (
                      <select id={id} value={v} onChange={(e) => set(i, f.key, e.target.value)} className={`${box} h-10`}>
                        <option value="">—</option>
                        {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.kind === "textarea" ? (
                      <textarea id={id} value={v} rows={3} onChange={(e) => set(i, f.key, e.target.value)} className={box} />
                    ) : (
                      <input id={id} type="text" value={v} onChange={(e) => set(i, f.key, e.target.value)} className={`${box} h-10`} />
                    )}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={add} className="self-start rounded-xl border-[1.5px] border-ink px-4 py-2 text-sm font-bold text-ink">
        + Add {itemName}
      </button>
      <span className="sr-only">{label}</span>
    </div>
  );
}
