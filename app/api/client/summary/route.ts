import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth";
import { getClientSummary } from "@/lib/client-space/dashboard";

export async function GET(request: NextRequest) {
  const session = await getServerSession(clientAuthOptions);
  const lang = request.nextUrl.searchParams.get("lang") === "ar" ? "ar" : "en";
  const summary = await getClientSummary(session!.user.id, lang);
  return NextResponse.json(summary);
}
