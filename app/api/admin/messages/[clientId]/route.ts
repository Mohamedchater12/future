import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations/message";

export async function GET(_request: Request, { params }: { params: { clientId: string } }) {
  const messages = await prisma.message.findMany({
    where: { clientId: params.clientId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request, { params }: { params: { clientId: string } }) {
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

  const message = await prisma.message.create({
    data: { clientId: params.clientId, sender: "ADMIN", content: parsed.data.content },
  });

  return NextResponse.json({ message }, { status: 201 });
}
