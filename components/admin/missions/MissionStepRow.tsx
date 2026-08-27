"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  IconLoader2,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import { stepStatusValues } from "@/lib/validations/mission";
import { getStepStatusLabels, STEP_STATUS_STYLES } from "@/lib/admin/stepStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { missionsTranslations } from "@/lib/i18n/admin/missions";
import type { MissionStep, StepStatus } from "@prisma/client";
import type { MissionWithRelations } from "@/types/admin";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function MissionStepRow({
  missionId,
  step,
  isFirst,
  isLast,
  onUpdated,
  onMove,
}: {
  missionId: string;
  step: MissionStep;
  isFirst: boolean;
  isLast: boolean;
  onUpdated: (mission: MissionWithRelations) => void;
  onMove: (stepId: string, direction: "up" | "down") => Promise<void>;
}) {
  const { lang } = useAdminLanguage();
  const dict = missionsTranslations[lang];
  const stepStatusLabels = getStepStatusLabels(dict);
  const label = lang === "ar" ? (step as any).label_ar ?? (step as any).label_en ?? step.label : (step as any).label_en ?? step.label;
  const [note, setNote] = useState(step.note ?? "");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  async function patchStep(payload: Record<string, unknown>) {
    const response = await fetch(`/api/admin/missions/${missionId}/steps/${step.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("step_update_failed");
    const data = await response.json();
    onUpdated(data.mission as MissionWithRelations);
  }

  async function handleStatusChange(status: StepStatus) {
    setIsSavingStatus(true);
    try {
      await patchStep({ status });
      toast.success(dict.toasts.stepStatusUpdated);
    } catch {
      toast.error(dict.toasts.stepUpdateFailed);
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleSaveNote() {
    setIsSavingNote(true);
    try {
      await patchStep({ note: note.trim() === "" ? null : note });
    } catch {
      toast.error(dict.toasts.noteSaveFailed);
    } finally {
      setIsSavingNote(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!uploadResponse.ok) throw new Error("upload_failed");
      const { url } = await uploadResponse.json();
      await patchStep({ imageUrl: url });
      toast.success(dict.toasts.imageAdded);
    } catch {
      toast.error(dict.toasts.imageUploadFailed);
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleRemoveImage() {
    try {
      await patchStep({ imageUrl: null });
    } catch {
      toast.error(dict.toasts.imageRemoveFailed);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/missions/${missionId}/steps/${step.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      const data = await response.json();
      onUpdated(data.mission as MissionWithRelations);
      toast.success(dict.toasts.stepRemoved);
    } catch {
      toast.error(dict.toasts.stepRemoveFailed);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleMove(direction: "up" | "down") {
    setIsMoving(true);
    try {
      await onMove(step.id, direction);
    } finally {
      setIsMoving(false);
    }
  }

  return (
    <li className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-0.5 pt-0.5">
          <button
            type="button"
            onClick={() => handleMove("up")}
            disabled={isFirst || isMoving}
            className="flex h-5 w-5 items-center justify-center rounded text-base-gray/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={dict.step.moveUpAriaLabel}
          >
            <IconChevronUp size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleMove("down")}
            disabled={isLast || isMoving}
            className="flex h-5 w-5 items-center justify-center rounded text-base-gray/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={dict.step.moveDownAriaLabel}
          >
            <IconChevronDown size={13} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-white">{label}</p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="shrink-0 text-base-gray/50 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={dict.step.deleteAriaLabel}
            >
              {isDeleting ? (
                <IconLoader2 size={14} className="animate-spin" />
              ) : (
                <IconTrash size={14} />
              )}
            </button>
          </div>

          <div className="mt-2 flex gap-1.5">
            {stepStatusValues.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isSavingStatus}
                onClick={() => handleStatusChange(status)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  step.status === status
                    ? STEP_STATUS_STYLES[status]
                    : "bg-white/5 text-base-gray hover:bg-white/10 hover:text-white"
                }`}
              >
                {stepStatusLabels[status]}
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleSaveNote}
            placeholder={dict.step.notePlaceholder}
            className={`mt-2 resize-none text-xs ${inputClasses}`}
          />
          {isSavingNote && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-base-gray">
              <IconLoader2 size={10} className="animate-spin" /> {dict.step.saving}
            </p>
          )}

          <div className="mt-2">
            {step.imageUrl ? (
              <div className="group relative inline-block">
                <a href={step.imageUrl} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.imageUrl}
                    alt=""
                    className="h-14 w-14 rounded-lg border border-white/10 object-cover"
                  />
                </a>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={dict.step.removeImageAriaLabel}
                >
                  <IconX size={11} />
                </button>
              </div>
            ) : (
              <label className="flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-2.5 text-xs text-base-gray transition-colors hover:border-white/30 hover:text-white">
                {isUploadingImage ? (
                  <IconLoader2 size={13} className="animate-spin" />
                ) : (
                  <IconPhoto size={13} />
                )}
                {dict.step.addImage}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
