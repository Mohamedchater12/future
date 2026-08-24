"use client";

import Link from "next/link";
import { IconClipboardList, IconMessageCircle, IconStarFilled, type Icon } from "@tabler/icons-react";
import { formatRelativeTime } from "@/lib/client-space/formatRelativeTime";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { ClientNotification } from "@/lib/client-space/dashboard";

const NOTIFICATION_ICONS: Record<ClientNotification["type"], Icon> = {
  mission: IconClipboardList,
  message: IconMessageCircle,
  avis: IconStarFilled,
};

export default function RecentNotifications({
  items,
  onItemClick,
}: {
  items: ClientNotification[];
  onItemClick?: () => void;
}) {
  const { dict, lang } = useClientLanguage();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="font-heading text-base font-semibold text-white">
        {dict.dashboard.recentNotificationsTitle}
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-base-gray">{dict.dashboard.noNotifications}</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {items.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type];
            return (
              <li key={notification.id}>
                <Link
                  href={notification.href}
                  onClick={() => onItemClick?.()}
                  className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/5"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple-light">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{notification.message}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap text-xs text-base-gray">
                      {formatRelativeTime(new Date(notification.date), lang)}
                    </span>
                    {!notification.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-purple-light" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
