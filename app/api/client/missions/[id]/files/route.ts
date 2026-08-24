import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { missionFileSchema } from "@/lib/validations/mission";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(clientAuthOptions);

  // Un client ne doit jamais pouvoir attacher un fichier à un projet qui
  // n'est pas le sien — chaque projet reste cloisonné à son propriétaire.
  const mission = await prisma.mission.findUnique({ where: { id: params.id } });
  if (!mission || mission.clientId !== session!.user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

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
      missionId: mission.id,
      name: parsed.data.name,
      url: parsed.data.url,
      uploadedBy: "CLIENT",
    },
  });

  await prisma.mission.update({ where: { id: mission.id }, data: { updatedAt: new Date() } });

  await prisma.notification.create({
    data: {
      type: "NOUVEAU_FICHIER_CLIENT",
      message: `${mission.title} : nouveau fichier envoyé par le client`,
      link: `/admin/missions`,
    },
  });

  return NextResponse.json({ file }, { status: 201 });
}
