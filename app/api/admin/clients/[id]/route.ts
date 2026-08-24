import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateClientSchema } from "@/lib/validations/client";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ client });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = updateClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const client = await prisma.client.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ client });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.client.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
