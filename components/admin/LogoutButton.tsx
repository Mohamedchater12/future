"use client";

import { signOut } from "next-auth/react";
import { IconLogout } from "@tabler/icons-react";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function LogoutButton({ className }: { className?: string }) {
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      data-cursor-hover
      className={
        className ??
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-base-gray transition-colors hover:bg-white/5 hover:text-white"
      }
    >
      <IconLogout size={18} />
      {dict.logout}
    </button>
  );
}
