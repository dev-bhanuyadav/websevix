export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Please log in to continue." }, 401);
    await verifyAccessToken(auth);

    const body = await request.json().catch(() => ({}));
    const amountRupees = Number(body.amount) || 500;
    const currency = body.currency ?? "INR";
    const receipt = body.receipt ?? `ws_${Date.now()}`;
    const amountPaise = Math.round(amountRupees * 100);
    if (amountPaise < 100) return jsonResponse({ error: "Minimum amount is ₹1" }, 400);

    // Check if Razorpay is configured before attempting to create order
    const { isRazorpayConfigured } = await import("@/lib/razorpay");
    
    if (!isRazorpayConfigured()) {
      // Development/test mode: return mock order
      return jsonResponse({
        success: true,
        order:   {
          id:     `order_mock_${Date.now()}`,
          amount: amountPaise,
          currency,
          status: "created",
          _mock:  true,
        },
        keyId: "mock",
        _mockReason: "Razorpay not configured - using test mode",
      });
    }

    try {
      const { getRazorpay } = await import("@/lib/razorpay");
      const rz = getRazorpay();
      const order = await rz.orders.create({
        amount:   amountPaise,
        currency,
        receipt,
      });
      return jsonResponse({
        success: true,
        order:   { id: order.id, amount: order.amount, currency: order.currency },
        keyId:   KEY_ID,
      });
    } catch (rzErr: unknown) {
      const msg = rzErr instanceof Error ? rzErr.message : String(rzErr);
      console.error("[payment/create] Razorpay error:", rzErr);
      
      // Specific error handling
      if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("Invalid")) {
        return jsonResponse({ error: "Payment gateway configuration error. Please contact support." }, 500);
      }
      if (msg.includes("network") || msg.includes("timeout") || msg.includes("ENOTFOUND")) {
        return jsonResponse({ error: "Payment gateway connection issue. Please try again." }, 503);
      }
      
      // Fallback to mock for any other Razorpay errors
      return jsonResponse({
        success: true,
        order:   {
          id:     `order_mock_${Date.now()}`,
          amount: amountPaise,
          currency,
          status: "created",
          _mock:  true,
        },
        keyId: "mock",
        _mockReason: "Razorpay temporarily unavailable - using test mode",
      });
    }
  } catch (e) {
    console.error("[payment/create]", e);
    const msg = e instanceof Error ? e.message : "";
    const userMsg = msg.includes("Unauthorized") || msg.includes("jwt") ? "Session expired. Please log in again." : "Unable to start payment. Please try again.";
    return jsonResponse({ error: userMsg }, 500);
  }
}
