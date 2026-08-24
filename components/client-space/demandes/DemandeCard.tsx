"use client";

import Badge from "@/components/admin/Badge";
import { getRequestStatusLabels, REQUEST_STATUS_STYLES } from "@/lib/client-space/requestStatus";
import { formatRelativeTime } from "@/lib/client-space/formatRelativeTime";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import { formatMessage } from "@/lib/i18n/clientSpace/translations";
import type { ClientMissionWithRelations } from "@/lib/client-space/dashboard";

export default function DemandeCard({
  mission,
  onClick,
}: {
  mission: ClientMissionWithRelations;
  onClick: () => void;
}) {
  const { dict, lang } = useClientLanguage();
  const statusLabels = getRequestStatusLabels(dict);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-purple/40 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{mission.title}</p>
          <p className="mt-0.5 truncate text-xs text-base-gray">{mission.service}</p>
        </div>
        <Badge className={`shrink-0 ${REQUEST_STATUS_STYLES[mission.status]}`}>
          {statusLabels[mission.status]}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple to-purple-light"
            style={{ width: `${mission.progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-base-gray">
          <span>{formatMessage(dict.dashboard.percentComplete, { value: mission.progress })}</span>
          <span>
            {formatMessage(dict.dashboard.updatedAt, {
              time: formatRelativeTime(new Date(mission.updatedAt), lang),
            })}
          </span>
        </div>
      </div>
    </button>
  );
}
