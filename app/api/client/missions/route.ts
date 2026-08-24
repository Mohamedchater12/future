import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { getClientMissions } from "@/lib/client-space/dashboard";

export async function GET() {
  const session = await getServerSession(clientAuthOptions);
  const missions = await getClientMissions(session!.user.id);
  return NextResponse.json({ missions });
}
