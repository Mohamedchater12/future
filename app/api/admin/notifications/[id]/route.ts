import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const read = typeof body?.read === "boolean" ? body.read : true;

  const notification = await prisma.notification.update({
    where: { id: params.id },
    data: { read },
  });

  return NextResponse.json({ notification });
}
