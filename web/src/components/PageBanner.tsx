import Image from "next/image";

/** Wide photo banner under a page title. Files live in public/images/banners/<name>.jpg (1600×900).
 *  `focus` is the CSS object-position that keeps the subject in frame when the photo is cropped. */
export function PageBanner({ name, alt, focus = "50% 50%" }: { name: string; alt: string; focus?: string }) {
  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-surface-muted lg:aspect-[3/1]">
      <Image src={`/images/banners/${name}.jpg`} alt={alt} fill priority sizes="(min-width: 1024px) 992px, 100vw" className="object-cover" style={{ objectPosition: focus }} />
    </div>
  );
}
