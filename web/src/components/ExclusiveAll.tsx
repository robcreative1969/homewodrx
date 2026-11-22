"use client";

import { useEffect } from "react";

/**
 * Makes an "all" checkbox (Full Body) and the specific choices beside it exclusive:
 * ticking a specific area unticks "all", ticking "all" clears the rest, and clearing
 * everything ticks "all" again. Without JavaScript the server still treats "all" plus
 * specific areas as the specific areas.
 */
export function ExclusiveAll({ name, all }: { name: string; all: string }) {
  useEffect(() => {
    const boxes = () => [...document.querySelectorAll<HTMLInputElement>(`input[type=checkbox][name="${name}"]`)];
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t.type !== "checkbox" || t.name !== name) return;
      const list = boxes();
      if (t.value === all && t.checked) list.forEach((b) => b !== t && (b.checked = false));
      else if (t.checked) list.forEach((b) => b.value === all && (b.checked = false));
      if (!list.some((b) => b.checked)) list.forEach((b) => b.value === all && (b.checked = true));
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [name, all]);
  return null;
}
