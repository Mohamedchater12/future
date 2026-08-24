import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(50, Number(searchParams.get("limit") ?? "10") || 10);

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.notification.count({ where: { read: false } }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}
