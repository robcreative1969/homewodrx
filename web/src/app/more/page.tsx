import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CookieChoicesButton } from "@/components/ConsentBanner";
import { MoreAccount } from "@/components/account/MoreAccount";

export const metadata: Metadata = {
  title: "More",
  robots: { index: false },
};

const SECTIONS = [
  { href: "/blog", label: "Blog", note: "Strategy, scaling and training at home", img: "/images/blog/case-for-logging-workouts.jpg" },
  { href: "/shop", label: "Gear", note: "Equipment we recommend", img: "/images/banners/gear.jpg" },
  { href: "/stretchbuilder", label: "Stretch Builder", note: "A routine for the time you have", img: "/images/banners/stretch-routines.jpg" },
  { href: "/timer", label: "WOD Timer", note: "AMRAP, EMOM, For Time and Tabata", img: "/images/home/row-club.jpg", focus: "50% 5%" },
];

const LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const row = "flex min-h-12 items-center justify-between border-b border-divider text-[17px] font-semibold text-ink no-underline";

export default function MorePage() {
  return (
    <div data-more-page className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5">
      <h1 className="m-0 text-[32px] font-extrabold tracking-tight">More</h1>

      <MoreAccount />

      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4">
        {SECTIONS.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-ink no-underline">
              <span className="relative block aspect-[16/10] w-full bg-surface-muted">
                <Image src={s.img} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" style={{ objectPosition: "focus" in s ? s.focus : "50% 50%" }} />
              </span>
              <span className="flex flex-col gap-0.5 px-3.5 py-3">
                <span className="font-bold">{s.label}</span>
                <span className="text-[13px] leading-snug text-ink-2">{s.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-label="Site information">
        <ul className="m-0 flex list-none flex-col p-0">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={row}>
                {l.label}
                <span aria-hidden="true" className="text-ink-2">›</span>
              </Link>
            </li>
          ))}
          <li>
            <CookieChoicesButton className={`${row} w-full cursor-pointer border-x-0 border-t-0 bg-transparent p-0 text-left`} />
          </li>
        </ul>
      </section>
    </div>
  );
}
