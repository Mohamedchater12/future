"use client";

import { IconMenu2 } from "@tabler/icons-react";
import NotificationBell from "@/components/admin/NotificationBell";
import LanguageToggle from "@/components/admin/LanguageToggle";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function AdminTopbar({
  adminName,
  onMenuClick,
}: {
  adminName: string;
  onMenuClick: () => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-base-black px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="text-base-gray hover:text-white lg:hidden"
        aria-label={dict.nav.openMenu}
      >
        <IconMenu2 size={22} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <LanguageToggle />
        <NotificationBell />
        <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/20 font-heading text-xs font-bold text-purple-light">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
