import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({
    where: { passwordHash: { not: null } },
    select: {
      id: true,
      name: true,
      company: true,
      email: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { sender: "CLIENT", read: false } } } },
    },
  });

  const conversations = clients
    .map((client) => ({
      client: { id: client.id, name: client.name, company: client.company, email: client.email },
      lastMessage: client.messages[0] ?? null,
      unreadCount: client._count.messages,
    }))
    .sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  return NextResponse.json({ conversations });
}
