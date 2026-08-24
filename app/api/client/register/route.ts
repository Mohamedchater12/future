import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clientRegisterSchema } from "@/lib/validations/clientAuth";
import { linkOrphanDemandesToClient } from "@/lib/missionFromDemande";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = clientRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, password, company, phone } = parsed.data;

  const existing = await prisma.client.findFirst({ where: { email } });

  if (existing?.passwordHash) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let client;

  if (existing) {
    // Le lead existait déjà (converti depuis une Demande) mais n'avait pas
    // encore de compte portail — l'inscription "réclame" ce Client existant
    // plutôt que d'en créer un doublon.
    client = await prisma.client.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        name,
        phone: phone ?? existing.phone,
        company: company ?? existing.company,
      },
    });
  } else {
    client = await prisma.client.create({
      data: { name, email, phone, company, passwordHash, status: "ACTIF" },
    });
  }

  // Le client a pu remplir le formulaire de contact avant d'avoir un compte :
  // on rattache maintenant toute demande en attente sous ce même email pour
  // qu'elle apparaisse immédiatement dans son "Mes demandes".
  await linkOrphanDemandesToClient(client);

  return NextResponse.json({ ok: true }, { status: existing ? 200 : 201 });
}
