"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { buildSwap } from "@/lib/admin/reorder";
import ToolsTable from "@/components/admin/tools/ToolsTable";
import ToolFormModal from "@/components/admin/tools/ToolFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { toolsTranslations } from "@/lib/i18n/admin/tools";
import type { Tool } from "@prisma/client";

export default function ToolsPageClient() {
  const { lang } = useAdminLanguage();
  const dict = toolsTranslations[lang];

  const [editingTool, setEditingTool] = useState<Tool | null | undefined>(undefined);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ tools: Tool[] }>(
    "/api/admin/tools",
    fetcher
  );
  const tools = data?.tools ?? [];

  async function patchTool(id: string, payload: Partial<Tool>) {
    await fetch(`/api/admin/tools/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async function handleToggleVisible(tool: Tool) {
    try {
      await patchTool(tool.id, { visible: !tool.visible });
      mutate();
    } catch {
      toast.error(dict.toast.visibilityError);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const swap = buildSwap(tools, index, direction);
    if (!swap) return;
    try {
      await Promise.all(swap.map((s) => patchTool(s.id, { order: s.order })));
      mutate();
    } catch {
      toast.error(dict.toast.reorderError);
    }
  }

  async function handleConfirmDelete() {
    if (!toolToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/tools/${toolToDelete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toast.deleted);
      setToolToDelete(null);
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
          onClick={() => setEditingTool(null)}
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
          <ToolsTable
            tools={tools}
            onEditClick={(tool) => setEditingTool(tool)}
            onDeleteClick={(tool) => setToolToDelete(tool)}
            onToggleVisible={handleToggleVisible}
            onMove={handleMove}
          />
        )}
      </div>

      {editingTool !== undefined && (
        <ToolFormModal
          tool={editingTool}
          nextOrder={tools.length}
          onClose={() => setEditingTool(undefined)}
          onSaved={() => {
            setEditingTool(undefined);
            mutate();
          }}
        />
      )}

      <ConfirmDialog
        open={!!toolToDelete}
        title={dict.confirmDelete.title}
        description={dict.confirmDelete.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToolToDelete(null)}
      />
    </div>
  );
}
