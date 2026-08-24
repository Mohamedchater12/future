"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { IconBell, IconChecks } from "@tabler/icons-react";
import { useNotifications } from "@/lib/admin/useNotifications";
import { NOTIFICATION_ICONS } from "@/lib/admin/notificationMeta";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";
import type { Notification } from "@prisma/client";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, isLoading, mutate } = useNotifications(8);
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAllRead() {
    try {
      await fetch("/api/admin/notifications/mark-all-read", { method: "POST" });
      mutate();
    } catch {
      toast.error(dict.notifications.markReadError);
    }
  }

  async function handleNotificationClick(notification: Notification) {
    setIsOpen(false);
    if (!notification.read) {
      await fetch(`/api/admin/notifications/${notification.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      mutate();
    }
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
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-purple px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-base-black shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">{dict.notifications.title}</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-purple-light hover:text-white"
              >
                <IconChecks size={14} />
                {dict.notifications.markAllRead}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <p className="p-4 text-center text-sm text-base-gray">{dict.notifications.loading}</p>
            )}

            {!isLoading && notifications.length === 0 && (
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
                      {formatRelativeTime(new Date(notification.createdAt), lang)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-light" />
                  )}
                </div>
              );

              return notification.link ? (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
