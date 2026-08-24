"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Same deterministic PRNG as CitySkyline.tsx (About section) — Math.random()
// here would desync server/client hydration since this renders on mount,
// not behind a scroll-triggered reveal.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = {
  left: number;
  width: number;
  height: number;
  shape: "flat" | "spire" | "tiered";
  glowLeft: number;
  glowOpacity: number;
  beacon: boolean;
};

function generateLayer(seed: number, count: number, heightRange: [number, number]): Building[] {
  const rand = mulberry32(seed);
  const buildings: Building[] = [];
  let cursor = -4;
  for (let i = 0; i < count; i++) {
    const width = 5 + rand() * 7;
    const height = heightRange[0] + rand() * (heightRange[1] - heightRange[0]);
    const shape = (["flat", "flat", "spire", "tiered"] as const)[Math.floor(rand() * 4)];
    buildings.push({
      left: cursor,
      width,
      height,
      shape,
      glowLeft: 15 + rand() * 70,
      glowOpacity: 0.25 + rand() * 0.5,
      beacon: rand() > 0.72,
    });
    cursor += width - 0.8 + rand() * 1.5;
  }
  return buildings;
}

function clipPathFor(shape: Building["shape"]) {
  switch (shape) {
    case "spire":
      return "polygon(50% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)";
    case "tiered":
      return "polygon(20% 0%, 80% 0%, 80% 10%, 100% 10%, 100% 100%, 0% 100%, 0% 10%, 20% 10%)";
    default:
      return undefined;
  }
}

function Layer({ buildings, depthClass }: { buildings: Building[]; depthClass: string }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 ${depthClass}`}>
      {buildings.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: `${b.left}%`,
            width: `${b.width}%`,
            height: `${b.height}%`,
            clipPath: clipPathFor(b.shape),
          }}
        >
          <div className="relative h-full w-full bg-gradient-to-t from-[#0a0a10] via-[#0d0a16] to-[#150a24]">
            <span
              className="absolute top-0 h-full w-px bg-purple-light"
              style={{ left: `${b.glowLeft}%`, opacity: b.glowOpacity }}
            />
            {b.beacon && (
              <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-purple-light animate-pulse-glow" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-bleed procedural skyline standing in for a "future-city" background
 * photo (no image asset required — same seeded-PRNG technique as
 * CitySkyline.tsx in the About section, kept self-contained here since
 * that one is tuned for a bottom-anchored strip, not a full-section
 * background). GSAP drives a scroll-linked parallax on the whole group:
 * it drifts vertically slower than the actual scroll (yPercent -25 → 25),
 * stays oversized (scale 1.15) so that drift never exposes an empty edge,
 * and fades toward 0.2 opacity as the section leaves the viewport instead
 * of holding full strength the whole way through.
 *
 * ScrollTrigger.update() is already wired to Lenis's own "scroll" event in
 * SmoothScrollProvider.tsx, globally, once — so the ScrollTrigger instance
 * created here needs no extra Lenis plumbing of its own.
 */
export default function CityParallaxBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const far = useMemo(() => generateLayer(41, 16, [22, 46]), []);
  const mid = useMemo(() => generateLayer(52, 12, [36, 66]), []);
  const near = useMemo(() => generateLayer(63, 9, [50, 88]), []);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;

    let ctx: gsap.Context | undefined;

    // Deferred one frame: Hero's own pinned ScrollTrigger (see Hero.tsx)
    // inserts a pin-spacer that adds real scroll distance below it. If
    // this component measures its own trigger in the same tick as mount,
    // that spacer isn't necessarily reflected yet, and the resulting
    // start/end land short by exactly the pin's distance (permanently —
    // a later ScrollTrigger.refresh() does not correct it, since nothing
    // about the page's measured dimensions changes after the fact). One
    // rAF is enough to measure after everything above has settled.
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.set(group, { scale: 1.15, opacity: 1 });

        // Parallax drift across the section's entire pass-through.
        gsap.fromTo(
          group,
          { yPercent: -25 },
          {
            yPercent: 25,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // Opacity stays at 1 while the section is on screen and only
        // fades toward 0.2 during the actual exit — its own ScrollTrigger
        // window starts later (once the section's bottom edge is already
        // most of the way up the viewport) instead of sharing the full
        // pass-through range above, which faded it out too early.
        gsap.fromTo(
          group,
          { opacity: 1 },
          {
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "bottom 60%",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }, containerRef);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={groupRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a1e] via-[#120c24] to-[#050505]" />
        <div className="absolute inset-x-0 bottom-0 h-full opacity-50">
          <Layer buildings={far} depthClass="h-[55%] opacity-50 blur-[1px]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-full opacity-70">
          <Layer buildings={mid} depthClass="h-[68%] opacity-75" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-full opacity-90">
          <Layer buildings={near} depthClass="h-[82%]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-light/60 to-transparent" />
      </div>
      {/* Same treatment the site already uses over CitySkyline/portal glows —
          keeps foreground text readable over the skyline. */}
      <div className="absolute inset-0 bg-base-black/60" />
    </div>
  );
}
