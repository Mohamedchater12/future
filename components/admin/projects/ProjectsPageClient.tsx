"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { buildSwap } from "@/lib/admin/reorder";
import ProjectsTable from "@/components/admin/projects/ProjectsTable";
import ProjectFormModal from "@/components/admin/projects/ProjectFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { projectsTranslations } from "@/lib/i18n/admin/projects";
import type { Project } from "@prisma/client";

export default function ProjectsPageClient() {
  const { lang } = useAdminLanguage();
  const dict = projectsTranslations[lang];
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ projects: Project[] }>(
    "/api/admin/projects",
    fetcher
  );
  const projects = data?.projects ?? [];

  async function patchProject(id: string, payload: Partial<Project>) {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async function handleToggleVisible(project: Project) {
    try {
      await patchProject(project.id, { visible: !project.visible });
      mutate();
    } catch {
      toast.error(dict.toast.visibilityError);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const swap = buildSwap(projects, index, direction);
    if (!swap) return;
    try {
      await Promise.all(swap.map((item) => patchProject(item.id, { order: item.order })));
      mutate();
    } catch {
      toast.error(dict.toast.reorderError);
    }
  }

  async function handleConfirmDelete() {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toast.deleted);
      setProjectToDelete(null);
      mutate();
    } catch {
      toast.error(dict.toast.deleteError);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">{dict.pageTitle}</h1>
          <p className="mt-1 text-sm text-base-gray">
            {dict.pageSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingProject(null)}
          className="flex items-center gap-2 rounded-full bg-purple px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-deep"
        >
          <IconPlus size={16} />
          {dict.addButton}
        </button>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
            {dict.loading}
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-10 text-center text-sm text-red-300">
            {dict.loadError}{" "}
            <button type="button" onClick={() => mutate()} className="underline">
              {dict.retry}
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <ProjectsTable
            projects={projects}
            onEditClick={(project) => setEditingProject(project)}
            onDeleteClick={(project) => setProjectToDelete(project)}
            onToggleVisible={handleToggleVisible}
            onMove={handleMove}
          />
        )}
      </div>

      {editingProject !== undefined && (
        <ProjectFormModal
          project={editingProject}
          nextOrder={projects.length}
          onClose={() => setEditingProject(undefined)}
          onSaved={() => {
            setEditingProject(undefined);
            mutate();
          }}
        />
      )}

      <ConfirmDialog
        open={!!projectToDelete}
        title={dict.confirmDelete.title}
        description={dict.confirmDelete.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}
