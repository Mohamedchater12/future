import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDemandeSchema } from "@/lib/validations/demande";
import { createMissionFromDemande, linkOrphanDemandesToClient } from "@/lib/missionFromDemande";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = updateDemandeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Keep a copy of requested language if sent by the admin UI
  const requestedLang = typeof body.lang === "string" ? (body.lang === "ar" ? "ar" : "en") : "en";

  const demande = await prisma.demande.update({
    where: { id: params.id },
    data: parsed.data,
    include: { client: { select: { id: true, name: true, email: true } } },
  });

  // If the demande was marked as TRAITE and isn't yet linked to a client,
  // auto-convert it (create client, mission, message, notification).
  try {
    if (parsed.data.status === "TRAITE" && !demande.clientId) {
      const client = await prisma.client.create({
        data: {
          name: `${demande.firstName || ""} ${demande.lastName || ""}`.trim(),
          company: demande.company,
          email: demande.email,
          phone: demande.phone,
          project: demande.service,
        },
      });

      // Attach demande to client and create mission(s)
      await prisma.demande.update({ where: { id: demande.id }, data: { clientId: client.id } });
      await createMissionFromDemande(client.id, demande as any);
      await linkOrphanDemandesToClient(client as any);

      const firstName = (client.name || "").split(" ")[0] || "";
      let content = "";
      if (requestedLang === "ar") {
        content = `خبر سار ${firstName} ! تم قبول طلبك بخصوص « ${demande.service} ». نبدأ المشروع — يمكنك متابعة تقدمه في \"طلباتى\".`;
      } else {
        content = `Good news ${firstName}! Your request regarding “${demande.service}” has been accepted. We are starting the project — you can follow its progress in \"My requests\".`;
      }

      await prisma.message.create({ data: { clientId: client.id, sender: "ADMIN", content } });

      await prisma.notification.create({
        data: {
          type: "CLIENT_CONVERTI",
          message: `${client.name} converti en client`,
          link: `/admin/clients?id=${client.id}`,
        },
      });

      // Update the demande object to include the new client for the response
      const updated = await prisma.demande.findUnique({ where: { id: demande.id }, include: { client: { select: { id: true, name: true } } } });
      return NextResponse.json({ demande: updated });
    }
  } catch (e) {
    // Log or ignore; we still return the updated demande
    console.error("auto-convert failed", e);
  }

  return NextResponse.json({ demande });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.demande.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
