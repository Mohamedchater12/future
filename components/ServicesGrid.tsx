"use client";

import { motion } from "framer-motion";
import { IconBriefcase } from "@tabler/icons-react";
import type { Service } from "@prisma/client";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SERVICE_ICON_MAP } from "@/lib/serviceIcons";
import { useSpotlight } from "@/lib/useSpotlight";
import Starfield from "@/components/Starfield";

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ServiceCard({
  service,
  i,
  href,
}: {
  service: Service;
  i: number;
  href: string;
}) {
  const Icon = SERVICE_ICON_MAP[service.icon] ?? IconBriefcase;
  const { ref, onMouseMove } = useSpotlight<HTMLAnchorElement>();

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMouseMove}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      custom={i}
      variants={fadeUp}
      className="spotlight group relative flex flex-col overflow-hidden rounded-xl border border-portal-border bg-base-black p-6 transition-all duration-300 hover:-translate-y-1 hover:border-portal-accent hover:bg-purple-deep/20 hover:shadow-[0_16px_40px_rgba(201,168,245,0.15)]"
    >
      <div className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-lg bg-portal-bg text-portal-accent transition-colors duration-300 group-hover:bg-purple-light/20">
        <Icon size={22} stroke={1.5} />
      </div>

      <h3 className="relative z-[1] mt-5 font-heading text-lg font-semibold text-white">
        {service.title}
      </h3>

      <p className="relative z-[1] mt-3 text-sm leading-relaxed text-base-gray">
        {service.description}
      </p>
    </motion.a>
  );
}

export default function ServicesGrid({ services }: { services: Service[] }) {
  const { dict } = useLanguage();
  const { services: servicesDict } = dict;

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-portal-bg py-28 sm:py-36"
    >
      <Starfield />
      <div className="pointer-events-none absolute inset-0 bg-grid-mesh bg-grid opacity-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

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
            {servicesDict.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            {servicesDict.title && `${servicesDict.title} `}
            <span className="text-gradient">{servicesDict.highlight}</span>
          </h2>
          <p className="mt-6 text-base text-base-gray sm:text-lg">
            {servicesDict.subtitle}
          </p>
        </motion.div>

        {services.length === 0 ? (
          <p className="mt-16 text-center text-sm text-base-gray">
            Les services seront bientôt disponibles.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => {
              const href = getWhatsAppLink(
                servicesDict.whatsappTemplate.replace("{service}", service.title)
              );

              return (
                <ServiceCard key={service.id} service={service} i={i} href={href} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
