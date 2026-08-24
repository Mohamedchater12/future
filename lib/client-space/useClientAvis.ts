"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Avis } from "@prisma/client";

export function useClientAvis() {
  const { data, error, isLoading, mutate } = useSWR<{ avis: Avis[] }>(
    "/api/client/avis",
    fetcher
  );

  return { avis: data?.avis ?? [], error, isLoading, mutate };
}
