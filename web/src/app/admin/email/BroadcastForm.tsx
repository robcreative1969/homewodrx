"use client";

import { useActionState, useState } from "react";
import { sendBroadcast, type SendState } from "./actions";

const input = "w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 py-2.5 text-base text-ink";
const label = "text-sm font-bold";

export function BroadcastForm({ posts, recipients }: { posts: { slug: string; title: string; excerpt: string }[]; recipients: { blog: number; product: number } }) {
  const [state, action, pending] = useActionState<SendState, FormData>(sendBroadcast, null);
  const [type, setType] = useState<"announcement" | "blog">("announcement");
  const [post, setPost] = useState(posts[0]?.slug ?? "");
  const excerpt = posts.find((p) => p.slug === post)?.excerpt ?? "";
  const count = type === "blog" ? recipients.blog : recipients.product;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="type" value={type} />
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-muted p-1" role="group" aria-label="Type of email">
        {(["announcement", "blog"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setType(t)} aria-pressed={type === t} className="h-10 rounded-lg text-sm font-bold text-ink aria-pressed:bg-ink aria-pressed:text-ground">
            {t === "announcement" ? "Announcement" : "New blog post"}
          </button>
        ))}
      </div>

      {type === "blog" ? (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="b-post" className={label}>Post</label>
            <select id="b-post" name="post" value={post} onChange={(e) => setPost(e.target.value)} className={`${input} h-12`}>
              {posts.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="b-excerpt" className={label}>Short summary</label>
            <textarea key={post} id="b-excerpt" name="excerpt" rows={3} defaultValue={excerpt} className={input} />
            <span className="text-[13px] text-ink-3">Starts from the post&apos;s own summary. The title, link, category and reading time are added for you.</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-subject" className={label}>Subject line</label>
            <input id="a-subject" name="subject" type="text" className={`${input} h-12`} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-eyebrow" className={label}>Small label</label>
              <input id="a-eyebrow" name="eyebrow" type="text" placeholder="What's New" className={`${input} h-12`} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="a-headline" className={label}>Headline</label>
              <input id="a-headline" name="headline" type="text" className={`${input} h-12`} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-body" className={label}>Message</label>
            <textarea id="a-body" name="body" rows={7} className={input} />
            <span className="text-[13px] text-ink-3">Plain text. Leave a blank line between paragraphs.</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-cta" className={label}>Button text <span className="font-normal text-ink-3">(optional)</span></label>
              <input id="a-cta" name="cta_label" type="text" placeholder="Try it" className={`${input} h-12`} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="a-cta-url" className={label}>Button link</label>
              <input id="a-cta-url" name="cta_url" type="url" placeholder="https://homewodrx.com/…" className={`${input} h-12`} />
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-muted p-4">
        <div className="flex flex-wrap gap-2">
          <button type="submit" name="mode" value="test" disabled={pending} className="h-12 rounded-xl border-[1.5px] border-ink px-5 font-bold text-ink disabled:opacity-60">
            Send me a test
          </button>
          <button type="submit" name="mode" value="all" disabled={pending} className="h-12 rounded-xl bg-accent px-5 font-bold text-accent-ink disabled:opacity-60">
            Send to {count} {count === 1 ? "member" : "members"}
          </button>
        </div>
        <label htmlFor="confirm" className="flex items-start gap-2 text-sm">
          <input id="confirm" name="confirm" type="checkbox" className="mt-0.5 h-5 w-5 accent-[var(--accent)]" />
          <span>I&apos;ve checked the test email. Send to every member who opted in to {type === "blog" ? "blog emails" : "news emails"}. This can&apos;t be undone.</span>
        </label>
        {pending ? <p className="m-0 text-sm text-ink-2">Sending…</p> : state ? <p role="status" className={`m-0 text-sm font-semibold ${state.ok ? "text-ink" : "text-accent-text"}`}>{state.message}</p> : null}
      </div>
    </form>
  );
}
