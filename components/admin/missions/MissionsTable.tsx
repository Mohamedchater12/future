"use client";

import Badge from "@/components/admin/Badge";
import { getMissionStatusLabels, MISSION_STATUS_STYLES } from "@/lib/admin/missionStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { missionsTranslations } from "@/lib/i18n/admin/missions";
import type { MissionWithRelations } from "@/types/admin";

export default function MissionsTable({
  missions,
  onSelect,
}: {
  missions: MissionWithRelations[];
  onSelect: (mission: MissionWithRelations) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = missionsTranslations[lang];
  const missionStatusLabels = getMissionStatusLabels(dict);

  if (missions.length === 0) {
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
            <th className="px-4 py-3 font-medium">{dict.table.columnClient}</th>
            <th className="px-4 py-3 font-medium">{dict.table.columnTitle}</th>
            <th className="px-4 py-3 font-medium">{dict.table.columnStatus}</th>
            <th className="px-4 py-3 font-medium">{dict.table.columnProgress}</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr
              key={mission.id}
              onClick={() => onSelect(mission)}
              className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-white">{mission.client.name}</p>
                {mission.client.company && (
                  <p className="text-xs text-base-gray">{mission.client.company}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <p className="text-white">{lang === "ar" ? (mission as any).title_ar ?? (mission as any).title_en ?? mission.title : (mission as any).title_en ?? mission.title}</p>
                <p className="text-xs text-base-gray">{mission.service}</p>
              </td>
              <td className="px-4 py-3">
                <Badge className={MISSION_STATUS_STYLES[mission.status]}>
                  {missionStatusLabels[mission.status]}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple to-purple-light"
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-base-gray">{mission.progress}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
