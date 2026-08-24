"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import type { DashboardStats, ActivityItem, WeeklyDemandeCount } from "@/lib/dashboard";

type DashboardData = {
  stats: DashboardStats;
  activity: ActivityItem[];
  weeklyDemandes: WeeklyDemandeCount[];
};

export function useDashboard() {
  const { lang } = useAdminLanguage();
  const { data, error, isLoading } = useSWR<DashboardData>(
    `/api/admin/dashboard?lang=${lang}`,
    fetcher
  );

  return { data, error, isLoading };
}
