import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { avisSchema, avisStatusValues } from "@/lib/validations/avis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status = avisStatusValues.find((value) => value === statusParam);

  const avis = await prisma.avis.findMany({
    where: status ? { status } : undefined,
    include: { client: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ avis });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = avisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const item = await prisma.avis.create({ data: parsed.data });
  return NextResponse.json({ item }, { status: 201 });
}
