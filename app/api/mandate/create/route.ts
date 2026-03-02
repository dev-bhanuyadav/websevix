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
      razorpayCustomerId?: string;
    } | null;

    // ── Try real Razorpay ─────────────────────────────────────────────────────
    try {
      const { getRazorpay } = await import("@/lib/razorpay");
      const rzp = getRazorpay();

      // Step 1 — Create or reuse Razorpay Customer
      let customerId = user?.razorpayCustomerId ?? "";
      if (!customerId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customer = await (rzp as any).customers.create({
          name:          `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Client",
          email:         user?.email   ?? "",
          contact:       user?.phone   ?? "",
          fail_existing: "0",           // don't fail if already exists, return existing
        });
        customerId = customer.id as string;
        // Persist to avoid re-creating on every visit
        await User.findByIdAndUpdate(payload.userId, { razorpayCustomerId: customerId });
      }

      // Step 2 — Create ₹2 order (recurring flag lives in checkout, not in order)
      const order = await rzp.orders.create({
        amount:   200,           // ₹2 in paise
        currency: "INR",
        receipt:  `mandate_${Date.now()}`,
      });

      const appUrl      = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const callbackUrl = `${appUrl}/api/mandate/callback?userId=${payload.userId}`;

      return jsonResponse({
        success:      true,
        orderId:      order.id,
        customerId,
        amount:       200,
        currency:     "INR",
        keyId:        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        callbackUrl,
        prefill: {
          name:    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
          email:   user?.email  ?? "",
          contact: user?.phone  ?? "",
        },
      });
    } catch (rzErr) {
      // ── Mock / Dev fallback (no Razorpay keys or unreachable) ──────────────
      console.warn("[mandate/create] Razorpay unavailable — using mock:", rzErr instanceof Error ? rzErr.message : rzErr);
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
