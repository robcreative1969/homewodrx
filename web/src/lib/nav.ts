// The main menu. Pages not rebuilt yet point at the live site until their phase lands
// (REBUILD-PLAN.md §5); swap each href for the local path when it does.
export const MAIN_NAV = [
  { href: "/workouts", label: "Workouts" },
  { href: "/movements", label: "Movements" },
  { href: "/stretches", label: "Stretches" },
  { href: "/machines", label: "Machines" },
  { href: "/daily-wod", label: "The Daily 20" },
  { href: "/wodbuilder", label: "WOD Builder" },
  // Phone menu only: the desktop header has no room; Stretches and Routines link to it.
  { href: "/stretchbuilder", label: "Stretch Builder", menuOnly: true },
  { href: "/blog", label: "Blog" },
  { href: "/search", label: "Search" },
] as const satisfies readonly { href: string; label: string; menuOnly?: boolean }[];
