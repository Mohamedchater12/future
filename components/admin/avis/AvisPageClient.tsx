"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { avisStatusValues } from "@/lib/validations/avis";
import { getAvisStatusLabels } from "@/lib/admin/avisStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { avisTranslations } from "@/lib/i18n/admin/avis";
import AvisTable from "@/components/admin/avis/AvisTable";
import AvisFormModal from "@/components/admin/avis/AvisFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { AvisWithClient } from "@/types/admin";

const STATUS_FILTERS = ["TOUS", ...avisStatusValues] as const;

export default function AvisPageClient() {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("TOUS");
  const [editingAvis, setEditingAvis] = useState<AvisWithClient | null | undefined>(undefined);
  const [avisToDelete, setAvisToDelete] = useState<AvisWithClient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = avisTranslations[lang];
  const statusLabels = getAvisStatusLabels(dict);

  const query = statusFilter === "TOUS" ? "" : `?status=${statusFilter}`;
  const { data, error, isLoading, mutate } = useSWR<{ avis: AvisWithClient[] }>(
    `/api/admin/avis${query}`,
    fetcher
  );
  const avis = data?.avis ?? [];

  async function handleToggleFeatured(item: AvisWithClient) {
    try {
      await fetch(`/api/admin/avis/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !item.featured }),
      });
      mutate();
    } catch {
      toast.error(dict.toast.toggleFeaturedError);
    }
  }

  async function handleConfirmDelete() {
    if (!avisToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/avis/${avisToDelete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toast.deleted);
      setAvisToDelete(null);
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

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status} className="bg-base-black">
                {status === "TOUS" ? dict.statusAll : statusLabels[status]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setEditingAvis(null)}
            className="flex items-center gap-2 rounded-full bg-purple px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-deep"
          >
            <IconPlus size={16} />
            {dict.addButton}
          </button>
        </div>
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
          <AvisTable
            avis={avis}
            onEditClick={(item) => setEditingAvis(item)}
            onDeleteClick={(item) => setAvisToDelete(item)}
            onToggleFeatured={handleToggleFeatured}
          />
        )}
      </div>

      {editingAvis !== undefined && (
        <AvisFormModal
          avis={editingAvis}
          onClose={() => setEditingAvis(undefined)}
          onSaved={() => {
            setEditingAvis(undefined);
            mutate();
          }}
        />
      )}

      <ConfirmDialog
        open={!!avisToDelete}
        title={dict.confirmDelete.title}
        description={dict.confirmDelete.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAvisToDelete(null)}
      />
    </div>
  );
}
