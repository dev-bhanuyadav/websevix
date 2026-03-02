import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { Mandate } from "@/models/Mandate";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);
    await connectDB();

    // Already has an active/authenticated mandate — nothing to do
    const existing = await Mandate.findOne({
      clientId: payload.userId,
      status:   { $in: ["active", "authenticated"] },
    });
    if (existing) return jsonResponse({ alreadyActive: true, mandate: existing });

    const user = await User.findById(payload.userId).lean() as {
      firstName?: string; lastName?: string; email?: string; phone?: string;
    } | null;

    // ── Try real Razorpay ────────────────────────────────────────────────────
    try {
      const { getRazorpay } = await import("@/lib/razorpay");
      const rzp   = getRazorpay();
      const order = await rzp.orders.create({
        amount:   200,          // ₹2 in paise — one-time verification charge
        currency: "INR",
        receipt:  `mandate_${Date.now()}`,
      });

      return jsonResponse({
        success:  true,
        orderId:  order.id,
        amount:   200,
        currency: "INR",
        keyId:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        prefill: {
          name:    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
          email:   user?.email   ?? "",
          contact: user?.phone   ?? "",
        },
      });
    } catch (rzErr) {
      const msg = rzErr instanceof Error ? rzErr.message : String(rzErr);
      console.error("[mandate/create] Razorpay error:", msg);

      // ── Mock mode (keys not configured or Razorpay unreachable) ──────────
      const mandate = await Mandate.create({
        clientId:          payload.userId,
        razorpayMandateId: `mock_${Date.now()}`,
        subscriptionId:    `mock_sub_${Date.now()}`,
        maxAmount:         15000,
        status:            "authenticated",
        mandateNumber:     1,
        paymentMethod:     "Mock (Dev)",
        maskedAccount:     "mock@upi",
        activatedAt:       new Date(),
      });
      return jsonResponse({ success: true, mock: true, mandate });
    }
  } catch (e) {
    console.error("[mandate/create]", e);
    return jsonResponse({ error: "Failed to initiate autopay setup" }, 500);
  }
}
