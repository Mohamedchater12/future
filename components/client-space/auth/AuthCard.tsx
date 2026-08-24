"use client";

"use client";

import { motion } from "framer-motion";
import LanguageToggle from "@/components/client-space/LanguageToggle";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { dict } = useClientLanguage();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-black px-6 py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-purple/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-purple/10 blur-[120px]" />

      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong relative z-10 w-full max-w-md rounded-2xl p-8 sm:p-10"
      >
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl font-bold tracking-tight text-white">
            {dict.brand.name}
          </span>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-purple-light">
            {dict.brand.tagline}
          </p>
          <h1 className="mt-5 font-heading text-xl font-semibold text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-base-gray">{subtitle}</p>
        </div>

        {children}

        {footer && <div className="mt-6 text-center text-sm text-base-gray">{footer}</div>}
      </motion.div>
    </div>
  );
}
