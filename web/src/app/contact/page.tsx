import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Found a bug, have an idea, or want to say hi? Send HomeWODRx a message.",
  alternates: { canonical: "https://homewodrx.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pt-5 pb-16 [&>*]:max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Contact</h1>
        <p className="m-0 text-ink-2">Found a bug? Have an idea? Or just want to say hi? We read everything, and reply within 1–2 business days.</p>
      </div>
      <ContactForm />
    </div>
  );
}
