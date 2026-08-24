"use client";

import { IconTrash, IconPencil } from "@tabler/icons-react";
import Badge from "@/components/admin/Badge";
import { getClientStatusLabels, CLIENT_STATUS_STYLES } from "@/lib/admin/clientStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { clientsTranslations } from "@/lib/i18n/admin/clients";
import type { Client } from "@prisma/client";

export default function ClientsTable({
  clients,
  onEditClick,
  onDeleteClick,
}: {
  clients: Client[];
  onEditClick: (client: Client) => void;
  onDeleteClick: (client: Client) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = clientsTranslations[lang];
  const statusLabels = getClientStatusLabels(dict);

  if (clients.length === 0) {
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
            <th className="px-4 py-3 font-medium">{dict.table.client}</th>
            <th className="px-4 py-3 font-medium">{dict.table.contact}</th>
            <th className="px-4 py-3 font-medium">{dict.table.project}</th>
            <th className="px-4 py-3 font-medium">{dict.table.status}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => onEditClick(client)}
              className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-white">{client.name}</p>
                {client.company && <p className="text-xs text-base-gray">{client.company}</p>}
              </td>
              <td className="px-4 py-3 text-base-gray">
                <p>{client.email}</p>
                {client.phone && <p className="text-xs">{client.phone}</p>}
              </td>
              <td className="px-4 py-3 text-base-gray">{client.project ?? "—"}</td>
              <td className="px-4 py-3">
                <Badge className={CLIENT_STATUS_STYLES[client.status]}>
                  {statusLabels[client.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(client);
                    }}
                    className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={dict.table.editAria}
                  >
                    <IconPencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(client);
                    }}
                    className="rounded-lg p-1.5 text-base-gray transition-colors hover:bg-red-400/10 hover:text-red-400"
                    aria-label={dict.table.deleteAria}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
