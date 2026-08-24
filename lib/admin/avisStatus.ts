import type { AvisStatus } from "@prisma/client";
import type { AvisDictionary } from "@/lib/i18n/admin/avis";

export function getAvisStatusLabels(dict: AvisDictionary): Record<AvisStatus, string> {
  return {
    PUBLIE: dict.status.published,
    EN_ATTENTE: dict.status.pending,
    MASQUE: dict.status.hidden,
  };
}

export const AVIS_STATUS_STYLES: Record<AvisStatus, string> = {
  PUBLIE: "bg-emerald-400/15 text-emerald-300",
  EN_ATTENTE: "bg-amber-400/15 text-amber-300",
  MASQUE: "bg-white/10 text-base-gray",
};
