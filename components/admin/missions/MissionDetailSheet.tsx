"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconX, IconLoader2, IconFileText, IconTrash, IconPlus } from "@tabler/icons-react";
import { missionStatusValues } from "@/lib/validations/mission";
import { getMissionStatusLabels, MISSION_STATUS_STYLES } from "@/lib/admin/missionStatus";
import MissionStepRow from "@/components/admin/missions/MissionStepRow";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { missionsTranslations } from "@/lib/i18n/admin/missions";
import { formatMessage } from "@/lib/i18n/formatMessage";
import type { MissionWithRelations } from "@/types/admin";
import type { MissionStatus } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function MissionDetailSheet({
  mission,
  onClose,
  onUpdated,
  onDeleteClick,
}: {
  mission: MissionWithRelations;
  onClose: () => void;
  onUpdated: (mission: MissionWithRelations) => void;
  onDeleteClick: (mission: MissionWithRelations) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = missionsTranslations[lang];
  const missionStatusLabels = getMissionStatusLabels(dict);
  const initialDescription = lang === "ar" ? (mission as any).description_ar ?? (mission as any).description_en ?? mission.description : (mission as any).description_en ?? mission.description;
  const [description, setDescription] = useState(initialDescription);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newStepLabel, setNewStepLabel] = useState("");
  const [isAddingStep, setIsAddingStep] = useState(false);

  async function patchMission(payload: Record<string, unknown>) {
    const response = await fetch(`/api/admin/missions/${mission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("update_failed");
    const data = await response.json();
    onUpdated(data.mission as MissionWithRelations);
  }

  async function handleStatusChange(status: MissionStatus) {
    setIsSavingStatus(true);
    try {
      await patchMission({ status });
      toast.success(dict.toasts.statusUpdated);
    } catch {
      toast.error(dict.toasts.statusUpdateFailed);
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleSaveDescription() {
    setIsSavingDescription(true);
    try {
      const payload: Record<string, unknown> = {};
      if (lang === "ar") payload.description_ar = description;
      else payload.description_en = description;
      await patchMission(payload);
      toast.success(dict.toasts.descriptionSaved);
    } catch {
      toast.error(dict.toasts.descriptionSaveFailed);
    } finally {
      setIsSavingDescription(false);
    }
  }

  async function handleMoveStep(stepId: string, direction: "up" | "down") {
    const steps = mission.steps;
    const index = steps.findIndex((s) => s.id === stepId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= steps.length) return;

    const current = steps[index];
    const swapWith = steps[swapIndex];

    try {
      await Promise.all([
        fetch(`/api/admin/missions/${mission.id}/steps/${current.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: swapWith.order }),
        }),
        fetch(`/api/admin/missions/${mission.id}/steps/${swapWith.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: current.order }),
        }),
      ]);
      const response = await fetch(`/api/admin/missions/${mission.id}`);
      if (!response.ok) throw new Error("reorder_failed");
      const data = await response.json();
      onUpdated(data.mission as MissionWithRelations);
    } catch {
      toast.error(dict.toasts.reorderFailed);
    }
  }

  async function handleAddStep(e: React.FormEvent) {
    e.preventDefault();
    if (!newStepLabel.trim()) return;

    setIsAddingStep(true);
    try {
      const bodyPayload: any = {};
    if (lang === "ar") bodyPayload.label_ar = newStepLabel.trim();
    else bodyPayload.label_en = newStepLabel.trim();

    const response = await fetch(`/api/admin/missions/${mission.id}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      if (!response.ok) throw new Error("add_step_failed");
      const data = await response.json();
      onUpdated(data.mission as MissionWithRelations);
      setNewStepLabel("");
    } catch {
      toast.error(dict.toasts.addStepFailed);
    } finally {
      setIsAddingStep(false);
    }
  }

  async function handleAddFile(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) return;

    setIsAddingFile(true);
    try {
      const response = await fetch(`/api/admin/missions/${mission.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName.trim(), url: fileUrl.trim() }),
      });
      if (!response.ok) throw new Error("file_add_failed");
      const data = await response.json();
      onUpdated({ ...mission, files: [data.file, ...mission.files] });
      setFileName("");
      setFileUrl("");
      toast.success(dict.toasts.fileAdded);
    } catch {
      toast.error(dict.toasts.addFileFailed);
    } finally {
      setIsAddingFile(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-base-black p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-white">{lang === "ar" ? (mission as any).title_ar ?? (mission as any).title_en ?? mission.title : (mission as any).title_en ?? mission.title}</h2>
            <p className="mt-0.5 text-xs text-base-gray">
              {mission.client.name}
              {mission.client.company && ` · ${mission.client.company}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-base-gray hover:text-white"
            aria-label={dict.detail.closeAriaLabel}
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple to-purple-light"
              style={{ width: `${mission.progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-base-gray">
            {formatMessage(dict.detail.progressComplete, { percent: mission.progress })}
          </p>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-white">{dict.detail.statusLabel}</label>
          <div className="flex flex-wrap gap-2">
            {missionStatusValues.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isSavingStatus}
                onClick={() => handleStatusChange(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  mission.status === status
                    ? MISSION_STATUS_STYLES[status]
                    : "bg-white/5 text-base-gray hover:bg-white/10 hover:text-white"
                }`}
              >
                {missionStatusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-white">
            {dict.detail.descriptionLabel}
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClasses} resize-none`}
          />
          <button
            type="button"
            onClick={handleSaveDescription}
            disabled={isSavingDescription}
            className="mt-2 flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingDescription && <IconLoader2 size={14} className="animate-spin" />}
            {dict.detail.save}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-white">
            {dict.detail.stepsTitle} <span className="text-xs text-base-gray">{dict.detail.stepsSubtitle}</span>
          </h3>
          <ul className="space-y-2">
            {mission.steps.map((step, index) => (
              <MissionStepRow
                key={step.id}
                missionId={mission.id}
                step={step}
                isFirst={index === 0}
                isLast={index === mission.steps.length - 1}
                onUpdated={onUpdated}
                onMove={handleMoveStep}
              />
            ))}
          </ul>

          <form onSubmit={handleAddStep} className="mt-3 flex gap-2">
            <input
              value={newStepLabel}
              onChange={(e) => setNewStepLabel(e.target.value)}
              placeholder={dict.detail.newStepPlaceholder}
              className={inputClasses}
            />
            <button
              type="submit"
              disabled={isAddingStep}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAddingStep ? (
                <IconLoader2 size={14} className="animate-spin" />
              ) : (
                <IconPlus size={14} />
              )}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-white">{dict.detail.filesTitle}</h3>
          {mission.files.length > 0 && (
            <ul className="mb-3 space-y-2">
              {mission.files.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white transition-colors hover:border-purple/40 hover:bg-white/[0.05]"
                  >
                    <IconFileText size={16} className="shrink-0 text-purple-light" />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <span className="shrink-0 text-xs text-base-gray">
                      {file.uploadedBy === "ADMIN" ? dict.detail.uploadedByYou : dict.detail.uploadedByClient}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddFile} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={dict.detail.fileNamePlaceholder}
              className={inputClasses}
            />
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder={dict.detail.fileUrlPlaceholder}
              className={inputClasses}
            />
            <button
              type="submit"
              disabled={isAddingFile}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAddingFile ? <IconLoader2 size={14} className="animate-spin" /> : <IconPlus size={14} />}
            </button>
          </form>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => onDeleteClick(mission)}
            className="flex items-center gap-2 text-sm text-red-400 transition-colors hover:text-red-300"
          >
            <IconTrash size={15} />
            {dict.detail.deleteTracker}
          </button>
        </div>
      </div>
    </div>
  );
}
