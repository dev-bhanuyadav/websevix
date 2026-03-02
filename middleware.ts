import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard"];
const adminRoutes     = ["/admin"];
const authRoutes      = ["/login", "/signup"];

function isProtected(pathname: string): boolean {
  return protectedRoutes.some(r => pathname.startsWith(r));
}
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));
}
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));
}

async function verifyToken(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as { userId?: string; role?: string };
  } catch { return null; }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken  = request.cookies.get("refreshToken")?.value;
  const secret        = process.env.JWT_REFRESH_SECRET ?? "";

  let valid    = false;
  let role     = "";

  if (refreshToken && secret) {
    const payload = await verifyToken(refreshToken, secret);
    if (payload) { valid = true; role = payload.role ?? "client"; }
  }

  // /admin/* — must be admin
  if (isAdminRoute(pathname)) {
    if (!valid) {
      const url = request.nextUrl.clone(); url.pathname = "/"; return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      const url = request.nextUrl.clone(); url.pathname = "/dashboard/client"; return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // /dashboard/* — must be logged in
  if (isProtected(pathname) && !valid) {
    const url = request.nextUrl.clone(); url.pathname = "/login"; return NextResponse.redirect(url);
  }

  // Already logged-in → skip auth pages
  if (isAuthRoute(pathname) && valid) {
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/dashboard/client";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/login/:path*", "/signup", "/signup/:path*"],
};
