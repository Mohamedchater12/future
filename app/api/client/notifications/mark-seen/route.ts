import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(clientAuthOptions);

  await prisma.client.update({
    where: { id: session!.user.id },
    data: { notificationsSeenAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
