import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trustedBySchema } from "@/lib/validations/trustedBy";

export async function GET() {
  const trustedBy = await prisma.trustedBy.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ trustedBy });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = trustedBySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const item = await prisma.trustedBy.create({ data: parsed.data });
  return NextResponse.json({ item }, { status: 201 });
}
