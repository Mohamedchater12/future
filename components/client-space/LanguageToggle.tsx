"use client";

import { IconLanguage } from "@tabler/icons-react";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang } = useClientLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={
        className ??
        "flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-base-gray transition-colors hover:bg-white/5 hover:text-white"
      }
      aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      <IconLanguage size={15} />
      {lang === "en" ? "العربية" : "English"}
    </button>
  );
}
