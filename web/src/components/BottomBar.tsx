import type { ReactNode } from "react";

/**
 * The action bar on workout and builder screens (STYLE-GUIDE.md §4). On phones it sits just
 * above the tab bar; from lg up it is at the bottom of the screen. globals.css pads the footer.
 */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div data-bottom-bar className="fixed inset-x-0 bottom-[calc(57px+env(safe-area-inset-bottom))] z-20 border-t border-line bg-surface lg:bottom-0">
      <div className="mx-auto flex max-w-5xl gap-2 px-4 py-2.5 lg:pt-3 lg:pb-[max(20px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}

export const primaryAction =
  "flex h-14 flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-accent text-[17px] font-bold text-accent-ink no-underline";

export const iconAction =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-ink bg-surface text-ink no-underline";
