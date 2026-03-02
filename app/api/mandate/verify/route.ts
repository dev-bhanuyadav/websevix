import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { Mandate } from "@/models/Mandate";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    const body = await request.json() as {
      razorpay_order_id:   string;
      razorpay_payment_id: string;
      razorpay_signature:  string;
      paymentMethod?:      string;
      maskedAccount?:      string;
    };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
    const generated = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (keySecret && generated !== razorpay_signature) {
      return jsonResponse({ error: "Payment verification failed" }, 400);
    }

    await connectDB();

    // Upsert mandate — if already active, return it
    const existing = await Mandate.findOne({
      clientId: payload.userId,
      status:   { $in: ["active", "authenticated"] },
    });
    if (existing) return jsonResponse({ success: true, mandate: existing });

    const mandate = await Mandate.create({
      clientId:          payload.userId,
      razorpayMandateId: razorpay_payment_id,
      subscriptionId:    razorpay_order_id,
      maxAmount:         15000,
      status:            "authenticated",
      mandateNumber:     1,
      paymentMethod:     body.paymentMethod ?? "Card/UPI",
      maskedAccount:     body.maskedAccount ?? "",
      activatedAt:       new Date(),
    });

    return jsonResponse({ success: true, mandate });
  } catch (e) {
    console.error("[mandate/verify]", e);
    return jsonResponse({ error: "Verification failed" }, 500);
  }
}
