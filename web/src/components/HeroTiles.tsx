"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Home page hero: three tiles that rotate through different athletes, movements and places.
// One tile changes at a time. Visitors who ask for reduced motion see the first set only.

type Shot = { src: string; label: string; alt: string };

const s = (file: string, label: string, alt: string): Shot => ({ src: `/images/home/${file}.jpg`, label, alt });

// Three tiles, each with its own sequence, so the mix of people, movements and places keeps changing.
const TILES: Shot[][] = [
  [
    s("burpee-beach", "Beach", "A woman jumping out of a burpee on a beach at sunrise"),
    s("thruster-box", "Box", "A man pressing a barbell overhead at a CrossFit box"),
    s("airbike-basement", "Basement", "A man riding an air bike in a basement gym"),
    s("wallball-backyard", "Backyard", "A woman throwing a wall ball against a backyard wall"),
    s("ropes-box", "Box", "A wheelchair athlete working battle ropes at a CrossFit box"),
    s("jumprope-driveway", "Driveway", "A man jumping rope on a driveway"),
    s("kb-hotel", "Hotel gym", "A man swinging a kettlebell in a hotel gym"),
    s("handstand-garage", "Garage", "A woman holding a handstand against a garage wall"),
  ],
  [
    s("row-club", "Health club", "A woman rowing on a rowing machine in a health club"),
    s("wallball-gym", "Box", "A woman throwing a wall ball at a CrossFit box"),
    s("lunge-trail", "Park trail", "A man doing walking lunges on a park trail"),
    s("boxjump-gym", "Box", "A woman landing a box jump at a CrossFit box"),
    s("gobletsquat-apartment", "Apartment", "A woman doing a kettlebell goblet squat in her apartment"),
    s("sled-box", "Box", "A man pushing a sled at a CrossFit box"),
    s("thruster-garage", "Garage", "A man pressing a barbell overhead in a garage gym"),
    s("stepup-livingroom", "Living room", "A man doing dumbbell step-ups in his living room"),
  ],
  [
    s("deadlift-garage", "Garage", "A woman locking out a deadlift in a garage gym"),
    s("kb-park", "Park", "A man swinging a kettlebell in a city park"),
    s("squat-hotel", "Hotel room", "A woman doing air squats in a hotel room"),
    s("pullup-rooftop", "Rooftop", "A woman doing a pull-up on a rooftop rig"),
    s("boxjump-backyard", "Backyard", "A woman on a plyo box in a backyard"),
    s("sprint-track", "Track", "A man sprinting on a running track"),
    s("thruster-club", "Hotel gym", "A man pressing dumbbells overhead in a hotel gym"),
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
