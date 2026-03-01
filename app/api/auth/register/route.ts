import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import { RefreshToken } from "@/models/RefreshToken";
import { registerSchema } from "@/lib/validations";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { toPublic } from "@/models/User";
import { jsonResponse } from "@/lib/api";
import { cookies } from "next/headers";

const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors;
      return jsonResponse({ error: "Validation failed", details: msg }, 400);
    }
    const { email, firstName, lastName, phone, role, otp } = parsed.data;
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return jsonResponse({ error: "Email already registered" }, 409);
    }
    const otpDoc = await OTP.findOne({
      email,
      type: "signup",
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return jsonResponse({ error: "OTP expired or invalid" }, 400);
    }
    if (otpDoc.attempts >= 5) {
      return jsonResponse({ error: "Too many attempts" }, 400);
    }
    otpDoc.attempts += 1;
    await otpDoc.save();
    const valid = await bcrypt.compare(otp, otpDoc.otp);
    if (!valid) {
      return jsonResponse({ error: "Invalid OTP" }, 400);
    }
    otpDoc.used = true;
    await otpDoc.save();
    const user = await User.create({
      email,
      firstName,
      lastName,
      phone,
      role,
      isVerified: true,
    });
    const accessToken = await signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
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
    return jsonResponse({
      success: true,
      accessToken,
      user: toPublic(user),
    });
  } catch (e) {
    console.error("[register]", e);
    return jsonResponse({ error: "Registration failed" }, 500);
  }
}
