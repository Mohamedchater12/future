import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toolSchema } from "@/lib/validations/tool";

export async function GET() {
  const tools = await prisma.tool.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ tools });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = toolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const tool = await prisma.tool.create({ data: parsed.data });
  return NextResponse.json({ tool }, { status: 201 });
}
