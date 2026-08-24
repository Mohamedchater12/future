"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { ClientSummary } from "@/lib/client-space/dashboard";

const POLL_INTERVAL_MS = 15000;

export function useClientSummary() {
  const { lang } = useClientLanguage();
  const { data, error, isLoading, mutate } = useSWR<ClientSummary>(
    `/api/client/summary?lang=${lang}`,
    fetcher,
    { refreshInterval: POLL_INTERVAL_MS }
  );

  return { summary: data, error, isLoading, mutate };
}
