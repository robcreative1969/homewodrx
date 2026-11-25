import Image from "next/image";
import { postImage } from "@/lib/blogImages";

/** 16:9 cover image at the top of a blog card. Renders nothing for posts without one. */
export function PostThumb({ slug }: { slug: string }) {
  const img = postImage(slug);
  if (!img) return null;
  return (
    <span className="relative block aspect-video w-full bg-surface-muted">
      <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
    </span>
  );
}
