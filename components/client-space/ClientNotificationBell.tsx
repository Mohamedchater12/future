"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconBell,
  IconChecks,
  IconClipboardList,
  IconMessageCircle,
  IconStarFilled,
  type Icon,
} from "@tabler/icons-react";
import { useClientSummary } from "@/lib/client-space/useClientSummary";
import { formatRelativeTime } from "@/lib/client-space/formatRelativeTime";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { ClientNotification } from "@/lib/client-space/dashboard";

const NOTIFICATION_ICONS: Record<ClientNotification["type"], Icon> = {
  mission: IconClipboardList,
  message: IconMessageCircle,
  avis: IconStarFilled,
};

export default function ClientNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { summary, mutate } = useClientSummary();
  const { dict, lang } = useClientLanguage();
  const notifications = summary?.notifications ?? [];
  const unreadNotificationsCount = summary?.unreadNotificationsCount ?? 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markSeen() {
    await fetch("/api/client/notifications/mark-seen", { method: "POST" });
    mutate();
  }

  function handleNotificationClick() {
    setIsOpen(false);
    markSeen();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-base-gray transition-colors hover:bg-white/5 hover:text-white"
        aria-label={dict.notifications.ariaLabel}
      >
        <IconBell size={20} />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-purple px-1 text-[10px] font-semibold text-white">
            {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] rounded-xl border border-white/10 bg-base-black shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">{dict.notifications.title}</p>
            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markSeen}
                className="flex items-center gap-1.5 text-xs text-purple-light hover:text-white"
              >
                <IconChecks size={14} />
                {dict.notifications.markAllRead}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-base-gray">{dict.notifications.empty}</p>
            )}

            {notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type];
              const content = (
                <div
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${
                    !notification.read ? "bg-purple/5" : ""
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple-light">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="mt-0.5 text-xs text-base-gray">
                      {formatRelativeTime(new Date(notification.date), lang)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-light" />
                  )}
                </div>
              );

              return (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={handleNotificationClick}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
