import type { DemandeStatus } from "@prisma/client";
import type { DemandesDictionary } from "@/lib/i18n/admin/demandes";

export function getDemandeStatusLabels(dict: DemandesDictionary): Record<DemandeStatus, string> {
  return {
    NOUVEAU: dict.status.new,
    EN_COURS: dict.status.inProgress,
    TRAITE: dict.status.processed,
    ARCHIVE: dict.status.archived,
  };
}

export const DEMANDE_STATUS_STYLES: Record<DemandeStatus, string> = {
  NOUVEAU: "bg-purple/15 text-purple-light",
  EN_COURS: "bg-amber-400/15 text-amber-300",
  TRAITE: "bg-emerald-400/15 text-emerald-300",
  ARCHIVE: "bg-white/10 text-base-gray",
};
