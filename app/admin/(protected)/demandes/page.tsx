import { Suspense } from "react";
import DemandesPageClient from "@/components/admin/demandes/DemandesPageClient";

export default function DemandesPage() {
  return (
    <Suspense>
      <DemandesPageClient />
    </Suspense>
  );
}
