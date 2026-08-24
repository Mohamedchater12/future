import type { MissionStatus } from "@prisma/client";
import type { MissionsDictionary } from "@/lib/i18n/admin/missions";

export function getMissionStatusLabels(dict: MissionsDictionary): Record<MissionStatus, string> {
  return {
    EN_ATTENTE: dict.status.pending,
    EN_COURS: dict.status.inProgress,
    TERMINE: dict.status.completed,
  };
}

export const MISSION_STATUS_STYLES: Record<MissionStatus, string> = {
  EN_ATTENTE: "bg-amber-400/15 text-amber-300",
  EN_COURS: "bg-purple/15 text-purple-light",
  TERMINE: "bg-emerald-400/15 text-emerald-300",
};
