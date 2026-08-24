"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function VisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        visible
          ? "bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25"
          : "bg-white/10 text-base-gray hover:bg-white/15"
      }`}
    >
      {visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
      {visible ? dict.common.visible : dict.common.hidden}
    </button>
  );
}
