import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: { clientId: string } }) {
  await prisma.message.updateMany({
    where: { clientId: params.clientId, sender: "CLIENT", read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
