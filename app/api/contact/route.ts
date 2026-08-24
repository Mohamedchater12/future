import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/demande";
import { createMissionFromDemande } from "@/lib/missionFromDemande";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Si l'email correspond à un compte espace client déjà activé, on relie
  // directement la demande à ce client et on crée un suivi visible dans son
  // "Mes demandes" — pas besoin que l'admin la convertisse manuellement.
  // (Si le client n'a pas encore de compte, la demande reste "orpheline" et
  // sera automatiquement rattachée à son inscription — voir /api/client/register.)
  const existingClient = await prisma.client.findFirst({
    where: { email: parsed.data.email, passwordHash: { not: null } },
  });

  const demande = await prisma.demande.create({
    data: { ...parsed.data, clientId: existingClient?.id },
  });

  if (existingClient) {
    await createMissionFromDemande(existingClient.id, demande);
  }

  await prisma.notification.create({
    data: {
      type: "NOUVELLE_DEMANDE",
      message: `Nouvelle demande de ${demande.firstName} ${demande.lastName}`,
      link: `/admin/demandes?id=${demande.id}`,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
