import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieNames, useSecureCookies } from "@/lib/auth-cookies";

const secret = process.env.NEXTAUTH_SECRET;

function getAdminToken(request: NextRequest) {
  return getToken({
    req: request,
    secret,
    cookieName: authCookieNames.admin.sessionToken,
    secureCookie: useSecureCookies,
  });
}

function getClientToken(request: NextRequest) {
  return getToken({
    req: request,
    secret,
    cookieName: authCookieNames.client.sessionToken,
    secureCookie: useSecureCookies,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin");
  // /api/client/register is the signup endpoint — called before any client
  // session exists, so it must stay reachable without a token.
  const isClientApi = pathname.startsWith("/api/client") && pathname !== "/api/client/register";
  const isAdminLoginPage = pathname === "/admin/login";
  const isClientAuthPage =
    pathname === "/espace-client/connexion" || pathname === "/espace-client/inscription";

  if (isAdminApi) {
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isClientApi) {
    const token = await getClientToken(request);
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isAdminLoginPage) {
    const token = await getAdminToken(request);
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isClientAuthPage) {
    const token = await getClientToken(request);
    if (token) {
      return NextResponse.redirect(new URL("/espace-client/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/espace-client")) {
    const token = await getClientToken(request);
    if (!token) {
      return NextResponse.redirect(new URL("/espace-client/connexion", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/espace-client/:path*", "/api/client/:path*"],
};
