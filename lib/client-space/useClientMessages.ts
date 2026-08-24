"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Message } from "@prisma/client";

const POLL_INTERVAL_MS = 8000;

export function useClientMessages() {
  const { data, error, isLoading, mutate } = useSWR<{ messages: Message[] }>(
    "/api/client/messages",
    fetcher,
    { refreshInterval: POLL_INTERVAL_MS }
  );

  return { messages: data?.messages ?? [], error, isLoading, mutate };
}
