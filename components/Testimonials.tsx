"use client";

import { motion } from "framer-motion";
import { IconStarFilled } from "@tabler/icons-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";
import type { Avis } from "@prisma/client";

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials({ avis }: { avis: Avis[] }) {
  const { dict } = useLanguage();
  const { testimonials } = dict;

  if (avis.length === 0) return null;

  const items = avis.map((a) => ({
    key: a.id,
    name: a.name,
    role: a.company ?? undefined,
    quote: a.quote,
    rating: a.rating,
  }));

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-portal-bg py-28 sm:py-36"
    >
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
            {testimonials.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            {testimonials.title && `${testimonials.title} `}
            <span className="text-gradient">{testimonials.highlight}</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={t.key}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              data-cursor-hover
              className="group flex flex-col rounded-xl border border-portal-border bg-portal-card p-6 transition-colors duration-300 hover:border-portal-accent hover:shadow-[0_16px_40px_rgba(201,168,245,0.15)]"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <IconStarFilled
                    key={s}
                    size={16}
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      s < t.rating ? "text-portal-accent" : "text-portal-border/40"
                    }`}
                    style={{ transitionDelay: `${s * 40}ms` }}
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-base-gray">
                "{t.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-portal-accent/15 font-heading text-sm font-bold text-portal-accent transition-transform duration-300 group-hover:scale-110">
                  {initialsOf(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  {t.role && <p className="text-xs text-base-gray">{t.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
