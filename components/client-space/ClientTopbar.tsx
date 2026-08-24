"use client";

import { IconMenu2 } from "@tabler/icons-react";
import ClientNotificationBell from "@/components/client-space/ClientNotificationBell";
import LanguageToggle from "@/components/client-space/LanguageToggle";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { Client } from "@prisma/client";

export default function ClientTopbar({
  user,
  onMenuClick,
}: {
  user: Pick<Client, "id" | "name" | "email" | "avatarUrl">;
  onMenuClick: () => void;
}) {
  const { dict } = useClientLanguage();

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
        <ClientNotificationBell />
        <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-purple/20 font-heading text-xs font-bold text-purple-light">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <span className="hidden text-sm font-medium text-white sm:block">{user.name}</span>
        </div>
      </div>
    </header>
  );
}
