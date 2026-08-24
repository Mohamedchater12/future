"use client";

import Image from "next/image";
import { IconTrash, IconPencil, IconStarFilled, IconUser, IconUserCircle } from "@tabler/icons-react";
import Badge from "@/components/admin/Badge";
import StarsDisplay from "@/components/admin/avis/StarsDisplay";
import { getAvisStatusLabels, AVIS_STATUS_STYLES } from "@/lib/admin/avisStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { avisTranslations } from "@/lib/i18n/admin/avis";
import type { AvisWithClient } from "@/types/admin";

export default function AvisTable({
  avis,
  onEditClick,
  onDeleteClick,
  onToggleFeatured,
}: {
  avis: AvisWithClient[];
  onEditClick: (item: AvisWithClient) => void;
  onDeleteClick: (item: AvisWithClient) => void;
  onToggleFeatured: (item: AvisWithClient) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = avisTranslations[lang];
  const statusLabels = getAvisStatusLabels(dict);

  if (avis.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
        {dict.table.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wide text-base-gray">
            <th className="px-4 py-3 font-medium">{dict.table.client}</th>
            <th className="px-4 py-3 font-medium">{dict.table.review}</th>
            <th className="px-4 py-3 font-medium">{dict.table.status}</th>
            <th className="px-4 py-3 font-medium">{dict.table.featured}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {avis.map((item) => (
            <tr
              key={item.id}
              onClick={() => onEditClick(item)}
              className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.05]">
                    {item.photoUrl ? (
                      <Image src={item.photoUrl} alt="" width={36} height={36} className="h-full w-full object-cover" />
                    ) : (
                      <IconUser size={16} className="text-purple-light" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    {item.company && <p className="text-xs text-base-gray">{item.company}</p>}
                    {item.client && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-light">
                        <IconUserCircle size={12} />
                        {dict.table.portalClient}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StarsDisplay rating={item.rating} />
                <p className="mt-1 max-w-xs truncate text-xs text-base-gray">{item.quote}</p>
              </td>
              <td className="px-4 py-3">
                <Badge className={AVIS_STATUS_STYLES[item.status]}>
                  {statusLabels[item.status]}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFeatured(item);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    item.featured
                      ? "bg-purple/20 text-purple-light hover:bg-purple/30"
                      : "bg-white/10 text-base-gray hover:bg-white/15"
                  }`}
                >
                  <IconStarFilled size={13} />
                  {item.featured ? dict.table.featuredLabel : dict.table.standardLabel}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(item);
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
                      onDeleteClick(item);
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
