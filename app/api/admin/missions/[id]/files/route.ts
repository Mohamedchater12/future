import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { missionFileSchema } from "@/lib/validations/mission";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = missionFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const file = await prisma.missionFile.create({
    data: {
      missionId: params.id,
      name: parsed.data.name,
      url: parsed.data.url,
      uploadedBy: "ADMIN",
    },
  });

  await prisma.mission.update({ where: { id: params.id }, data: { updatedAt: new Date() } });

  return NextResponse.json({ file }, { status: 201 });
}
