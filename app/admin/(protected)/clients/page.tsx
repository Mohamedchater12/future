import { Suspense } from "react";
import ClientsPageClient from "@/components/admin/clients/ClientsPageClient";

export default function ClientsPage() {
  return (
    <Suspense>
      <ClientsPageClient />
    </Suspense>
  );
}
