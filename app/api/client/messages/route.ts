import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations/message";
import { getClientMessages } from "@/lib/client-space/dashboard";

export async function GET() {
  const session = await getServerSession(clientAuthOptions);
  const messages = await getClientMessages(session!.user.id);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const session = await getServerSession(clientAuthOptions);
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const client = await prisma.client.findUnique({ where: { id: session!.user.id } });

  const message = await prisma.message.create({
    data: { clientId: session!.user.id, sender: "CLIENT", content: parsed.data.content },
  });

  await prisma.notification.create({
    data: {
      type: "NOUVEAU_MESSAGE_CLIENT",
      message: `Nouveau message de ${client?.name ?? "un client"}`,
      link: `/admin/messages?clientId=${session!.user.id}`,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
