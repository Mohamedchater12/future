"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { IconSearch, IconCheck } from "@tabler/icons-react";
import { fetcher } from "@/lib/fetcher";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { missionsTranslations } from "@/lib/i18n/admin/missions";
import type { Client } from "@prisma/client";

export default function ClientPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (clientId: string) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = missionsTranslations[lang];
  const [search, setSearch] = useState("");
  const { data } = useSWR<{ clients: Client[] }>("/api/admin/clients?pageSize=200", fetcher);
  const clients = data?.clients ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  return (
    <div>
      <div className="relative mb-2">
        <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-gray" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.clientPicker.searchPlaceholder}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-base-gray/60 outline-none focus:border-purple"
        />
      </div>

      <div className="max-h-44 overflow-y-auto rounded-lg border border-white/10">
        {filtered.length === 0 ? (
          <p className="p-3 text-center text-sm text-base-gray">{dict.clientPicker.noClientFound}</p>
        ) : (
          filtered.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => onChange(client.id)}
              className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                value === client.id ? "bg-purple/15 text-white" : "text-base-gray hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="min-w-0 truncate">
                {client.name}
                {client.company && <span className="text-xs text-base-gray"> · {client.company}</span>}
              </span>
              {value === client.id && <IconCheck size={15} className="shrink-0 text-purple-light" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
