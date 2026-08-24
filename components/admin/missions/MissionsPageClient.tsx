"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { missionStatusValues } from "@/lib/validations/mission";
import { getMissionStatusLabels } from "@/lib/admin/missionStatus";
import MissionsTable from "@/components/admin/missions/MissionsTable";
import MissionFormModal from "@/components/admin/missions/MissionFormModal";
import MissionDetailSheet from "@/components/admin/missions/MissionDetailSheet";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { missionsTranslations } from "@/lib/i18n/admin/missions";
import type { MissionWithRelations } from "@/types/admin";

const STATUS_FILTERS = ["ALL", ...missionStatusValues] as const;

export default function MissionsPageClient() {
  const { lang } = useAdminLanguage();
  const dict = missionsTranslations[lang];
  const missionStatusLabels = getMissionStatusLabels(dict);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("ALL");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionWithRelations | null>(null);
  const [missionToDelete, setMissionToDelete] = useState<MissionWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ missions: MissionWithRelations[] }>(
    "/api/admin/missions",
    fetcher
  );
  const missions = data?.missions ?? [];
  const filteredMissions =
    statusFilter === "ALL" ? missions : missions.filter((m) => m.status === statusFilter);

  async function handleConfirmDelete() {
    if (!missionToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/missions/${missionToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");
      toast.success(dict.toasts.trackerDeleted);
      setMissionToDelete(null);
      setSelectedMission(null);
      mutate();
    } catch {
      toast.error(dict.toasts.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">{dict.page.title}</h1>
          <p className="mt-1 text-sm text-base-gray">
            {dict.page.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status} className="bg-base-black">
                {status === "ALL" ? dict.filters.allStatuses : missionStatusLabels[status]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 rounded-full bg-purple px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-deep"
          >
            <IconPlus size={16} />
            {dict.page.newTracker}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-base-gray">
            {dict.list.loading}
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-10 text-center text-sm text-red-300">
            {dict.list.loadError}{" "}
            <button type="button" onClick={() => mutate()} className="underline">
              {dict.list.retry}
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <MissionsTable missions={filteredMissions} onSelect={setSelectedMission} />
        )}
      </div>

      {isCreating && (
        <MissionFormModal
          onClose={() => setIsCreating(false)}
          onCreated={() => {
            setIsCreating(false);
            mutate();
          }}
        />
      )}

      {selectedMission && (
        <MissionDetailSheet
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          onUpdated={(mission) => {
            setSelectedMission(mission);
            mutate();
          }}
          onDeleteClick={setMissionToDelete}
        />
      )}

      <ConfirmDialog
        open={!!missionToDelete}
        title={dict.deleteDialog.title}
        description={dict.deleteDialog.description}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMissionToDelete(null)}
      />
    </div>
  );
}
