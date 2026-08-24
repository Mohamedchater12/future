import type { StepStatus } from "@prisma/client";
import type { MissionsDictionary } from "@/lib/i18n/admin/missions";

export function getStepStatusLabels(dict: MissionsDictionary): Record<StepStatus, string> {
  return {
    A_FAIRE: dict.stepStatus.todo,
    EN_COURS: dict.stepStatus.inProgress,
    TERMINE: dict.stepStatus.done,
  };
}

export const STEP_STATUS_STYLES: Record<StepStatus, string> = {
  A_FAIRE: "bg-white/5 text-base-gray",
  EN_COURS: "bg-amber-400/15 text-amber-300",
  TERMINE: "bg-emerald-400/15 text-emerald-300",
};
