"use server";

import { revalidatePath, updateTag } from "next/cache";
import { LIBRARY_TAG } from "@/lib/supabase/public";
import { requireAdmin } from "@/lib/admin";
import { CONTENT_TYPES, fromFormValue } from "@/lib/contentTypes";

export type SaveState = { ok: boolean; message: string } | null;

/** Saves one item. The database's admin rules still decide whether the update is allowed. */
export async function saveContent(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase } = await requireAdmin();
  const ct = CONTENT_TYPES[String(form.get("_type"))];
  const slug = String(form.get("_slug") ?? "");
  if (!ct || !slug) return { ok: false, message: "Unknown item." };

  const update: Record<string, unknown> = {};
  for (const f of ct.fields) {
    const r = fromFormValue(f, form.get(f.key));
    if ("error" in r) return { ok: false, message: r.error };
    update[f.key] = r.value;
  }
  if (!update.name) return { ok: false, message: "Name can't be empty." };
  update.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from(ct.table).update(update).eq("slug", slug).select("slug");
  if (error) return { ok: false, message: `Not saved: ${error.message}` };
  if (!data?.length) return { ok: false, message: "Not saved: the database didn't accept the change (check you're logged in as an admin)." };

  // Refresh the public page and lists on the new site right away instead of within the hour.
  updateTag(LIBRARY_TAG);
  revalidatePath(ct.publicPath(slug));
  revalidatePath(`/${ct.type}`);
  revalidatePath(`/admin/content/${ct.type}/${slug}`);
  return { ok: true, message: `Saved. It's live now on homewodrx.com and the new site.` };
}
