"use client";

import { IconTrash, IconPencil, IconChevronUp, IconChevronDown, IconChartBar } from "@tabler/icons-react";
import VisibilityToggle from "@/components/admin/VisibilityToggle";
import { STAT_ICON_MAP } from "@/lib/statIcons";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { statsTranslations } from "@/lib/i18n/admin/stats";
import type { Stat } from "@prisma/client";

export default function StatsTable({
  items,
  onEditClick,
  onDeleteClick,
  onToggleVisible,
  onMove,
}: {
  items: Stat[];
  onEditClick: (item: Stat) => void;
  onDeleteClick: (item: Stat) => void;
  onToggleVisible: (item: Stat) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = statsTranslations[lang];

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
        {dict.table.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wide text-base-gray">
            <th className="px-4 py-3 font-medium">{dict.table.order}</th>
            <th className="px-4 py-3 font-medium">{dict.table.value}</th>
            <th className="px-4 py-3 font-medium">{dict.table.label}</th>
            <th className="px-4 py-3 font-medium">{dict.table.status}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const Icon = (item.icon && STAT_ICON_MAP[item.icon]) || IconChartBar;
            return (
              <tr
                key={item.id}
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => onMove(index, "up")}
                      disabled={index === 0}
                      className="text-base-gray hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={dict.table.moveUpAria}
                    >
                      <IconChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(index, "down")}
                      disabled={index === items.length - 1}
                      className="text-base-gray hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={dict.table.moveDownAria}
                    >
                      <IconChevronDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-purple-light">
                      <Icon size={18} />
                    </div>
                    <p className="font-heading font-semibold text-white">
                      {item.value}
                      {item.suffix}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-base-gray">{item.label}</td>
                <td className="px-4 py-3">
                  <VisibilityToggle visible={item.visible} onToggle={() => onToggleVisible(item)} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditClick(item)}
                      className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-white/10 hover:text-white"
                      aria-label={dict.table.editAria}
                    >
                      <IconPencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClick(item)}
                      className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-red-400/10 hover:text-red-400"
                      aria-label={dict.table.deleteAria}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
