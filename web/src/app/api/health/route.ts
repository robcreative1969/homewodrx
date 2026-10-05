import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Confirms the deployment can reach Supabase with its public settings. Reveals no data. */
export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("benchmark_workouts").select("slug").limit(1);
    if (error) return Response.json({ ok: false, supabase: "error", code: error.code }, { status: 500 });
    return Response.json({ ok: true, supabase: "connected" });
  } catch {
    return Response.json({ ok: false, supabase: "not configured" }, { status: 500 });
  }
}
