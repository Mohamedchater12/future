"use client";

import { useState } from "react";
import ClientSidebar from "@/components/client-space/ClientSidebar";
import ClientTopbar from "@/components/client-space/ClientTopbar";
import type { Client } from "@prisma/client";

export default function ClientShell({
  user,
  children,
}: {
  user: Pick<Client, "id" | "name" | "email" | "avatarUrl">;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-base-black">
      <ClientSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ClientTopbar user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
