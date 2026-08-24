"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { buildSwap } from "@/lib/admin/reorder";
import TrustedByTable from "@/components/admin/trustedBy/TrustedByTable";
import TrustedByFormModal from "@/components/admin/trustedBy/TrustedByFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { trustedByTranslations } from "@/lib/i18n/admin/trustedBy";
import type { TrustedBy } from "@prisma/client";

export default function TrustedByPageClient() {
  const { lang } = useAdminLanguage();
  const dict = trustedByTranslations[lang];
  const [editingItem, setEditingItem] = useState<TrustedBy | null | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<TrustedBy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ trustedBy: TrustedBy[] }>(
    "/api/admin/trusted-by",
    fetcher
  );
  const items = data?.trustedBy ?? [];

  async function patchItem(id: string, payload: Partial<TrustedBy>) {
    await fetch(`/api/admin/trusted-by/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async function handleToggleVisible(item: TrustedBy) {
    try {
      await patchItem(item.id, { visible: !item.visible });
      mutate();
    } catch {
      toast.error(dict.toast.visibilityError);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const swap = buildSwap(items, index, direction);
    if (!swap) return;
    try {
      await Promise.all(swap.map((s) => patchItem(s.id, { order: s.order })));
      mutate();
    } catch {
      toast.error(dict.toast.reorderError);
    }
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/trusted-by/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toast.deleted);
      setItemToDelete(null);
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
          onClick={() => setEditingItem(null)}
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
          <TrustedByTable
            items={items}
            onEditClick={(item) => setEditingItem(item)}
            onDeleteClick={(item) => setItemToDelete(item)}
            onToggleVisible={handleToggleVisible}
            onMove={handleMove}
          />
        )}
      </div>

      {editingItem !== undefined && (
        <TrustedByFormModal
          item={editingItem}
          nextOrder={items.length}
          onClose={() => setEditingItem(undefined)}
          onSaved={() => {
            setEditingItem(undefined);
            mutate();
          }}
        />
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        title={dict.confirmDelete.title}
        description={dict.confirmDelete.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
