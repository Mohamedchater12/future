"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { buildSwap } from "@/lib/admin/reorder";
import ServicesTable from "@/components/admin/services/ServicesTable";
import ServiceFormModal from "@/components/admin/services/ServiceFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { servicesTranslations } from "@/lib/i18n/admin/services";
import type { Service } from "@prisma/client";

export default function ServicesPageClient() {
  const { lang } = useAdminLanguage();
  const dict = servicesTranslations[lang];
  const [editingService, setEditingService] = useState<Service | null | undefined>(undefined);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ services: Service[] }>(
    "/api/admin/services",
    fetcher
  );
  const services = data?.services ?? [];

  async function patchService(id: string, payload: Partial<Service>) {
    await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async function handleToggleVisible(service: Service) {
    try {
      await patchService(service.id, { visible: !service.visible });
      mutate();
    } catch {
      toast.error(dict.toast.visibilityError);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const swap = buildSwap(services, index, direction);
    if (!swap) return;
    try {
      await Promise.all(swap.map((item) => patchService(item.id, { order: item.order })));
      mutate();
    } catch {
      toast.error(dict.toast.reorderError);
    }
  }

  async function handleConfirmDelete() {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toast.deleted);
      setServiceToDelete(null);
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
          onClick={() => setEditingService(null)}
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
          <ServicesTable
            services={services}
            onEditClick={(service) => setEditingService(service)}
            onDeleteClick={(service) => setServiceToDelete(service)}
            onToggleVisible={handleToggleVisible}
            onMove={handleMove}
          />
        )}
      </div>

      {editingService !== undefined && (
        <ServiceFormModal
          service={editingService}
          nextOrder={services.length}
          onClose={() => setEditingService(undefined)}
          onSaved={() => {
            setEditingService(undefined);
            mutate();
          }}
        />
      )}

      <ConfirmDialog
        open={!!serviceToDelete}
        title={dict.confirmDelete.title}
        description={dict.confirmDelete.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
}
