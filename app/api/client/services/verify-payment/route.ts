export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { getRazorpay, verifyPaymentSignature } from "@/lib/razorpay";
import { ClientService } from "@/models/ClientService";
import { ServiceInvoice } from "@/models/ServiceInvoice";
import { nextInvoiceNo, currentMonth } from "@/lib/billingEngine";

/** After Razorpay success: activate service (first) or extend by 1 month (renewal) */
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      _mock,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id)
      return jsonResponse({ error: "Missing payment details" }, 400);

    if (!_mock) {
      const valid = verifyPaymentSignature({
        orderId:   razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });
      if (!valid) return jsonResponse({ error: "Invalid payment signature" }, 400);
    }

    await connectDB();

    let notes: { clientServiceId?: string; type?: string } = {};
    if (_mock) {
      notes = body.notes || {};
    } else {
      try {
        const rz = getRazorpay();
        const order = await rz.orders.fetch(razorpay_order_id);
        notes = (order.notes as Record<string, string>) || {};
      } catch {
        return jsonResponse({ error: "Could not verify order" }, 400);
      }
    }

    const clientServiceId = notes.clientServiceId;
    const type = notes.type;

    if (!clientServiceId || !type)
      return jsonResponse({ error: "Invalid order context" }, 400);

    const cs = await ClientService.findOne({
      _id:       clientServiceId,
      clientId:  payload.userId,
    })
      .populate<{ serviceId: { name: string; basePrice: number; billingCycle: string } }>("serviceId", "name basePrice billingCycle");

    if (!cs) return jsonResponse({ error: "Service not found" }, 404);

    const svc = cs.serviceId as unknown as { name: string; basePrice: number; billingCycle: string };
    const price = cs.customPrice ?? svc.basePrice;
    const now = new Date();
    const month = currentMonth();

    if (type === "service_first") {
      if (cs.status !== "pending_acceptance")
        return jsonResponse({ error: "Service already activated" }, 400);

      cs.status             = "active";
      cs.acceptedAt         = now;
      cs.billingStartDate   = now;
      cs.nextBillingDate    = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      cs.lastBilledAt      = now;
      await cs.save();

      const invoiceNo = await nextInvoiceNo(month);
      await ServiceInvoice.create({
        clientId:           cs.clientId,
        invoiceNo,
        month,
        lineItems:          [{ serviceName: svc.name, price, billingCycle: svc.billingCycle }],
        subtotal:           price,
        tax:                0,
        total:              price,
        status:             "paid",
        razorpayPaymentId:  razorpay_payment_id,
        paidAt:             now,
      });

      return jsonResponse({ success: true, message: "Service activated for 1 month" });
    }

    if (type === "service_renewal") {
      if (cs.status !== "active")
        return jsonResponse({ error: "Service is not active" }, 400);

      const nextMonth = new Date(cs.nextBillingDate ?? now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      cs.nextBillingDate = nextMonth;
      cs.lastBilledAt    = now;
      await cs.save();

      const invoiceNo = await nextInvoiceNo(month);
      await ServiceInvoice.create({
        clientId:           cs.clientId,
        invoiceNo,
        month,
        lineItems:          [{ serviceName: svc.name, price, billingCycle: svc.billingCycle }],
        subtotal:           price,
        tax:                0,
        total:              price,
        status:             "paid",
        razorpayPaymentId:  razorpay_payment_id,
        paidAt:             now,
      });

      return jsonResponse({ success: true, message: "Payment received. Service extended for 1 month." });
    }

    return jsonResponse({ error: "Unknown payment type" }, 400);
  } catch (e) {
    console.error("[client/services/verify-payment]", e);
    return jsonResponse({ error: "Payment verification failed" }, 500);
  }
}
