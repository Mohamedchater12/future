"use client";

import { motion } from "framer-motion";
import AvatarUpload from "@/components/client-space/profil/AvatarUpload";
import ProfileForm from "@/components/client-space/profil/ProfileForm";
import PasswordForm from "@/components/client-space/profil/PasswordForm";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ProfilPage() {
  const { dict } = useClientLanguage();

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold text-white">{dict.profile.title}</h1>
        <p className="mt-1 text-sm text-base-gray">{dict.profile.subtitle}</p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="space-y-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
        >
          <div>
            <h2 className="mb-3 font-heading text-base font-semibold text-white">
              {dict.profile.photoTitle}
            </h2>
            <AvatarUpload />
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="mb-4 font-heading text-base font-semibold text-white">
              {dict.profile.personalInfoTitle}
            </h2>
            <ProfileForm />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
        >
          <h2 className="mb-4 font-heading text-base font-semibold text-white">
            {dict.profile.passwordTitle}
          </h2>
          <PasswordForm />
        </motion.div>
      </div>
    </div>
  );
}
