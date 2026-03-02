import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge:   0,
    path:     "/",
  };
  cookieStore.set("adminToken",   "", opts);
  cookieStore.set("refreshToken", "", opts);
  return NextResponse.json({ success: true });
}
