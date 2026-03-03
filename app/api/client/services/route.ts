export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { ClientService } from "@/models/ClientService";
import { ServiceInvoice } from "@/models/ServiceInvoice";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    await connectDB();

    const [services, invoices] = await Promise.all([
      ClientService.find({ clientId: payload.userId })
        .populate("serviceId", "name description category icon basePrice billingCycle features isMandatory")
        .sort({ createdAt: -1 })
        .lean(),
      ServiceInvoice.find({ clientId: payload.userId })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    const now = new Date();
    const servicesWithDue = services.map(s => {
      const next = s.nextBillingDate ? new Date(s.nextBillingDate) : null;
      const isDue = s.status === "active" && next && next <= now;
      return { ...s, isDue: !!isDue };
    });

    const active = services.filter(s => s.status === "active");
    const monthlyTotal = active.reduce((sum, s) => {
      const svc = s.serviceId as unknown as { basePrice: number };
      return sum + (s.customPrice ?? svc.basePrice);
    }, 0);

    return jsonResponse({ services: servicesWithDue, invoices, monthlyTotal });
  } catch (e) {
    console.error("[client/services GET]", e);
    return jsonResponse({ error: "Failed to fetch services" }, 500);
  }
}
