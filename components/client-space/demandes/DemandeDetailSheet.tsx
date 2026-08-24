"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconX, IconFileText, IconInfoCircle, IconUpload, IconLoader2 } from "@tabler/icons-react";
import Badge from "@/components/admin/Badge";
import DemandeTimeline from "@/components/client-space/demandes/DemandeTimeline";
import { getRequestStatusLabels, REQUEST_STATUS_STYLES } from "@/lib/client-space/requestStatus";
import { formatRelativeTime } from "@/lib/client-space/formatRelativeTime";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import { formatMessage } from "@/lib/i18n/clientSpace/translations";
import type { ClientMissionWithRelations } from "@/lib/client-space/dashboard";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function DemandeDetailSheet({
  mission,
  onClose,
  onFileAdded,
}: {
  mission: ClientMissionWithRelations;
  onClose: () => void;
  onFileAdded: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { dict, lang } = useClientLanguage();
  const statusLabels = getRequestStatusLabels(dict);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(dict.requests.detail.errors.invalidFileType);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(dict.requests.detail.errors.fileTooLarge);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("/api/client/upload", { method: "POST", body: formData });
      if (!uploadResponse.ok) throw new Error("upload_failed");
      const { url } = await uploadResponse.json();

      const attachResponse = await fetch(`/api/client/missions/${mission.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, url }),
      });
      if (!attachResponse.ok) throw new Error("attach_failed");

      toast.success(dict.requests.detail.success.fileSent);
      onFileAdded();
    } catch {
      toast.error(dict.requests.detail.errors.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-base-black p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-white">{mission.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-base-gray hover:text-white"
            aria-label={dict.requests.detail.close}
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Badge className={REQUEST_STATUS_STYLES[mission.status]}>
            {statusLabels[mission.status]}
          </Badge>
          <span className="text-xs text-base-gray">{mission.service}</span>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple to-purple-light"
              style={{ width: `${mission.progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-base-gray">
            {formatMessage(dict.requests.detail.progressUpdated, {
              value: mission.progress,
              time: formatRelativeTime(new Date(mission.updatedAt), lang),
            })}
          </p>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-base-gray">
            {dict.requests.detail.description}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-white">{mission.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-sm font-medium text-white">{dict.requests.detail.steps}</h3>
          <DemandeTimeline steps={mission.steps} />
        </div>

        <div className="mt-2">
          <h3 className="mb-3 text-sm font-medium text-white">
            {dict.requests.detail.filesExchanged}
          </h3>
          {mission.files.length === 0 ? (
            <p className="text-sm text-base-gray">{dict.requests.detail.noFiles}</p>
          ) : (
            <ul className="space-y-2">
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
                      {file.uploadedBy === "CLIENT" ? dict.requests.detail.you : dict.requests.detail.team}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <label className="mt-3 flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/15 px-3 text-sm text-base-gray transition-colors hover:border-white/30 hover:text-white">
            {isUploading ? (
              <IconLoader2 size={15} className="animate-spin" />
            ) : (
              <IconUpload size={15} />
            )}
            {dict.requests.detail.uploadCta}
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-base-gray">
          <IconInfoCircle size={16} className="mt-0.5 shrink-0 text-purple-light" />
          <p>{dict.requests.detail.footerNote}</p>
        </div>
      </div>
    </div>
  );
}
