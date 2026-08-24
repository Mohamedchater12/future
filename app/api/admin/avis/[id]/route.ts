import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateAvisSchema } from "@/lib/validations/avis";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = updateAvisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const item = await prisma.avis.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.avis.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
