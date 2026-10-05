import Link from "next/link";

export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="text-xl font-extrabold tracking-tight no-underline">
      HomeWOD<span className={onDark ? "text-footer-accent" : "text-accent-text"}>Rx</span>
    </Link>
  );
}
