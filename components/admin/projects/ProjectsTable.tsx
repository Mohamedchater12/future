"use client";

import { IconTrash, IconPencil, IconChevronUp, IconChevronDown, IconPhoto } from "@tabler/icons-react";
import VisibilityToggle from "@/components/admin/VisibilityToggle";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { projectsTranslations } from "@/lib/i18n/admin/projects";
import type { Project } from "@prisma/client";

export default function ProjectsTable({
  projects,
  onEditClick,
  onDeleteClick,
  onToggleVisible,
  onMove,
}: {
  projects: Project[];
  onEditClick: (project: Project) => void;
  onDeleteClick: (project: Project) => void;
  onToggleVisible: (project: Project) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = projectsTranslations[lang];

  function titleFor(p: Project) {
    return lang === "ar" ? (p as any).title_ar ?? (p as any).title_en ?? p.title : (p as any).title_en ?? p.title;
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
        {dict.table.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wide text-base-gray">
            <th className="px-4 py-3 font-medium">{dict.table.order}</th>
            <th className="px-4 py-3 font-medium">{dict.table.project}</th>
            <th className="px-4 py-3 font-medium">{dict.table.result}</th>
            <th className="px-4 py-3 font-medium">{dict.table.status}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.id}
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
                    disabled={index === projects.length - 1}
                    className="text-base-gray hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={dict.table.moveDownAria}
                  >
                    <IconChevronDown size={14} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-purple/15 text-purple-light">
                    {project.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <IconPhoto size={18} stroke={1.5} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{titleFor(project)}</p>
                    <p className="max-w-xs truncate text-xs text-base-gray">{project.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-white">{project.stat}</td>
              <td className="px-4 py-3">
                <VisibilityToggle
                  visible={project.visible}
                  onToggle={() => onToggleVisible(project)}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEditClick(project)}
                    className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={dict.table.editAria}
                  >
                    <IconPencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClick(project)}
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
