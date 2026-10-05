import Image from "next/image";
import Link from "next/link";

// The real HomeWODRx logo (1200 × 312). The black-and-red version sits on light
// backgrounds; the white version on dark ones. globals.css shows the right one for the
// current theme.
const RATIO = 1200 / 312;

export function Wordmark({ onDark = false, height = 28 }: { onDark?: boolean; height?: number }) {
  const width = Math.round(height * RATIO);
  return (
    <Link href="/" aria-label="HomeWODRx home" className="flex shrink-0 items-center no-underline">
      {onDark ? (
        <Image src="/brand/logo-on-dark.png" alt="HomeWODRx" width={width} height={height} />
      ) : (
        <>
          <Image src="/brand/logo-on-light.png" alt="HomeWODRx" width={width} height={height} priority className="logo-for-light" />
          <Image src="/brand/logo-on-dark.png" alt="HomeWODRx" width={width} height={height} priority className="logo-for-dark" />
        </>
      )}
    </Link>
  );
}
