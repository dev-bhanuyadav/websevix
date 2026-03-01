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

const registerSchema = z.object({
  email:     z.string().email("Valid email required"),
  firstName: z.string().min(1).max(50).trim(),
  lastName:  z.string().min(1).max(50).trim(),
  phone:     z.string().min(5).max(25).trim(),
  password:  z.string().min(8, "Password must be at least 8 characters").max(72),
  role:      z.enum(["client", "developer"]).default("client"),
});

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      const first  = Object.values(fields)[0]?.[0] ?? "Invalid input";
      return jsonResponse({ error: first, details: fields }, 400);
    }

    const { email, firstName, lastName, phone, password, role } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return jsonResponse({ error: "This email is already registered. Please sign in instead." }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role,
      isVerified: true,
      profileComplete: true,
    });

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
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   REFRESH_MAX_AGE,
      path:     "/",
    });

    return jsonResponse({ success: true, accessToken, user: toPublic(user) });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[register] ERROR:", msg);
    // Show real error in dev; generic in prod
    const detail = process.env.NODE_ENV !== "production" ? msg : "Registration failed. Please try again.";
    return jsonResponse({ error: detail }, 500);
  }
}
