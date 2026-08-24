import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { statSchema } from "@/lib/validations/stat";

export async function GET() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ stats });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = statSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const item = await prisma.stat.create({ data: parsed.data });
  return NextResponse.json({ item }, { status: 201 });
}
