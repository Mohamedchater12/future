"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useClientMissions } from "@/lib/client-space/useClientMissions";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import DemandeCard from "@/components/client-space/demandes/DemandeCard";
import DemandeDetailSheet from "@/components/client-space/demandes/DemandeDetailSheet";
import type { MissionStatus } from "@prisma/client";
import type { ClientSpaceDictionary } from "@/lib/i18n/clientSpace/translations";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function getFilters(
  dict: ClientSpaceDictionary
): Array<{ label: string; value: MissionStatus | "TOUTES" }> {
  return [
    { label: dict.requests.filters.all, value: "TOUTES" },
    { label: dict.requestStatus.pending, value: "EN_ATTENTE" },
    { label: dict.requestStatus.inProgress, value: "EN_COURS" },
    { label: dict.requestStatus.done, value: "TERMINE" },
  ];
}

export default function DemandesPage() {
  const { missions, mutate } = useClientMissions();
  const { dict } = useClientLanguage();
  const [filter, setFilter] = useState<MissionStatus | "TOUTES">("TOUTES");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filters = getFilters(dict);

  const filteredMissions = useMemo(() => {
    const list = filter === "TOUTES" ? missions : missions.filter((m) => m.status === filter);
    return [...list].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [missions, filter]);

  const selectedMission = missions.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold text-white">{dict.requests.title}</h1>
        <p className="mt-1 text-sm text-base-gray">{dict.requests.subtitle}</p>
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "bg-purple/15 text-purple-light"
                : "bg-white/5 text-base-gray hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {filteredMissions.length === 0 ? (
          <p className="col-span-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-base-gray">
            {dict.requests.empty}
          </p>
        ) : (
          filteredMissions.map((mission) => (
            <DemandeCard
              key={mission.id}
              mission={mission}
              onClick={() => setSelectedId(mission.id)}
            />
          ))
        )}
      </motion.div>

      {selectedMission && (
        <DemandeDetailSheet
          mission={selectedMission}
          onClose={() => setSelectedId(null)}
          onFileAdded={() => mutate()}
        />
      )}
    </div>
  );
}
