import Link from "next/link";
import { formatDate, listPosts } from "@/lib/blog";
import { getDaily10, getDaily20, todayEastern } from "@/lib/daily";
import { CATEGORIES } from "@/lib/labels";
import { listMovements } from "@/lib/movements";
import { listStretches } from "@/lib/stretches";
import { listWorkouts } from "@/lib/workouts";

// Rebuilt every ten minutes, so "Today" turns over shortly after midnight Eastern.
export const revalidate = 600;

export default async function Home() {
  const today = todayEastern();
  const [workouts, movements, stretches, wod, stretch] = await Promise.all([
    listWorkouts(),
    listMovements(),
    listStretches(),
    getDaily20(today),
    getDaily10(today),
  ]);
  const counts = new Map<string, number>();
  for (const w of workouts) counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
  const categories = CATEGORIES.filter((c) => counts.get(c.code));
  const posts = listPosts().slice(0, 2);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-6 pb-8">
      <section className="flex flex-col gap-3.5">
        <h1 className="m-0 text-[40px] leading-[1.05] font-extrabold tracking-tight sm:text-5xl">
          Program your training. Then go do it.
        </h1>
        <p className="m-0 text-[17px] text-ink-2">
          Benchmark workouts, a WOD Builder and a weekly Planner, for training at the box, the health club, or at home.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href="https://homewodrx.com/wodbuilder" className="flex h-14 items-center justify-center rounded-[14px] bg-accent px-6 text-[17px] font-bold text-accent-ink no-underline">
            Build a workout
          </a>
          <Link href="/daily-wod" className="flex h-[50px] items-center justify-center rounded-[14px] border-[1.5px] border-ink bg-surface px-6 font-bold text-ink no-underline">
            See today&apos;s Daily 20
          </Link>
        </div>
      </section>

      <section aria-labelledby="today" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px]">
        <div className="flex items-baseline justify-between">
          <h2 id="today" className="m-0 text-lg font-bold">Today</h2>
          <span className="font-mono text-[13px] text-ink-2">
            {new Date(`${today}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/daily-wod" className="flex min-h-[124px] flex-col gap-1 rounded-[14px] bg-ink p-3.5 text-ground no-underline">
            <span className="text-[13px] opacity-80">Workout</span>
            <span className="text-xl leading-tight font-extrabold">The Daily 20</span>
            {wod ? (
              <span className="mt-auto font-mono text-[13px] opacity-90">
                {wod.formatLabel} · {wod.rows.length} movements
              </span>
            ) : null}
          </Link>
          <Link href="/daily-wod#daily-10-title" className="flex min-h-[124px] flex-col gap-1 rounded-[14px] bg-surface-muted p-3.5 text-ink no-underline">
            <span className="text-[13px] text-ink-2">Stretch</span>
            <span className="text-xl leading-tight font-extrabold">The Daily 10</span>
            {stretch ? (
              <span className="mt-auto font-mono text-[13px] text-ink-2">
                {stretch.label} · {stretch.totalMin} min
              </span>
            ) : null}
          </Link>
        </div>
        <p className="m-0 text-sm text-ink-2">New every day, the same for everyone, free with no account.</p>
      </section>

      <section aria-labelledby="library" className="flex flex-col gap-2.5">
        <h2 id="library" className="m-0 text-lg font-bold">The library</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["/workouts", workouts.length, "Workouts"],
            ["/movements", movements.length, "Movements"],
            ["/stretches", stretches.length, "Stretches"],
          ].map(([href, count, label]) => (
            <Link key={label} href={href as string} className="flex flex-col rounded-[14px] border border-line bg-surface p-3 text-ink no-underline">
              <span className="font-mono text-2xl font-bold">{count}</span>
              <span className="text-sm text-ink-2">{label}</span>
            </Link>
          ))}
        </div>
        <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-surface px-4 py-1">
          {categories.map((c, i) => (
            <li key={c.code} className={i ? "border-t border-divider" : ""}>
              <Link href={`/workouts?category=${c.param}`} className="flex min-h-12 items-center justify-between font-semibold text-ink no-underline">
                <span>{c.label}</span>
                <span className="font-mono text-sm text-ink-2">{counts.get(c.code)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="plan" className="flex flex-col gap-2.5 rounded-2xl bg-footer p-5 text-footer-ink">
        <h2 id="plan" className="m-0 text-[22px] font-extrabold tracking-tight text-white">Plan your week</h2>
        <p className="m-0">
          Mix benchmark workouts, builder workouts and your own into one weekly plan, then print it or send it to your calendar.
        </p>
        <a href="https://homewodrx.com/planner" className="flex min-h-11 items-center self-start rounded-xl bg-white px-4 font-bold text-[#16181d] no-underline">
          Open the Planner
        </a>
      </section>

      <section aria-labelledby="from-blog" className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <h2 id="from-blog" className="m-0 text-lg font-bold">From the blog</h2>
          <Link href="/blog" className="text-sm font-semibold text-ink">All posts</Link>
        </div>
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 text-ink no-underline">
            <span className="text-xs font-bold tracking-wider text-accent-text uppercase">{p.categoryLabel}</span>
            <span className="text-[17px] leading-snug font-bold">{p.title}</span>
            <span className="font-mono text-xs text-ink-2">{formatDate(p.date)} · {p.readTime}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
