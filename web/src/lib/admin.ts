import "server-only";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Gate for every admin page and action. Signed-out visitors go to the login page;
 * signed-in non-admins get a plain 404, so the admin's existence isn't advertised.
 * The database's own rules (is_admin()) still decide what the session can read or change.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) notFound();
  return { supabase, user };
}
