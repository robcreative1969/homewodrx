// The desktop header menu. Phones use the tab bar (BottomNav) and the More page instead.
export const MAIN_NAV = [
  { href: "/workouts", label: "Workouts" },
  { href: "/movements", label: "Movements" },
  { href: "/stretches", label: "Stretches" },
  { href: "/machines", label: "Machines" },
  { href: "/daily-wod", label: "The Daily 20" },
  { href: "/wodbuilder", label: "WOD Builder" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Gear" },
  { href: "/search", label: "Search" },
] as const satisfies readonly { href: string; label: string }[];
