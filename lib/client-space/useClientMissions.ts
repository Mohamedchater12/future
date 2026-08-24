"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { ClientMissionWithRelations } from "@/lib/client-space/dashboard";

export function useClientMissions() {
  const { data, error, isLoading, mutate } = useSWR<{ missions: ClientMissionWithRelations[] }>(
    "/api/client/missions",
    fetcher
  );

  return { missions: data?.missions ?? [], error, isLoading, mutate };
}
