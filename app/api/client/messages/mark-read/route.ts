import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(clientAuthOptions);

  await prisma.message.updateMany({
    where: { clientId: session!.user.id, sender: "ADMIN", read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
