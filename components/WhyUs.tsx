"use client";

import { motion } from "framer-motion";
import { IconRocket, IconReportAnalytics, IconHeartHandshake, type Icon } from "@tabler/icons-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";
import CityParallaxBg from "@/components/CityParallaxBg";

// Positional match with dict.whyUs.reasons — same order in every language.
const REASON_ICONS: Icon[] = [IconRocket, IconReportAnalytics, IconHeartHandshake];

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function WhyUs() {
  const { dict } = useLanguage();
  const { whyUs } = dict;

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-portal-bg py-28 sm:py-36"
    >
      <CityParallaxBg />
      <Starfield />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-portal-border">
            {whyUs.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            {whyUs.title && `${whyUs.title} `}
            <span className="text-gradient">{whyUs.highlight}</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {whyUs.reasons.map((reason, i) => {
            const Icon = REASON_ICONS[i % REASON_ICONS.length];
            return (
              <motion.div
                key={reason.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                custom={i}
                variants={fadeUp}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-portal-border/50 bg-portal-card/40 p-8 text-center backdrop-blur-sm transition-colors duration-300 hover:border-portal-accent/60 sm:items-start sm:text-left"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-5 select-none font-heading text-6xl font-bold text-white/[0.05]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-xl border border-portal-border bg-portal-bg text-portal-accent">
                  <Icon size={26} stroke={1.5} />
                </div>
                <h3 className="relative z-[1] mt-5 font-heading text-xl font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="relative z-[1] mt-3 text-sm leading-relaxed text-base-gray">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
