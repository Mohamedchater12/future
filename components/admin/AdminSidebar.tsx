"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getAdminNavLinks } from "@/components/admin/navLinks";
import LogoutButton from "@/components/admin/LogoutButton";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];
  const navLinks = getAdminNavLinks(dict);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/10 bg-base-black transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/admin/dashboard" className="font-heading text-xl font-bold tracking-tight text-white">
            {dict.brand}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-base-gray hover:text-white lg:hidden"
            aria-label={dict.nav.closeMenu}
          >
            <IconX size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple/15 text-white"
                    : "text-base-gray hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} className={isActive ? "text-purple-light" : ""} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
