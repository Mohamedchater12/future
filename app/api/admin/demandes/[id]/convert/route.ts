import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMissionFromDemande, linkOrphanDemandesToClient } from "@/lib/missionFromDemande";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const demande = await prisma.demande.findUnique({ where: { id: params.id } });
  let lang = "en";
  try {
    const body = await request.json().catch(() => null);
    if (body && typeof body.lang === "string") {
      lang = body.lang === "ar" ? "ar" : "en";
    }
  } catch (e) {
    // ignore and default to en
  }
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
  const firstName = client.name.split(" ")[0];
  let content = "";
  if (lang === "ar") {
    content = `خبر سار ${firstName} ! تم قبول طلبك بخصوص « ${demande.service} ». نبدأ المشروع — يمكنك متابعة تقدمه في "طلباتى".`;
  } else {
    // default to English
    content = `Good news ${firstName}! Your request regarding “${demande.service}” has been accepted. We are starting the project — you can follow its progress in "My requests".`;
  }

  await prisma.message.create({
    data: {
      clientId: client.id,
      sender: "ADMIN",
      content,
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
