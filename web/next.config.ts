import type { NextConfig } from "next";

// Pages the rebuild hasn't reached yet (REBUILD-PLAN.md §5). On the preview they send
// visitors to the same page on the live site. Delete each line when its phase lands;
// the list must be empty before the switch (the guard below stops a redirect loop).
const NOT_REBUILT_YET = [
  "/stretchbuilder",
  "/timer",
  "/planner",
  "/myworkouts",
  "/shop",
  "/signup",
  "/login",
  "/profile",
  "/settings",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/disclaimer",
  "/u/:handle",
];

const nextConfig: NextConfig = {
  images: {
    // YouTube thumbnails are fetched by Vercel and served from our own domain, so a
    // visitor's browser contacts YouTube only after they press play.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  async redirects() {
    if (process.env.SITE_INDEXABLE === "1") return [];
    return NOT_REBUILT_YET.map((source) => ({
      source,
      destination: `https://homewodrx.com${source}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
