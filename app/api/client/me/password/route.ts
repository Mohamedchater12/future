import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientChangePasswordSchema } from "@/lib/validations/clientAuth";

export async function PATCH(request: Request) {
  const session = await getServerSession(clientAuthOptions);
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = clientChangePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const client = await prisma.client.findUnique({ where: { id: session!.user.id } });
  if (!client?.passwordHash) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, client.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "invalid_current_password" }, { status: 422 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.client.update({ where: { id: client.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
