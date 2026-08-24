import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientProfileSchema } from "@/lib/validations/clientAuth";

export async function GET() {
  const session = await getServerSession(clientAuthOptions);
  const client = await prisma.client.findUnique({
    where: { id: session!.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!client) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(clientAuthOptions);
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = clientProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, company, phone } = parsed.data;

  const emailTakenElsewhere = await prisma.client.findFirst({
    where: { email, passwordHash: { not: null }, NOT: { id: session!.user.id } },
  });
  if (emailTakenElsewhere) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const client = await prisma.client.update({
    where: { id: session!.user.id },
    data: { name, email, company, phone },
    select: { id: true, name: true, email: true, phone: true, company: true },
  });

  return NextResponse.json({ client });
}
