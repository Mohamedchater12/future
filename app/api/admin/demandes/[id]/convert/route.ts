import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMissionFromDemande, linkOrphanDemandesToClient } from "@/lib/missionFromDemande";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const demande = await prisma.demande.findUnique({ where: { id: params.id } });
  if (!demande) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (demande.clientId) {
    return NextResponse.json({ error: "already_converted" }, { status: 409 });
  }

  const client = await prisma.client.create({
    data: {
      name: `${demande.firstName} ${demande.lastName}`,
      company: demande.company,
      email: demande.email,
      phone: demande.phone,
      project: demande.service,
    },
  });

  const updatedDemande = await prisma.demande.update({
    where: { id: demande.id },
    data: { clientId: client.id, status: "TRAITE" },
    include: { client: { select: { id: true, name: true } } },
  });

  // La demande acceptée devient un suivi de travail visible dans "Client
  // work" — et toute autre demande en attente du même email (soumise avant
  // que ce client n'existe) est rattachée et suivie du même coup.
  await createMissionFromDemande(client.id, demande);
  await linkOrphanDemandesToClient(client);

  // Le client doit savoir que sa demande est acceptée : ce message système
  // remonte via le fil de messagerie existant (badge non-lu, notifications
  // dérivées) dès qu'il a accès à l'espace client.
  await prisma.message.create({
    data: {
      clientId: client.id,
      sender: "ADMIN",
      content: `Bonne nouvelle ${client.name.split(" ")[0]} ! Votre demande concernant « ${demande.service} » a été acceptée. Nous démarrons le projet — vous pouvez suivre son avancement dans "Mes demandes".`,
    },
  });

  await prisma.notification.create({
    data: {
      type: "CLIENT_CONVERTI",
      message: `${client.name} converti en client`,
      link: `/admin/clients?id=${client.id}`,
    },
  });

  return NextResponse.json({ client, demande: updatedDemande }, { status: 201 });
}
