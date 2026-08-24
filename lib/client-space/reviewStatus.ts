import type { AvisStatus } from "@prisma/client";
import type { ClientSpaceDictionary } from "@/lib/i18n/clientSpace/translations";

export function getReviewStatusLabels(
  dict: ClientSpaceDictionary
): Record<AvisStatus, string> {
  return {
    EN_ATTENTE: dict.reviewStatus.pending,
    PUBLIE: dict.reviewStatus.published,
    MASQUE: dict.reviewStatus.hidden,
  };
}

export const REVIEW_STATUS_STYLES: Record<AvisStatus, string> = {
  EN_ATTENTE: "bg-amber-400/15 text-amber-300",
  PUBLIE: "bg-emerald-400/15 text-emerald-300",
  MASQUE: "bg-white/10 text-base-gray",
};
