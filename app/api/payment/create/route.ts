import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    await verifyAccessToken(auth);

    const body = await request.json();
    const { amount = 500, currency = "INR", receipt } = body;

    try {
      const { getRazorpay } = await import("@/lib/razorpay");
      const rz = getRazorpay();

      const order = await rz.orders.create({
        amount:   amount * 100, // paise
        currency,
        receipt:  receipt ?? `ws_${Date.now()}`,
      });

      return jsonResponse({ success: true, order });
    } catch (rzErr) {
      const msg = rzErr instanceof Error ? rzErr.message : String(rzErr);
      if (msg.includes("not configured")) {
        // Dev mode: return mock order for testing
        return jsonResponse({
          success: true,
          order: {
            id:       `order_mock_${Date.now()}`,
            amount:   amount * 100,
            currency,
            status:   "created",
            _mock:    true,
          },
        });
      }
      throw rzErr;
    }
  } catch (e) {
    console.error("[payment/create]", e);
    return jsonResponse({ error: "Failed to create payment order" }, 500);
  }
}
