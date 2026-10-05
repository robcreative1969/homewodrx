import { Wordmark } from "@/components/Wordmark";

export function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-1.5 px-4 py-6 text-sm">
        <span className="text-white">
          <Wordmark onDark />
        </span>
        <p className="m-0">
          The training platform for functional fitness athletes, at the box, the health club, or
          at home.
        </p>
      </div>
    </footer>
  );
}
