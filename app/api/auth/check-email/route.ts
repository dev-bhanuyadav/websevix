import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { checkEmailSchema } from "@/lib/validations";
import { checkEmailLimit } from "@/lib/rateLimit";
import { getClientIp, jsonResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkEmailLimit(ip);
    if (!limit.allowed) {
      return jsonResponse(
        { error: "Too many requests", retryAfter: limit.retryAfter },
        429
      );
    }
    const body = await request.json();
    const parsed = checkEmailSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse({ error: "Invalid email" }, 400);
    }
    const { email } = parsed.data;
    await connectDB();
    const user = await User.findOne({ email }).select("firstName").lean();
    if (user) {
      return jsonResponse({ exists: true, firstName: user.firstName });
    }
    return jsonResponse({ exists: false });
  } catch (e) {
    console.error("[check-email]", e);
    return jsonResponse({ error: "Server error" }, 500);
  }
}
