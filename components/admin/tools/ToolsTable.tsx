"use client";

import Image from "next/image";
import { IconTrash, IconPencil, IconChevronUp, IconChevronDown, IconTool } from "@tabler/icons-react";
import Badge from "@/components/admin/Badge";
import VisibilityToggle from "@/components/admin/VisibilityToggle";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { toolsTranslations } from "@/lib/i18n/admin/tools";
import { getToolCategoryLabels, type ToolCategory } from "@/lib/admin/toolCategories";
import type { Tool } from "@prisma/client";

export default function ToolsTable({
  tools,
  onEditClick,
  onDeleteClick,
  onToggleVisible,
  onMove,
}: {
  tools: Tool[];
  onEditClick: (tool: Tool) => void;
  onDeleteClick: (tool: Tool) => void;
  onToggleVisible: (tool: Tool) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = toolsTranslations[lang];
  const categoryLabels = getToolCategoryLabels(dict);

  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
        {dict.table.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wide text-base-gray">
            <th className="px-4 py-3 font-medium">{dict.table.order}</th>
            <th className="px-4 py-3 font-medium">{dict.table.tool}</th>
            <th className="px-4 py-3 font-medium">{dict.table.category}</th>
            <th className="px-4 py-3 font-medium">{dict.table.status}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, index) => (
            <tr
              key={tool.id}
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
                    disabled={index === tools.length - 1}
                    className="text-base-gray hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={dict.table.moveDownAria}
                  >
                    <IconChevronDown size={14} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.05]">
                    {tool.iconUrl ? (
                      <Image src={tool.iconUrl} alt="" width={36} height={36} className="h-full w-full object-contain" />
                    ) : (
                      <IconTool size={18} className="text-purple-light" />
                    )}
                  </div>
                  <p className="font-medium text-white">{tool.name}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge className="bg-white/10 text-base-gray">
                  {categoryLabels[tool.category as ToolCategory] ?? tool.category}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <VisibilityToggle visible={tool.visible} onToggle={() => onToggleVisible(tool)} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEditClick(tool)}
                    className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={dict.table.editAria}
                  >
                    <IconPencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClick(tool)}
                    className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-red-400/10 hover:text-red-400"
                    aria-label={dict.table.deleteAria}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
