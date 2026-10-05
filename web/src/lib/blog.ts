import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  categoryLabel: string;
  date: string; // YYYY-MM-DD
  readTime: string;
  tags: string[];
  toc: { id: string; title: string }[];
  bodyHtml: string;
};

const DIR = join(process.cwd(), "content", "blog");

/** All posts, newest first. Posts are JSON files written by scripts/import-blog.mjs. */
export const listPosts = cache((): BlogPost[] =>
  readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as BlogPost)
    .sort((a, b) => b.date.localeCompare(a.date)),
);

export function getPost(slug: string) {
  return listPosts().find((p) => p.slug === slug) ?? null;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Up to three other posts, same category first. */
export function relatedPosts(post: BlogPost) {
  const others = listPosts().filter((p) => p.slug !== post.slug);
  return [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3);
}
