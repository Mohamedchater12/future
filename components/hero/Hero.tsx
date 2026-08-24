"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { IconArrowRight } from "@tabler/icons-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useLenis } from "@/lib/scroll/LenisContext";
import { cn } from "@/lib/utils";
import Starfield from "@/components/Starfield";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
// A triangular envelope: 0 outside [start, end], ramping up to 1 at `peak`.
const bandEnvelope = (p: number, start: number, peak: number, end: number) => {
  if (p <= start || p >= end) return 0;
  if (p < peak) return (p - start) / (peak - start);
  return 1 - (p - peak) / (end - peak);
};

export default function Hero() {
  const { dict, isRTL } = useLanguage();
  const lenis = useLenis();
  const headline = dict.hero.headline.split(" ");

  const sectionRef = useRef<HTMLElement>(null);
  const shakeWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const gateProgressRef = useRef(0);
  const gateShakeRef = useRef(0);

  // A gentle, page-wide parallax on the 3D scene's own container — fully
  // separate from the GSAP ScrollTrigger pin above. Deliberately NOT
  // scoped to sectionRef: that element is what GSAP pins (holding its
  // own `transform: translate3d(...)` on it for the whole pin duration),
  // so an element-relative scroll progress there would read as frozen
  // for that entire stretch. Tracking whole-page scroll instead sidesteps
  // that conflict and matches "moves throughout the home scroll", not
  // just within the hero. shakeWrapperRef (the rumble jitter) and this
  // scene container are two different DOM nodes, so neither transform
  // fights with GSAP's or with each other's.
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  });
  const parallaxY = useTransform(smoothScrollProgress, [0, 1], [0, -150]);
  const parallaxScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.15]);
  const sceneY = prefersReducedMotion ? 0 : parallaxY;
  const sceneScale = prefersReducedMotion ? 1 : parallaxScale;

  // Scrollytelling: the hero pins in place for a stretch of scroll distance
  // while `progress` (0-1) climbs — the visitor drives the pace by hand.
  // It powers the gate's camera dolly/grow (via gateProgressRef, read every
  // R3F frame in HeroGate/HeroScene), a rumble band near the start (via
  // gateShakeRef), and a flash that washes the screen out near the end.
  // Once progress reaches 1 the section unpins and About simply continues
  // underneath — no manual jump or redirect needed.
  useEffect(() => {
    if (!lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Scoped with gsap.context() (same pattern as CitySkyline.tsx) so
    // ctx.revert() tears down every ScrollTrigger/pin/tween created here
    // in one go. Plain manual .kill() calls are not reliably enough on
    // their own under React StrictMode's mount→cleanup→mount double-fire
    // in dev, or across repeated Fast Refreshes while iterating — a pin
    // left half-torn-down can leave the page unable to scroll at all.
    // Defensive: if a previous Fast Refresh pass left a stale pin behind
    // on this same trigger element (its own cleanup didn't get to run
    // before the module was swapped), clear it before setting up a new
    // one rather than stacking a second pin on top of it.
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === sectionRef.current) st.kill();
    });

    const ctx = gsap.context(() => {
      // Faded as a single wrapper (not per-child) so this scroll-driven
      // opacity/transform write never fights the children's own
      // Framer Motion mount-in animations over the same style properties —
      // two engines each fully owning a different DOM node, not racing
      // on the same one.
      const contentEls = [contentRef.current, scrollHintRef.current].filter(
        (el): el is HTMLDivElement => el !== null
      );

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=180%",
        // Lenis already smooths the raw scroll input — adding GSAP's own
        // scrub inertia on top would double-smooth it. scrub:true maps
        // progress 1:1 to the (already-smoothed) scroll position instead.
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress;
          gateProgressRef.current = p;

          const fade = 1 - smoothstep(0, 0.15, p);
          contentEls.forEach((el) => {
            el.style.opacity = String(fade);
            el.style.transform = `translateY(${(1 - fade) * -40}px)`;
          });

          // The gate rumbles as the approach begins, then settles while
          // the portal keeps opening underneath it.
          const shakeAmt = bandEnvelope(p, 0.03, 0.09, 0.22);
          gateShakeRef.current = shakeAmt;
          if (shakeWrapperRef.current) {
            shakeWrapperRef.current.style.transform =
              shakeAmt > 0.001
                ? `translate(${(Math.random() - 0.5) * 14 * shakeAmt}px, ${(Math.random() - 0.5) * 8 * shakeAmt}px)`
                : "";
          }

          // Scroll-driven fade to full white by the time progress hits 1.
          gsap.set(flashRef.current, { opacity: smoothstep(0.75, 1, p) });
        },
      });

      // Because `pin: true` reserves space equal to the section's own
      // height *plus* the scroll distance above, there's a further
      // stretch — exactly one section-height long — after progress hits
      // 1 where the (now unpinned) hero is simply sliding out of view
      // before About arrives underneath. Fade the flash back out across
      // that exact stretch (scroll-driven, not timed) so it always
      // finishes precisely as About comes into place, no matter how
      // fast the visitor scrolls.
      //
      // Hero's flash is clipped to Hero's own box (overflow-hidden), so
      // fading it out in isolation leaves a hard edge right where About
      // begins — the white light just stops instead of dissolving into
      // what's next. To read as one continuous crossfade instead of two
      // unrelated animations meeting by coincidence, this same progress
      // also drives About's own violet afterglow (#about-afterglow,
      // in About.tsx) blooming in at the exact rate the flash fades —
      // handing off the light across the seam rather than cutting it.
      ScrollTrigger.create({
        start: () => trigger.end,
        end: () => trigger.end + (sectionRef.current?.offsetHeight ?? window.innerHeight),
        scrub: true,
        onUpdate: (self) => {
          gsap.set(flashRef.current, { opacity: 1 - self.progress });
          gsap.set("#about-afterglow", { opacity: self.progress });
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      // ctx.revert() undoes gsap-managed state, but the shake jitter is
      // applied via a plain style write (not gsap.set), so reset it too.
      if (shakeWrapperRef.current) shakeWrapperRef.current.style.transform = "";
    };
  }, [lenis]);

  return (
    <>
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100svh] w-full overflow-hidden bg-base-black"
    >
      <div ref={shakeWrapperRef} className="absolute inset-0">
        {/* Background layers */}
        <Starfield />
        <div className="pointer-events-none absolute inset-0 bg-aurora-gradient" />
        <div className="pointer-events-none absolute inset-0 bg-grid-mesh bg-grid opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-purple-deep/30 blur-[120px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-purple-light/20 blur-[120px] animate-pulse-glow" />

        {/* 3D Scene — the magic gate. z-10 keeps it above the background
            layers but below the text (z-20). The motion.div below adds a
            soft parallax (translateY + slight scale) driven by whole-page
            scroll progress, rendered as a GPU-composited transform by
            Framer Motion — independent of the GSAP-driven portal zoom
            inside HeroGate, which only activates within the pinned
            stretch further down. */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ y: sceneY, scale: sceneScale, willChange: "transform" }}
        >
          <HeroScene progressRef={gateProgressRef} shakeRef={gateShakeRef} />
        </motion.div>

        {/* Content — pinned to the upper-left, clear of the centered gate */}
        <div
          ref={contentRef}
          className="absolute left-10 top-[28%] z-20 max-w-xs text-left sm:left-16 sm:max-w-sm lg:left-28 lg:top-[32%] lg:max-w-md"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 block font-heading text-xs font-semibold uppercase text-white/40"
            style={{ letterSpacing: "0.4em" }}
          >
            Future
          </motion.span>

          <h1
            className={cn(
              "font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl xl:tracking-[-0.02em]",
              isRTL &&
                "font-arabic text-[clamp(4rem,8vw,11rem)] leading-[0.8] tracking-[-0.06em] [text-shadow:0_0_22px_rgba(216,180,254,0.45)]"
            )}
          >
            {headline.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  "me-3 inline-block text-gradient last:me-0",
                  isRTL && "me-0 inline-block"
                )}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-sm text-base-gray sm:text-base"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <a
              href="#contact"
              data-cursor-hover
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-105"
            >
              {dict.nav.talk}
              <IconArrowRight
                size={18}
                className={cn(
                  "transition-transform duration-300 group-hover:translate-x-1",
                  isRTL && "rotate-180"
                )}
              />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          ref={scrollHintRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col items-end gap-2 sm:right-12 lg:right-20"
        >
          <span className="text-right text-[10px] uppercase tracking-[0.2em] text-base-gray">
            {dict.hero.scroll}
          </span>
          <div className="h-10 w-px overflow-hidden bg-white/10">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-b from-purple-light to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>

      {/* Gate flash — the moment of passing through. Rendered as a
          sibling of the section (not nested inside it) so GSAP's own
          pin transform on the section — even an identity matrix, which
          still establishes a CSS containing block — can't trap this
          `fixed` element into behaving like `absolute` relative to
          Hero's box. That trap was the actual cause of a hard seam at
          Hero's bottom edge during the unpin stretch: the flash's
          rendered rect was silently matching Hero's own (scrolling)
          rect instead of the true viewport. As a genuine sibling, its
          `fixed` positioning resolves against the viewport as intended,
          so it covers the whole screen and dissolves smoothly across
          the Hero/About boundary instead of cutting off at it. */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-30 opacity-0"
        style={{
          background:
            "radial-gradient(circle, #ffffff 0%, #c9a8f5 35%, #3d0f8a 60%, #050505 100%)",
        }}
      />
    </>
  );
}
