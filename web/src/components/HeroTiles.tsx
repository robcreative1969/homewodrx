"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Home page hero: three tiles that rotate through different athletes, movements and places.
// One tile changes at a time. Visitors who ask for reduced motion see the first set only.

type Shot = { src: string; label: string; alt: string };

const s = (file: string, label: string, alt: string): Shot => ({ src: `/images/home/${file}.jpg`, label, alt });

// Each column of the arrays is one moment; every moment shows three different people.
const TILES: Shot[][] = [
  [
    s("thruster-box", "Box", "An athlete pressing a barbell overhead at a CrossFit box"),
    s("boxjump-gym", "Box", "An athlete landing a box jump at a CrossFit box"),
    s("kb-park", "Park", "An athlete swinging a kettlebell in a city park"),
    s("wallball-gym", "Box", "An athlete throwing a wall ball at a CrossFit box"),
  ],
  [
    s("wallball-garage", "Garage", "An athlete throwing a wall ball in a garage gym"),
    s("thruster-club", "Health club", "An athlete pressing dumbbells overhead in a health club"),
    s("boxjump-backyard", "Backyard", "An athlete on a plyo box in a backyard"),
    s("kb-hotel", "Hotel gym", "An athlete swinging a kettlebell in a hotel gym"),
  ],
  [
    s("kb-basement", "Basement", "An athlete swinging a kettlebell in a basement gym"),
    s("wallball-backyard", "Backyard", "An athlete throwing a wall ball against a backyard wall"),
    s("thruster-garage", "Garage", "An athlete pressing a barbell overhead in a garage gym"),
    s("boxjump-garage", "Garage", "An athlete on a plyo box in a garage gym"),
  ],
];

const STEP_MS = 2600;

export function HeroTiles() {
  const [idx, setIdx] = useState([0, 0, 0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tick = 0;
    const t = window.setInterval(() => {
      const tile = tick % TILES.length;
      tick += 1;
      setIdx((cur) => cur.map((v, i) => (i === tile ? (v + 1) % TILES[i].length : v)));
    }, STEP_MS);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {TILES.map((shots, ti) => (
        <div key={ti} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-muted">
          {shots.map((shot, si) => {
            const n = shots.length;
            const on = si === idx[ti];
            // Keep only the current, previous (fading out) and next (preloading) shots in the page.
            if (!on && si !== (idx[ti] + 1) % n && si !== (idx[ti] + n - 1) % n) return null;
            return (
              <figure
                key={shot.src}
                aria-hidden={!on}
                className={`absolute inset-0 m-0 transition-opacity duration-700 ease-in-out ${on ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={shot.src}
                  alt={on ? shot.alt : ""}
                  fill
                  priority={si === 0}
                  loading={si === 0 ? undefined : "eager"}
                  sizes="(min-width: 1024px) 330px, 33vw"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 font-mono text-[10px] font-bold tracking-wider whitespace-nowrap text-white uppercase sm:bottom-3 sm:left-3 sm:text-xs">
                  {shot.label}
                </figcaption>
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}
