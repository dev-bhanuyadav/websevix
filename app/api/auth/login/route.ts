import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User, toPublic } from "@/models/User";
import { RefreshToken } from "@/models/RefreshToken";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { jsonResponse } from "@/lib/api";
import { cookies } from "next/headers";
import { z } from "zod";

const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse({ error: "Email and password are required" }, 400);
    }

    const { email, password } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Generic message — don't reveal if email exists
      return jsonResponse({ error: "Invalid email or password" }, 401);
    }

    if (!user.password) {
      return jsonResponse({ error: "No password set for this account. Please contact support." }, 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return jsonResponse({ error: "Invalid email or password" }, 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken  = await signAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = await signRefreshToken({ userId: user._id.toString() });

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      expiresAt: new Date(Date.now() + REFRESH_MAX_AGE * 1000),
    });

    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_MAX_AGE,
      path: "/",
    });

    return jsonResponse({ success: true, accessToken, user: toPublic(user) });
  } catch (e) {
    console.error("[login]", e);
    return jsonResponse({ error: "Login failed. Please try again." }, 500);
  }
}
