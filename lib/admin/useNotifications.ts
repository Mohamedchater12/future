"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Notification } from "@prisma/client";

// Lightweight polling for now — swap the SWR call below for a WebSocket/SSE
// subscription later without touching NotificationBell, which only consumes
// this hook's return shape.
const POLL_INTERVAL_MS = 20000;

export function useNotifications(limit = 8) {
  const { data, error, isLoading, mutate } = useSWR<{
    notifications: Notification[];
    unreadCount: number;
  }>(`/api/admin/notifications?limit=${limit}`, fetcher, {
    refreshInterval: POLL_INTERVAL_MS,
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
    error,
    mutate,
  };
}
