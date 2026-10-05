import type { ReactNode } from "react";

/**
 * The action bar fixed to the bottom of workout and builder screens (STYLE-GUIDE.md §4).
 * Pages using it add `pb-28` so their last section clears it; globals.css pads the footer.
 */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div data-bottom-bar className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-3xl gap-2 px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}

export const primaryAction =
  "flex h-14 flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-accent text-[17px] font-bold text-accent-ink no-underline";

export const iconAction =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-ink bg-surface text-ink no-underline";
