"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus, IconSearch, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import ClientsTable from "@/components/admin/clients/ClientsTable";
import ClientFormModal from "@/components/admin/clients/ClientFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { clientsTranslations } from "@/lib/i18n/admin/clients";
import { formatMessage } from "@/lib/i18n/formatMessage";
import type { Client } from "@prisma/client";

export default function ClientsPageClient() {
  const { lang } = useAdminLanguage();
  const dict = clientsTranslations[lang];
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingClient, setEditingClient] = useState<Client | null | undefined>(undefined);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const query = new URLSearchParams({ page: String(page), ...(search ? { q: search } : {}) });
  const { data, error, isLoading, mutate } = useSWR<{
    clients: Client[];
    total: number;
    pageSize: number;
  }>(`/api/admin/clients?${query.toString()}`, fetcher);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    fetcher<{ client: Client }>(`/api/admin/clients/${id}`)
      .then((res) => setEditingClient(res.client))
      .catch(() => toast.error(dict.toast.notFound));
  }, [searchParams]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  async function handleConfirmDelete() {
    if (!clientToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/clients/${clientToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toast.deleted);
      setClientToDelete(null);
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
          <p className="mt-1 text-sm text-base-gray">{dict.pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-gray" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={dict.searchPlaceholder}
              className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-base-gray/60 outline-none focus:border-purple"
            />
          </div>
          <button
            type="button"
            onClick={() => setEditingClient(null)}
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

        {!isLoading && !error && data && (
          <>
            <ClientsTable
              clients={data.clients}
              onEditClick={(client) => setEditingClient(client)}
              onDeleteClick={(client) => setClientToDelete(client)}
            />

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-end gap-3 text-sm text-base-gray">
                <span>{formatMessage(dict.pagination, { page, total: totalPages })}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-white/10 p-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <IconChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-white/10 p-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <IconChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {editingClient !== undefined && (
        <ClientFormModal
          client={editingClient}
          onClose={() => setEditingClient(undefined)}
          onSaved={() => {
            setEditingClient(undefined);
            mutate();
          }}
        />
      )}

      <ConfirmDialog
        open={!!clientToDelete}
        title={dict.confirmDelete.title}
        description={dict.confirmDelete.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
