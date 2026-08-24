"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Real skyline photo standing in behind the About section (replaces the
 * procedural CitySkyline strip). Two motions layered on top of each other
 * make it read as alive rather than a static photo:
 *  - a slow CSS "Ken Burns" zoom/pan loop (animate-ken-burns, tailwind.config.ts)
 *    that never stops, independent of scroll — this is what gives the
 *    "video, not a still frame" feel.
 *  - a GSAP scroll-scrubbed vertical drift, same technique as
 *    CityParallaxBg.tsx in WhyUs, so depth reacts to scroll too.
 * Both respect prefers-reduced-motion globally via globals.css.
 */
export default function AboutBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        group,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div ref={groupRef} className="absolute inset-0">
        <Image
          src="/images/about-bg-city.png"
          alt=""
          fill
          sizes="100vw"
          quality={70}
          className="animate-ken-burns object-cover object-center"
        />

        
      </div>

      {/* Lighter than CitySkyline/CityParallaxBg's overlay — this photo is
          the point, so most of it stays untouched. Darkening is targeted
          only where text actually sits: top-down on mobile (header block
          stacks above the stats grid there), left-to-right on desktop
          (header column sits to the left of the stats column). */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-black via-transparent to-base-black" />
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.55) 40%, rgba(5,5,5,0.15) 58%, rgba(5,5,5,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.3) 60%, rgba(5,5,5,0) 82%)",
        }}
      />
      <div className="absolute inset-0 bg-base-black/10" />
    </div>
  );
}
