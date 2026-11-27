// The desktop header menu. Phones use the tab bar (BottomNav) and the More page instead.
// The main links match the phone tabs; everything else sits under the header's More menu.
export const MAIN_NAV = [
  { href: "/workouts", label: "Workouts" },
  { href: "/daily-wod", label: "The Daily 20" },
  { href: "/wodbuilder", label: "WOD Builder" },
  { href: "/movements", label: "Movements" },
] as const satisfies readonly { href: string; label: string }[];

export const MORE_NAV = [
  { href: "/stretches", label: "Stretches" },
  { href: "/machines", label: "Machines" },
  { href: "/stretchbuilder", label: "Stretch Builder" },
  { href: "/timer", label: "WOD Timer" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Gear" },
] as const satisfies readonly { href: string; label: string }[];
