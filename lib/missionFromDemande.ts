import { prisma } from "@/lib/prisma";
import type { Demande } from "@prisma/client";

// Point d'entrée unique pour transformer une Demande (lead brut du formulaire
// public) en Mission trackable dans l'espace client — utilisé partout où une
// Demande devient rattachée à un Client : soumission du formulaire (email
// déjà connu), conversion manuelle par l'admin, ou inscription tardive du
// client (voir linkOrphanDemandesToClient ci-dessous).
export async function createMissionFromDemande(
  clientId: string,
  demande: Pick<Demande, "service" | "message">
) {
  return prisma.mission.create({
    data: {
      clientId,
      title: demande.service,
      service: demande.service,
      description: demande.message,
      status: "EN_ATTENTE",
      progress: 0,
      steps: {
        create: [{ label: "Demande reçue", order: 0, status: "TERMINE" }],
      },
    },
  });
}

// Rattache au Client toutes les Demandes existantes portant le même email
// mais pas encore liées à un compte (soumises avant que le client n'ait de
// compte, ou avant qu'un admin ne l'ait converti), et crée leur Mission de
// suivi correspondante. Appelé à l'inscription et à la conversion admin pour
// qu'aucune demande passée ne reste orpheline.
export async function linkOrphanDemandesToClient(client: { id: string; email: string }) {
  const orphanDemandes = await prisma.demande.findMany({
    where: { email: client.email, clientId: null },
  });

  for (const demande of orphanDemandes) {
    await prisma.demande.update({ where: { id: demande.id }, data: { clientId: client.id } });
    await createMissionFromDemande(client.id, demande);
  }

  return orphanDemandes.length;
}
