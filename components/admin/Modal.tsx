"use client";

import { IconX } from "@tabler/icons-react";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-base-black p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-base-gray hover:text-white"
            aria-label={dict.common.close}
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
