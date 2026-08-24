import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientAvisSchema } from "@/lib/validations/clientAvis";
import { getClientReviews } from "@/lib/client-space/dashboard";

export async function GET() {
  const session = await getServerSession(clientAuthOptions);
  const avis = await getClientReviews(session!.user.id);
  return NextResponse.json({ avis });
}

export async function POST(request: Request) {
  const session = await getServerSession(clientAuthOptions);
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = clientAvisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const client = await prisma.client.findUnique({ where: { id: session!.user.id } });
  if (!client) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const avis = await prisma.avis.create({
    data: {
      clientId: client.id,
      name: client.name,
      company: client.company,
      rating: parsed.data.rating,
      quote: parsed.data.quote,
      status: "EN_ATTENTE",
    },
  });

  await prisma.notification.create({
    data: {
      type: "NOUVEL_AVIS",
      message: `Nouvel avis de ${client.name} en attente de validation`,
      link: `/admin/avis?id=${avis.id}`,
    },
  });

  return NextResponse.json({ avis }, { status: 201 });
}
