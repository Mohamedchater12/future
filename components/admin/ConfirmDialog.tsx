"use client";

import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  isConfirming,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-base-black p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/15 text-red-400">
          <IconAlertTriangle size={20} />
        </div>
        <h2 className="mt-4 font-heading text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-base-gray">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
          >
            {dict.common.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming && <IconLoader2 size={14} className="animate-spin" />}
            {confirmLabel ?? dict.common.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
