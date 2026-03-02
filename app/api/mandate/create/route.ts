import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { Mandate } from "@/models/Mandate";
import { User } from "@/models/User";

async function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  const Razorpay = (await import("razorpay")).default;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);
    await connectDB();

    // Already has active mandate?
    const existing = await Mandate.findOne({
      clientId: payload.userId,
      status:   { $in: ["active", "authenticated"] },
    });
    if (existing) return jsonResponse({ alreadyActive: true, mandate: existing });

    const rzp = await getRazorpay();

    // ── Mock mode (no Razorpay keys) ────────────────────────────────────────
    if (!rzp) {
      const mandate = await Mandate.create({
        clientId:          payload.userId,
        razorpayMandateId: `mock_${Date.now()}`,
        subscriptionId:    `mock_sub_${Date.now()}`,
        maxAmount:         15000,
        status:            "authenticated",
        mandateNumber:     1,
        paymentMethod:     "UPI (Mock)",
        maskedAccount:     "mock@upi",
        activatedAt:       new Date(),
      });
      return jsonResponse({ success: true, mock: true, mandate });
    }

    // ── Create ₹2 order for autopay verification ─────────────────────────
    const user  = await User.findById(payload.userId).lean() as {
      firstName?: string; lastName?: string; email?: string; phone?: string;
    } | null;

    const order = await rzp.orders.create({
      amount:   200,        // ₹2 in paise — verification charge
      currency: "INR",
      receipt:  `mandate_${payload.userId}_${Date.now()}`,
      notes: {
        purpose:  "Websevix Autopay Setup",
        clientId: payload.userId,
        type:     "mandate_setup",
      },
    });

    return jsonResponse({
      success:  true,
      orderId:  order.id,
      amount:   200,
      currency: "INR",
      keyId:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      prefill: {
        name:    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        email:   user?.email ?? "",
        contact: user?.phone ?? "",
      },
    });
  } catch (e) {
    console.error("[mandate/create]", e);
    return jsonResponse({ error: "Failed to initiate autopay setup" }, 500);
  }
}
