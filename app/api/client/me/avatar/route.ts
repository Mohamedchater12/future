import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getServerSession(clientAuthOptions);
  const body = await request.json().catch(() => null);

  // avatarUrl is a data: URL (see AvatarUpload) or null to remove the photo.
  const avatarUrl = typeof body?.avatarUrl === "string" ? body.avatarUrl : null;

  const client = await prisma.client.update({
    where: { id: session!.user.id },
    data: { avatarUrl },
    select: { id: true, avatarUrl: true },
  });

  return NextResponse.json({ client });
}
