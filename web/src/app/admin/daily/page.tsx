import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { EQUIPMENT } from "@/lib/builderOptions";
import { bodyFocusLabel, getDaily20, isDateString, loadConfig, todayEastern } from "@/lib/daily";
import { deleteOverride } from "./actions";
import { ConfigForm, OverrideForm, type OverrideValues } from "./forms";

export const metadata: Metadata = { title: "Daily 20" };
export const dynamic = "force-dynamic";

function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dayLabel(date: string, today: string) {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

export default async function AdminDailyPage({ searchParams }: PageProps<"/admin/daily">) {
  await requireAdmin();
  const sp = await searchParams;
  const today = todayEastern();
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const days = await Promise.all(dates.map((d) => getDaily20(d)));
  const config = await loadConfig();

  // The override form opens for ?edit=YYYY-MM-DD, starting from that day's workout.
  const editDate = isDateString(sp.edit) ? sp.edit : null;
  const editing = editDate ? (days[dates.indexOf(editDate)] ?? (await getDaily20(editDate))) : null;
  const values: OverrideValues | null = editDate
    ? {
        date: editDate,
        title: editing?.isManual ? editing.title : "",
        format: editing?.format ?? "amrap",
        minutes: String(editing?.timeCap ?? 20),
        rounds: editing?.rounds ? String(editing.rounds) : "",
        difficulty: editing?.difficulty ?? "intermediate",
        bodyFocus: editing?.bodyFocus ?? "full-body",
        description: editing?.description ?? "",
        scoring: editing?.scoring ?? "",
        rows: JSON.stringify((editing?.rows ?? []).map((r) => ({ movement: r.movement, reps: r.reps, tip: r.tip ?? "" }))),
      }
    : null;

  const byDay = (m: Record<number, string>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, String(v)]));
  const equipmentOptions = [{ value: "bodyweight", label: "Bodyweight" }, ...EQUIPMENT.map((e) => ({ value: e.code === "dumbbells" ? "dumbbell" : e.code, label: e.label }))];

  return (
    <>
      <AdminNav current="/admin/daily" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[30px] font-extrabold tracking-tight">Daily 20</h1>
        <p className="m-0 text-sm text-ink-2">
          Each day&apos;s workout is built automatically from the weekly plan below. Override any date with your own workout; it shows on both sites and in that morning&apos;s email.
        </p>
      </div>

      {values ? (
        <section className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-ink bg-surface p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 text-lg font-bold">{editing?.isManual ? "Edit override" : "Override"} · {dayLabel(values.date, today)}</h2>
            <Link href="/admin/daily" className="text-sm font-semibold text-ink-2">Close</Link>
          </div>
          {!editing?.isManual ? <p className="m-0 text-sm text-ink-3">Starting from the generated workout for this day. Change anything, then save.</p> : null}
          <OverrideForm values={values} hasOverride={!!editing?.isManual} />
        </section>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold">Next 14 days</h2>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {days.map((d, i) => (
            <li key={dates[i]} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{dayLabel(dates[i], today)}</span>
                <span className="font-mono text-xs text-ink-3">{dates[i]}</span>
                {d?.isManual ? <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-ink">Override</span> : <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold text-ink-2">Automatic</span>}
                <span className="text-sm text-ink-2">
                  {d ? `${d.formatLabel} · ${d.difficulty} · ${bodyFocusLabel(d.bodyFocus)}` : "No workout could be built"}
                </span>
                <div className="ml-auto flex gap-3 text-sm font-semibold">
                  <Link href={`/admin/daily?edit=${dates[i]}`} className="text-accent-text">{d?.isManual ? "Edit" : "Override"}</Link>
                  {d?.isManual ? (
                    <form action={deleteOverride}>
                      <input type="hidden" name="date" value={dates[i]} />
                      <button type="submit" className="font-semibold text-ink-2">Remove override</button>
                    </form>
                  ) : null}
                </div>
              </div>
              {d ? (
                <p className="m-0 text-sm text-ink-2">
                  {d.isManual && d.title !== "The Daily 20" ? <b className="text-ink">{d.title}: </b> : null}
                  {d.rows.map((r) => `${r.reps ? `${r.reps} ` : ""}${r.movement}`).join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="m-0 text-sm text-ink-3">
          Need a date further out? <Link href={`/admin/daily?edit=${addDays(today, 14)}`} className="text-ink-2">Override another date</Link> and change the date in the form.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="m-0 text-lg font-bold">Weekly plan</h2>
        <ConfigForm
          equipmentOptions={equipmentOptions}
          equipment={config.equipment}
          formatByDay={byDay(config.formatByDay)}
          difficultyByDay={byDay(config.difficultyByDay)}
          focusByDay={byDay(config.bodyFocusByDay)}
        />
      </section>
    </>
  );
}
