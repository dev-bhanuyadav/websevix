import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { ClientService } from "@/models/ClientService";
import { Mandate } from "@/models/Mandate";
import { ServiceInvoice } from "@/models/ServiceInvoice";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    await connectDB();

    const [services, mandate, invoices] = await Promise.all([
      ClientService.find({ clientId: payload.userId })
        .populate("serviceId", "name description category icon basePrice billingCycle features isMandatory")
        .sort({ createdAt: -1 })
        .lean(),
      Mandate.findOne({ clientId: payload.userId, status: { $in: ["active", "authenticated"] } }).lean(),
      ServiceInvoice.find({ clientId: payload.userId })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    const active = services.filter(s => s.status === "active");
    const monthlyTotal = active.reduce((sum, s) => {
      const svc = s.serviceId as unknown as { basePrice: number };
      return sum + (s.customPrice ?? svc.basePrice);
    }, 0);

    return jsonResponse({ services, mandate, invoices, monthlyTotal });
  } catch (e) {
    console.error("[client/services GET]", e);
    return jsonResponse({ error: "Failed to fetch services" }, 500);
  }
}
