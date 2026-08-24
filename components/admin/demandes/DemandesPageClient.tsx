"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { IconArrowsSort } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { getDemandeStatusLabels } from "@/lib/admin/demandeStatus";
import { demandeStatusValues } from "@/lib/validations/demande";
import DemandesTable from "@/components/admin/demandes/DemandesTable";
import DemandeDetailSheet from "@/components/admin/demandes/DemandeDetailSheet";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { demandesTranslations } from "@/lib/i18n/admin/demandes";
import type { DemandeWithClient } from "@/types/admin";

const STATUS_FILTERS = ["TOUS", ...demandeStatusValues] as const;

export default function DemandesPageClient() {
  const { lang } = useAdminLanguage();
  const dict = demandesTranslations[lang];
  const statusLabels = getDemandeStatusLabels(dict);
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("TOUS");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("id"));
  const [demandeToDelete, setDemandeToDelete] = useState<DemandeWithClient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const query = statusFilter === "TOUS" ? "" : `?status=${statusFilter}`;
  const { data, error, isLoading, mutate } = useSWR<{ demandes: DemandeWithClient[] }>(
    `/api/admin/demandes${query}`,
    fetcher
  );

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) setSelectedId(idFromUrl);
  }, [searchParams]);

  const demandes = useMemo(() => {
    const list = data?.demandes ?? [];
    const sorted = [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
    return sorted;
  }, [data, sortDir]);

  const selectedDemande = demandes.find((d) => d.id === selectedId) ?? null;

  async function handleConfirmDelete() {
    if (!demandeToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/demandes/${demandeToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toasts.requestDeleted);
      setDemandeToDelete(null);
      if (selectedId === demandeToDelete.id) setSelectedId(null);
      mutate();
    } catch {
      toast.error(dict.toasts.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">{dict.page.title}</h1>
          <p className="mt-1 text-sm text-base-gray">
            {dict.page.subtitle}
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
                {status === "TOUS" ? dict.filters.allStatuses : statusLabels[status]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setSortDir((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/5"
          >
            <IconArrowsSort size={16} />
            {sortDir === "desc" ? dict.filters.newestFirst : dict.filters.oldestFirst}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
            {dict.list.loading}
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-10 text-center text-sm text-red-300">
            {dict.list.loadError}{" "}
            <button type="button" onClick={() => mutate()} className="underline">
              {dict.list.retry}
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <DemandesTable
            demandes={demandes}
            onRowClick={(demande) => setSelectedId(demande.id)}
            onDeleteClick={(demande) => setDemandeToDelete(demande)}
          />
        )}
      </div>

      {selectedDemande && (
        <DemandeDetailSheet
          demande={selectedDemande}
          onClose={() => setSelectedId(null)}
          onUpdated={() => mutate()}
        />
      )}

      <ConfirmDialog
        open={!!demandeToDelete}
        title={dict.deleteDialog.title}
        description={dict.deleteDialog.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDemandeToDelete(null)}
      />
    </div>
  );
}
