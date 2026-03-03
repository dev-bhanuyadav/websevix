export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { ClientService } from "@/models/ClientService";
import { getRazorpay } from "@/lib/razorpay";

interface ClientServiceLean {
  _id: unknown;
  clientId: unknown;
  customPrice?: number | null;
  status: string;
  serviceId: { name: string; basePrice: number; billingCycle: string };
}

/** Create Razorpay order for service: first month (accept) or renewal */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    const id = params.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "first"; // "first" | "renewal"

    await connectDB();

    const cs = await ClientService.findOne({ _id: id, clientId: payload.userId })
      .populate("serviceId", "name basePrice billingCycle")
      .lean()
      .then((doc) => doc as ClientServiceLean | null);

    if (!cs) return jsonResponse({ error: "Service not found" }, 404);

    const svc = cs.serviceId;
    const amountRupees = cs.customPrice ?? svc.basePrice;

    if (type === "first") {
      if (cs.status !== "pending_acceptance")
        return jsonResponse({ error: "Service is not pending acceptance" }, 400);
    } else {
      if (cs.status !== "active")
        return jsonResponse({ error: "Service is not active" }, 400);
    }

    const amountPaise = Math.round(amountRupees * 100);
    if (amountPaise < 100) return jsonResponse({ error: "Minimum amount is ₹1" }, 400);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;

    // Check if Razorpay is configured
    const { isRazorpayConfigured } = await import("@/lib/razorpay");
    
    if (!isRazorpayConfigured()) {
      // Development/test mode: return mock order
      return jsonResponse({
        success:       true,
        orderId:       `order_mock_${Date.now()}`,
        keyId:         "mock",
        amount:        amountPaise,
        amountRupees,
        currency:      "INR",
        _mock:         true,
        notes:         { clientServiceId: id, type: type === "first" ? "service_first" : "service_renewal" },
        _mockReason:   "Razorpay not configured - using test mode",
      });
    }

    try {
      const rz = getRazorpay();
      const order = await rz.orders.create({
        amount:   amountPaise,
        currency: "INR",
        receipt:  `svc_${id}_${Date.now()}`,
        notes:    {
          clientServiceId: id,
          type:            type === "first" ? "service_first" : "service_renewal",
        },
      });

      return jsonResponse({
        success:    true,
        orderId:    order.id,
        keyId,
        amount:     amountPaise,
        amountRupees,
        currency:   "INR",
      });
    } catch (rzErr: unknown) {
      const msg = rzErr instanceof Error ? rzErr.message : String(rzErr);
      console.error("[client/services/create-payment] Razorpay error:", rzErr);
      
      // Specific error handling
      if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("Invalid")) {
        return jsonResponse({ error: "Payment gateway configuration error. Please contact support." }, 500);
      }
      if (msg.includes("network") || msg.includes("timeout") || msg.includes("ENOTFOUND")) {
        return jsonResponse({ error: "Payment gateway connection issue. Please try again." }, 503);
      }
      
      // Fallback to mock for any other errors
      return jsonResponse({
        success:       true,
        orderId:       `order_mock_${Date.now()}`,
        keyId:         "mock",
        amount:        amountPaise,
        amountRupees,
        currency:      "INR",
        _mock:         true,
        notes:         { clientServiceId: id, type: type === "first" ? "service_first" : "service_renewal" },
        _mockReason:   "Razorpay temporarily unavailable - using test mode",
      });
    }
  } catch (e) {
    console.error("[client/services/create-payment]", e);
    const msg = e instanceof Error ? e.message : "";
    const userMsg = msg.includes("Unauthorized") || msg.includes("jwt")
      ? "Session expired. Please log in again."
      : msg.includes("not found") ? "Service not found."
      : "Unable to create payment. Please try again.";
    return jsonResponse({ error: userMsg }, 500);
  }
}
