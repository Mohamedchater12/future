"use client";

import { ReactNode, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { LenisContext } from "@/lib/scroll/LenisContext";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    setLenis(instance);
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // next/font loads with display: swap — the page's true height (and so
    // every ScrollTrigger positioned below the fold) can shift slightly
    // once web fonts actually apply, after ScrollTrigger already measured
    // against the fallback-font layout. Nothing else prompts a re-measure,
    // so triggers far down the page (e.g. WhyUs's CityParallaxBg) can end
    // up permanently offset from where the content actually sits.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      instance.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
