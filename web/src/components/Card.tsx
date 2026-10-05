import type { ReactNode } from "react";

/** The standard white card: 1 px border, 16 px radius, 18 px padding (STYLE-GUIDE.md §3). */
export function Card({
  title,
  aside,
  children,
  labelledBy,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      aria-labelledby={title ? labelledBy : undefined}
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]"
    >
      {title ? (
        <div className="flex items-baseline justify-between gap-3">
          <h2 id={labelledBy} className="m-0 text-lg font-bold">
            {title}
          </h2>
          {aside}
        </div>
      ) : null}
      {children}
    </section>
  );
}
