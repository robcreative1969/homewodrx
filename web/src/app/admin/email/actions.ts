"use server";

import { requireAdmin } from "@/lib/admin";
import { getPost } from "@/lib/blog";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export type SendState = { ok: boolean; message: string } | null;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Plain text with blank lines between paragraphs → simple email HTML. */
function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

/**
 * Sends a broadcast through the send-broadcast Edge Function, signed in as this admin
 * (the function checks the admin flag on the session; no shared password needed).
 */
export async function sendBroadcast(_prev: SendState, form: FormData): Promise<SendState> {
  const { supabase, user } = await requireAdmin();
  const mode = String(form.get("mode") ?? "test");
  const type = String(form.get("type") ?? "");
  if (mode === "all" && form.get("confirm") !== "on") return { ok: false, message: "Tick the confirmation box before sending to everyone." };

  let payload: Record<string, string | null>;
  if (type === "blog") {
    const post = getPost(String(form.get("post") ?? ""));
    if (!post) return { ok: false, message: "Pick a blog post." };
    payload = {
      type: "blog",
      post_title: post.title,
      post_url: `https://homewodrx.com/blog/${post.slug}`,
      post_excerpt: String(form.get("excerpt") ?? "").trim() || post.excerpt,
      post_category: post.categoryLabel,
      reading_time: post.readTime,
    };
  } else if (type === "announcement") {
    const subject = String(form.get("subject") ?? "").trim();
    const headline = String(form.get("headline") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    if (!subject || !headline || !body) return { ok: false, message: "Subject, headline and message are all needed." };
    const ctaUrl = String(form.get("cta_url") ?? "").trim();
    if (ctaUrl && !/^https:\/\//.test(ctaUrl)) return { ok: false, message: "The button link needs to start with https://" };
    payload = {
      type: "announcement",
      subject,
      eyebrow: String(form.get("eyebrow") ?? "").trim() || "What's New",
      headline,
      body_html: paragraphs(body),
      preview_text: body.replace(/\s+/g, " ").slice(0, 140),
      cta_label: String(form.get("cta_label") ?? "").trim() || null,
      cta_url: ctaUrl || null,
    };
  } else {
    return { ok: false, message: "Pick a type of email." };
  }
  if (mode === "test") payload.test_email = user.email ?? null;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { ok: false, message: "Your login expired. Log in again." };
  const res = await fetch(`${supabaseUrl()}/functions/v1/send-broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: supabaseAnonKey(), Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string; sent?: number; total?: number; message?: string };
  if (!res.ok) return { ok: false, message: `Not sent: ${json.error ?? `error ${res.status}`}` };
  if (mode === "test") return { ok: true, message: `Test sent to ${user.email}. Check your inbox before sending to everyone.` };
  return { ok: true, message: json.message ?? `Sent to ${json.sent ?? 0} of ${json.total ?? 0} opted-in members.` };
}
