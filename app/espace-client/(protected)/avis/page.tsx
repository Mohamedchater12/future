"use client";

import { motion } from "framer-motion";
import { useClientAvis } from "@/lib/client-space/useClientAvis";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import AvisForm from "@/components/client-space/avis/AvisForm";
import AvisList from "@/components/client-space/avis/AvisList";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AvisPage() {
  const { avis, mutate } = useClientAvis();
  const { dict } = useClientLanguage();

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold text-white">{dict.reviews.title}</h1>
        <p className="mt-1 text-sm text-base-gray">{dict.reviews.subtitle}</p>
      </motion.div>

      <motion.div initial="hidden" animate="show" custom={1} variants={fadeUp} className="mt-6">
        <AvisForm onSubmitted={() => mutate()} />
      </motion.div>

      <motion.div initial="hidden" animate="show" custom={2} variants={fadeUp} className="mt-8">
        <h2 className="mb-4 font-heading text-base font-semibold text-white">
          {dict.reviews.yourReviewsTitle}
        </h2>
        <AvisList reviews={avis} />
      </motion.div>
    </div>
  );
}
