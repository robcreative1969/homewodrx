"use client";

import { useState } from "react";

// Web3Forms relays the message to Rob's inbox, as on the old site. The access key is
// public by design (it only allows sending to the one inbox it was made for).
const WEB3FORMS_KEY = "0c5922a1-0b41-4297-b766-ebdba008bf15";
const TOPICS = ["General", "Bug Report", "Feature Request"] as const;

const input = "w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-ink-3";

export function ContactForm() {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("General");
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("message") ?? "").trim()) {
      setError("Write a message before sending.");
      return setState("error");
    }
    data.set("access_key", WEB3FORMS_KEY);
    data.set("subject", `${topic} — HomeWODRx contact`);
    setState("busy");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!json.success) throw new Error();
      setState("sent");
    } catch {
      setError("Something went wrong. Please try again in a moment.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
        <p className="m-0 text-lg font-bold">Thanks, your message is on its way.</p>
        <p className="m-0 text-ink-2">If you left your email, you&apos;ll hear back within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
      {/* Web3Forms' own spam trap: real visitors never see or tick it. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 text-sm font-bold">Topic</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label key={t} className="flex min-h-10 cursor-pointer items-center rounded-full border-[1.5px] border-chip-line px-3.5 text-sm font-semibold has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ground">
              <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-name" className="text-sm font-bold">Name <span className="font-normal text-ink-3">(optional)</span></label>
          <input id="c-name" name="name" type="text" autoComplete="name" className={`${input} h-12`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-email" className="text-sm font-bold">Email <span className="font-normal text-ink-3">(for a reply)</span></label>
          <input id="c-email" name="email" type="email" autoComplete="email" className={`${input} h-12`} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-message" className="text-sm font-bold">Message</label>
        <textarea id="c-message" name="message" rows={6} required className={input} />
      </div>
      {state === "error" ? <p role="alert" className="m-0 text-sm font-semibold text-accent-text">{error}</p> : null}
      <button type="submit" disabled={state === "busy"} className="h-12 self-start rounded-xl bg-accent px-6 font-bold text-accent-ink disabled:opacity-60">
        {state === "busy" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
