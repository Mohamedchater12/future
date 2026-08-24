"use client";

import { signOut } from "next-auth/react";
import { IconLogout } from "@tabler/icons-react";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function ClientLogoutButton({ className }: { className?: string }) {
  const { dict } = useClientLanguage();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/espace-client/connexion" })}
      className={
        className ??
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-base-gray transition-colors hover:bg-white/5 hover:text-white"
      }
    >
      <IconLogout size={18} />
      {dict.logout}
    </button>
  );
}
