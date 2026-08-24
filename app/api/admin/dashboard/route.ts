import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats, getRecentActivity, getDemandesPerWeek } from "@/lib/dashboard";

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "ar" ? "ar" : "en";

  const [stats, activity, weeklyDemandes] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(8, lang),
    getDemandesPerWeek(8, lang),
  ]);

  return NextResponse.json({ stats, activity, weeklyDemandes });
}
