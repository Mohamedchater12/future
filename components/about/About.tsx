"use client";

import { motion } from "framer-motion";
import type { Stat } from "@prisma/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";
import AboutBackground from "./AboutBackground";
import StatTile from "./StatTile";

const fadeUp = {
  hidden: { opacity: 0, y: 48, scale: 0.96, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About({ stats }: { stats: Stat[] }) {
  const { dict } = useLanguage();
  const { about } = dict;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-base-black py-28 sm:py-36"
    >
      {/* Background accents */}
      <AboutBackground />
      <Starfield />
      <div className="pointer-events-none absolute inset-0 bg-grid-mesh bg-grid opacity-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-deep/20 blur-[140px]" />

      {/* Portal afterglow — a bright violet bloom that rises in sync with
          Hero's own flash fading out (driven by Hero.tsx's unpin
          ScrollTrigger via #about-afterglow), so the two read as one
          continuous crossfade rather than two independent animations
          that happen to be near each other. Opacity starts at 0 here;
          GSAP owns it entirely from that point on. */}
      <div
        id="about-afterglow"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[60vh] opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(216,180,254,0.4), rgba(124,58,237,0.15) 45%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div
          className={`grid grid-cols-1 items-center gap-14 lg:gap-10 ${
            stats.length > 0 ? "lg:grid-cols-[1.15fr_0.85fr]" : "lg:grid-cols-1"
          }`}
        >
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left"
          >
            <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-base-gray">
              {about.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.7)] sm:text-5xl">
              {about.title}{" "}
              <span className="text-gradient">{about.highlight}</span>
            </h2>
            <p className="mt-6 text-base text-base-gray [text-shadow:0_2px_12px_rgba(0,0,0,0.8)] sm:text-lg lg:max-w-md">
              {about.description}
            </p>
          </motion.div>

          {/* Stats — a glass-tile grid with hairline dividers rather than
              bare centered numbers, closer to a dashboard readout. Values
              come from the database (managed in /admin/stats); the grid
              disappears entirely (see lg:grid-cols-1 above) if there are
              none, rather than showing an empty box. */}
          {stats.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              custom={1}
              variants={fadeUp}
              className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-portal-border/30 bg-portal-border/25 shadow-[0_20px_60px_rgba(109,40,217,0.15)]"
            >
              {stats.map((stat) => (
                <StatTile key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
