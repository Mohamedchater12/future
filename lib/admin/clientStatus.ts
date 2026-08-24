import type { ClientStatus } from "@prisma/client";
import type { ClientsDictionary } from "@/lib/i18n/admin/clients";

export function getClientStatusLabels(dict: ClientsDictionary): Record<ClientStatus, string> {
  return {
    ACTIF: dict.status.active,
    ARCHIVE: dict.status.archived,
  };
}

export const CLIENT_STATUS_STYLES: Record<ClientStatus, string> = {
  ACTIF: "bg-emerald-400/15 text-emerald-300",
  ARCHIVE: "bg-white/10 text-base-gray",
};
