import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDemandeSchema } from "@/lib/validations/demande";

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

  const demande = await prisma.demande.update({
    where: { id: params.id },
    data: parsed.data,
    include: { client: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ demande });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.demande.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
