import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/account";

/**
 * Where the links in Supabase's emails land (confirm sign-up, reset password, change
 * email). Swaps the one-time code for a session, then sends the person on.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  // The link was opened on another device or browser, used twice, or expired. A sign-up
  // email is still confirmed by then, so logging in works; a reset needs a fresh link.
  const reason = next === "/reset-password" ? "reset" : "link";
  return NextResponse.redirect(new URL(`/login?notice=${reason}&next=${encodeURIComponent(next === "/reset-password" ? "/me" : next)}`, url.origin));
}
