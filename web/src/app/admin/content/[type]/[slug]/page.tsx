import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";
import { CONTENT_TYPES, toFormValue } from "@/lib/contentTypes";
import { EditForm } from "./EditForm";

export const metadata: Metadata = { title: "Edit" };
export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }: PageProps<"/admin/content/[type]/[slug]">) {
  const { type, slug } = await params;
  const ct = CONTENT_TYPES[type];
  if (!ct) notFound();
  const { supabase } = await requireAdmin();
  const cols = ["slug", "updated_at", ...ct.fields.map((f) => f.key)].join(",");
  const { data } = await supabase.from(ct.table).select(cols).eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const row = data as unknown as Record<string, unknown>;
  const values = Object.fromEntries(ct.fields.map((f) => [f.key, f.kind === "bool" ? (row[f.key] ? "on" : "") : toFormValue(f, row[f.key])]));
  const updated = row.updated_at ? new Date(String(row.updated_at)).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }) : null;

  return (
    <>
      <AdminNav current="/admin/content" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link href={`/admin/content?type=${ct.type}`} className="text-sm font-semibold text-ink-2">← {ct.label}</Link>
          <h1 className="m-0 text-[28px] font-extrabold tracking-tight">{String(row.name ?? slug)}</h1>
          <p className="m-0 text-sm text-ink-3">
            <span className="font-mono">{ct.publicPath(slug)}</span>
            {updated ? ` · last changed ${updated}` : ""}
          </p>
        </div>
        <a href={ct.publicPath(slug)} target="_blank" rel="noopener" className="flex min-h-10 items-center rounded-xl border-[1.5px] border-ink px-4 text-sm font-bold text-ink no-underline">View page</a>
      </div>
      <EditForm type={ct.type} slug={slug} fields={ct.fields} values={values} />
    </>
  );
}
