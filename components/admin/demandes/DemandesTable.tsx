"use client";

import { IconTrash } from "@tabler/icons-react";
import Badge from "@/components/admin/Badge";
import { getDemandeStatusLabels, DEMANDE_STATUS_STYLES } from "@/lib/admin/demandeStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { demandesTranslations } from "@/lib/i18n/admin/demandes";
import type { DemandeWithClient } from "@/types/admin";

export default function DemandesTable({
  demandes,
  onRowClick,
  onDeleteClick,
}: {
  demandes: DemandeWithClient[];
  onRowClick: (demande: DemandeWithClient) => void;
  onDeleteClick: (demande: DemandeWithClient) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = demandesTranslations[lang];
  const statusLabels = getDemandeStatusLabels(dict);

  if (demandes.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
        {dict.table.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wide text-base-gray">
            <th className="px-4 py-3 font-medium">{dict.table.columnContact}</th>
            <th className="px-4 py-3 font-medium">{dict.table.columnService}</th>
            <th className="px-4 py-3 font-medium">{dict.table.columnStatus}</th>
            <th className="px-4 py-3 font-medium">{dict.table.columnDate}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande) => (
            <tr
              key={demande.id}
              onClick={() => onRowClick(demande)}
              className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-white">
                  {demande.firstName} {demande.lastName}
                </p>
                <p className="text-xs text-base-gray">{demande.email}</p>
              </td>
              <td className="px-4 py-3 text-base-gray">{demande.service}</td>
              <td className="px-4 py-3">
                <Badge className={DEMANDE_STATUS_STYLES[demande.status]}>
                  {statusLabels[demande.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-base-gray">
                {new Date(demande.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(demande);
                  }}
                  className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-red-400/10 hover:text-red-400"
                  aria-label={dict.table.deleteAriaLabel}
                >
                  <IconTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
