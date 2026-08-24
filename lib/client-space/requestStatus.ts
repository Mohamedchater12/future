import type { MissionStatus } from "@prisma/client";
import type { ClientSpaceDictionary } from "@/lib/i18n/clientSpace/translations";

export function getRequestStatusLabels(
  dict: ClientSpaceDictionary
): Record<MissionStatus, string> {
  return {
    EN_ATTENTE: dict.requestStatus.pending,
    EN_COURS: dict.requestStatus.inProgress,
    TERMINE: dict.requestStatus.done,
  };
}

export const REQUEST_STATUS_STYLES: Record<MissionStatus, string> = {
  EN_ATTENTE: "bg-amber-400/15 text-amber-300",
  EN_COURS: "bg-purple/15 text-purple-light",
  TERMINE: "bg-emerald-400/15 text-emerald-300",
};
