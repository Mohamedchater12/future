"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconX, IconLoader2, IconUserPlus, IconCheck, IconMail, IconPhone, IconBuilding } from "@tabler/icons-react";
import Badge from "@/components/admin/Badge";
import { getDemandeStatusLabels, DEMANDE_STATUS_STYLES } from "@/lib/admin/demandeStatus";
import { demandeStatusValues } from "@/lib/validations/demande";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { demandesTranslations } from "@/lib/i18n/admin/demandes";
import { formatMessage } from "@/lib/i18n/formatMessage";
import type { DemandeWithClient } from "@/types/admin";
import type { DemandeStatus } from "@prisma/client";

export default function DemandeDetailSheet({
  demande,
  onClose,
  onUpdated,
}: {
  demande: DemandeWithClient;
  onClose: () => void;
  onUpdated: (demande: DemandeWithClient) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = demandesTranslations[lang];
  const statusLabels = getDemandeStatusLabels(dict);
  const [note, setNote] = useState(demande.internalNote ?? "");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  async function updateDemande(payload: { status?: DemandeStatus; internalNote?: string }) {
    const response = await fetch(`/api/admin/demandes/${demande.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("update_failed");
    const data = await response.json();
    onUpdated(data.demande as DemandeWithClient);
    return data.demande as DemandeWithClient;
  }

  async function handleStatusChange(status: DemandeStatus) {
    setIsSavingStatus(true);
    try {
      await updateDemande({ status });
      toast.success(dict.detail.statusUpdated);
    } catch {
      toast.error(dict.detail.statusUpdateFailed);
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleSaveNote() {
    setIsSavingNote(true);
    try {
      await updateDemande({ internalNote: note });
      toast.success(dict.detail.noteSaved);
    } catch {
      toast.error(dict.detail.noteSaveFailed);
    } finally {
      setIsSavingNote(false);
    }
  }

  async function handleConvert() {
    setIsConverting(true);
    try {
      const response = await fetch(`/api/admin/demandes/${demande.id}/convert`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("convert_failed");
      const data = await response.json();
      onUpdated(data.demande as DemandeWithClient);
      toast.success(dict.detail.convertedToClient);
    } catch {
      toast.error(dict.detail.convertFailed);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-base-black p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">
            {demande.firstName} {demande.lastName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-base-gray hover:text-white"
            aria-label={dict.detail.closeAriaLabel}
          >
            <IconX size={20} />
          </button>
        </div>

        <Badge className={`mt-3 w-fit ${DEMANDE_STATUS_STYLES[demande.status]}`}>
          {statusLabels[demande.status]}
        </Badge>

        <div className="mt-6 space-y-2.5 text-sm text-base-gray">
          <p className="flex items-center gap-2">
            <IconMail size={16} className="shrink-0 text-purple-light" />
            <a href={`mailto:${demande.email}`} className="hover:text-white">{demande.email}</a>
          </p>
          <p className="flex items-center gap-2">
            <IconPhone size={16} className="shrink-0 text-purple-light" />
            <a href={`tel:${demande.phone}`} className="hover:text-white">{demande.phone}</a>
          </p>
          {demande.company && (
            <p className="flex items-center gap-2">
              <IconBuilding size={16} className="shrink-0 text-purple-light" />
              {demande.company}
            </p>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-base-gray">{dict.detail.requestedService}</p>
          <p className="mt-1 text-sm text-white">{demande.service}</p>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-base-gray">{dict.detail.message}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-white">{demande.message}</p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-white">{dict.detail.status}</label>
          <div className="flex flex-wrap gap-2">
            {demandeStatusValues.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isSavingStatus}
                onClick={() => handleStatusChange(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  demande.status === status
                    ? DEMANDE_STATUS_STYLES[status]
                    : "bg-white/5 text-base-gray hover:bg-white/10 hover:text-white"
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="internalNote" className="mb-2 block text-sm font-medium text-white">
            {dict.detail.internalNote}
          </label>
          <textarea
            id="internalNote"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple focus:ring-2 focus:ring-purple/40"
          />
          <button
            type="button"
            onClick={handleSaveNote}
            disabled={isSavingNote}
            className="mt-2 flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingNote && <IconLoader2 size={14} className="animate-spin" />}
            {dict.detail.saveNote}
          </button>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={demande.client ? undefined : handleConvert}
            disabled={!!demande.client || isConverting}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
              demande.client
                ? "border border-white/10 bg-white/[0.03] text-base-gray"
                : "bg-purple text-white hover:bg-purple-deep disabled:opacity-60"
            }`}
          >
            {demande.client ? (
              <>
                <IconCheck size={16} className="text-purple-light" />
                {formatMessage(dict.detail.acceptedClientPrefix, { name: demande.client.name })}
              </>
            ) : (
              <>
                {isConverting ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconUserPlus size={16} />
                )}
                {dict.detail.acceptRequest}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
