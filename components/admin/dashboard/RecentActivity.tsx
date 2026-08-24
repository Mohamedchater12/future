"use client";

import Link from "next/link";
import { IconInbox, IconUserPlus } from "@tabler/icons-react";
import type { ActivityItem } from "@/lib/dashboard";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { dashboardTranslations } from "@/lib/i18n/admin/dashboard";

export default function RecentActivity({ items }: { items: ActivityItem[] }) {
  const { lang } = useAdminLanguage();
  const dict = dashboardTranslations[lang];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="font-heading text-base font-semibold text-white">{dict.activity.title}</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-base-gray">{dict.activity.empty}</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {items.map((item) => {
            const Icon = item.type === "demande" ? IconInbox : IconUserPlus;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/5"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple-light">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{item.title}</p>
                    {item.subtitle && (
                      <p className="truncate text-xs text-base-gray">{item.subtitle}</p>
                    )}
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-xs text-base-gray">
                    {formatRelativeTime(new Date(item.date), lang)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
