"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Client } from "@prisma/client";

export type ClientProfile = Pick<
  Client,
  "id" | "name" | "email" | "phone" | "company" | "avatarUrl" | "createdAt"
>;

export function useClientProfile() {
  const { data, error, isLoading, mutate } = useSWR<{ client: ClientProfile }>(
    "/api/client/me",
    fetcher
  );

  return { client: data?.client, error, isLoading, mutate };
}
