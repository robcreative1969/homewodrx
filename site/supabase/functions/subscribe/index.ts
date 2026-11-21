// ============================================================================
// HOMEWODRX — Email sign-up (Daily 20 email and blog)
// The only way onto email_subscribers: the public can no longer insert directly.
//
// Checks, in order:
//   1. A Cloudflare Turnstile token (the same human check as login), verified with
//      Cloudflare using the TURNSTILE_SECRET_KEY secret.
//   2. A sensible email address, and not Gmail's "dot trick" (bots scatter dots
//      through random letters to make endless "different" addresses).
//   3. Already on the list counts as success, without saying so (no list probing).
//
// Secrets (Dashboard → Edge Functions → Secrets): TURNSTILE_SECRET_KEY
// POST { email, source: "homepage_digest" | "blog", captchaToken }
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
const SOURCES = new Set(["homepage_digest", "blog"]);
const ORIGINS = new Set(["https://homewodrx.com", "https://www.homewodrx.com", "https://homewodrx-next.vercel.app"]);

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

function cors(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.has(origin) ? origin : "https://homewodrx.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, authorization, apikey, x-client-info",
    Vary: "Origin",
  };
}

function reply(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(req) } });
}

function looksFake(email: string) {
  const [local, domain] = email.split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const dots = (local.match(/\./g) ?? []).length;
    if (dots >= 2) return true;
  }
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return reply(req, { error: "Method not allowed" }, 405);

  const body = (await req.json().catch(() => ({}))) as { email?: string; source?: string; captchaToken?: string };
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
  const source = SOURCES.has(String(body.source)) ? String(body.source) : "homepage_digest";
  const token = String(body.captchaToken ?? "");

  if (!TURNSTILE_SECRET) return reply(req, { error: "Sign-up is temporarily unavailable." }, 503);
  if (!token) return reply(req, { error: "Please complete the human check." }, 400);

  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
  form.append("response", token);
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0];
  if (ip) form.append("remoteip", ip);
  const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form })
    .then((r) => r.json())
    .catch(() => ({ success: false }));
  if (!check.success) {
    // e.g. "invalid-input-secret" means the TURNSTILE_SECRET_KEY secret is wrong.
    console.log("turnstile rejected", JSON.stringify(check["error-codes"] ?? []));
    return reply(req, { error: "The human check didn't pass. Please try again." }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return reply(req, { error: "Enter a valid email address." }, 400);
  // Fake-looking addresses get the same "you're in" answer, so bots learn nothing; nothing is saved.
  if (looksFake(email)) return reply(req, { ok: true });

  const { error } = await sb.from("email_subscribers").insert({ email, source });
  if (error && error.code !== "23505") return reply(req, { error: "Something went wrong. Please try again." }, 500);
  return reply(req, { ok: true });
});
