import type { NextConfig } from "next";

// Addresses from the old site that have no page of their own here. Permanent (308), so
// search engines move their ranking to the new address. Accounts are on hold (Rob,
// 2026-11-20), so the account pages send visitors to the homepage.
const RETIRED: { source: string; destination: string }[] = [
  { source: "/login", destination: "/" },
  { source: "/signup", destination: "/" },
  { source: "/profile", destination: "/" },
  { source: "/settings", destination: "/" },
  { source: "/myworkouts", destination: "/" },
  { source: "/planner", destination: "/wodbuilder" },
  { source: "/u/:handle", destination: "/" },
  { source: "/leaderboard", destination: "/" },
  { source: "/companion-onboarding", destination: "/" },
  { source: "/admin.html", destination: "/admin" },
  { source: "/generator", destination: "/wodbuilder" },
  // The April version of the Stretch Builder.
  { source: "/stretch", destination: "/stretchbuilder" },
  // Older movement addresses the old site already forwarded.
  { source: "/movements/deadlift", destination: "/movements/deadlifts" },
  { source: "/movements/power-clean", destination: "/movements/power-cleans" },
  { source: "/movements/thruster", destination: "/movements/thrusters" },
  { source: "/movements/db-lateral-raise", destination: "/movements/db-lateral-raises" },
  { source: "/movements/db-dumbbell-thrusters", destination: "/movements/db-thrusters" },
  { source: "/movements/dumbbell-thruster", destination: "/movements/db-thrusters" },
  // Q9: brand names became the general name at the switch (2026-11-21).
  { source: "/movements/assault-bike", destination: "/movements/air-bike" },
  { source: "/movements/assault-bike-calories", destination: "/movements/air-bike-calories" },
  { source: "/movements/assault-bike-intervals", destination: "/movements/air-bike-intervals" },
  // Workouts removed 2026-11-22: not real benchmarks (audit against CrossFit's official list).
  { source: "/workouts/annie-vs-ghost", destination: "/workouts/annie" },
  { source: "/workouts/swim-fran", destination: "/workouts/fran" },
  { source: "/workouts/running-with-cindy", destination: "/workouts/cindy" },
  { source: "/workouts/double-diane", destination: "/workouts/diane" },
  { source: "/workouts/chelsea-challenge", destination: "/workouts/chelsea" },
  { source: "/workouts/spealler", destination: "/workouts/nate" },
  { source: "/workouts/dietz", destination: "/workouts/danny" },
  { source: "/workouts/hartman", destination: "/workouts/hortman" },
  { source: "/workouts/winchester", destination: "/workouts?category=hero" },
  { source: "/workouts/lt-brad-clark", destination: "/workouts?category=hero" },
];

// The old site's page files (workout.html?slug=fran, movement.html?slug=…), which some
// old links and emails still use.
const OLD_FILES: { source: string; base: string }[] = [
  { source: "/workout", base: "/workouts" },
  { source: "/movement", base: "/movements" },
  { source: "/machine", base: "/machines" },
  { source: "/stretch-movement", base: "/stretches" },
  { source: "/stretch-routine", base: "/stretch-routines" },
];

const nextConfig: NextConfig = {
  images: {
    // YouTube thumbnails are fetched by Vercel and served from our own domain, so a
    // visitor's browser contacts YouTube only after they press play.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  async redirects() {
    return [
      ...RETIRED.map((r) => ({ ...r, permanent: true })),
      ...OLD_FILES.flatMap(({ source, base }) => [
        { source: `${source}.html`, has: [{ type: "query" as const, key: "slug", value: "(?<slug>.+)" }], destination: `${base}/:slug`, permanent: true },
        { source, has: [{ type: "query" as const, key: "slug", value: "(?<slug>.+)" }], destination: `${base}/:slug`, permanent: true },
      ]),
      // Any other old ".html" address: drop the extension (index.html → /).
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path((?!admin).*)\\.html", destination: "/:path", permanent: true },
    ];
  },
};

export default nextConfig;
