/** Search engines may index the site only once it is live on homewodrx.com. */
export function isIndexable() {
  return process.env.SITE_INDEXABLE === "1";
}

/** The default link-preview image (pages that set their own openGraph must include it). */
export const OG_IMAGE = { url: "/brand/og-share.png", width: 1200, height: 630, alt: "HomeWODRx" };
