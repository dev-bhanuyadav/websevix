import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/signup"];

function isProtected(pathname: string): boolean {
  return protectedRoutes.some((r) => pathname.startsWith(r));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let valid = false;
  if (refreshToken && process.env.JWT_REFRESH_SECRET) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
      await jwtVerify(refreshToken, secret);
      valid = true;
    } catch {
      valid = false;
    }
  }
  if (isProtected(pathname) && !valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (isAuthRoute(pathname) && valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/login/:path*", "/signup", "/signup/:path*"],
};
