import Link from "next/link";

const SECTIONS = [
  { key: "workouts", href: "/workouts", label: "Workouts" },
  { key: "movements", href: "/movements", label: "Movements" },
  { key: "stretches", href: "/stretches", label: "Stretches" },
  { key: "machines", href: "/machines", label: "Machines" },
] as const;

/** Switches between the four parts of the library (the Library tab's sections). */
export function LibrarySwitch({ current }: { current: (typeof SECTIONS)[number]["key"] }) {
  return (
    <nav aria-label="Library sections">
      <ul className="m-0 grid list-none grid-cols-4 gap-1 rounded-xl bg-surface-muted p-1">
        {SECTIONS.map((s) => {
          const on = s.key === current;
          return (
            <li key={s.key}>
              <Link
                href={s.href}
                aria-current={on ? "page" : undefined}
                className={`flex h-11 items-center justify-center rounded-[9px] text-[13px] font-semibold sm:text-[15px] no-underline ${on ? "bg-ink text-ground" : "text-ink"}`}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
