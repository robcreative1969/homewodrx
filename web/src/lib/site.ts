/** Search engines may index the site only once it is live on homewodrx.com. */
export function isIndexable() {
  return process.env.SITE_INDEXABLE === "1";
}
