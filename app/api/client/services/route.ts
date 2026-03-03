export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { ClientService } from "@/models/ClientService";
import { ServiceInvoice } from "@/models/ServiceInvoice";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Please log in to view services." }, 401);
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
    const servicesWithDue = services.map((s: { nextBillingDate?: Date; status: string; [k: string]: unknown }) => {
      const next = s.nextBillingDate ? new Date(s.nextBillingDate) : null;
      const isDue = s.status === "active" && next && next <= now;
      return { ...s, isDue: !!isDue };
    });

    const active = services.filter((s: { status: string }) => s.status === "active");
    const monthlyTotal = active.reduce((sum: number, s: { serviceId?: { basePrice?: number }; customPrice?: number }) => {
      const svc = s.serviceId as { basePrice?: number } | undefined;
      return sum + (s.customPrice ?? svc?.basePrice ?? 0);
    }, 0);

    return jsonResponse({ services: servicesWithDue, invoices, monthlyTotal });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Unauthorized") || msg.includes("jwt") || msg.includes("expired") || msg.includes("invalid")) {
      return jsonResponse({ error: "Session expired. Please log in again." }, 401);
    }
    if (msg.includes("MONGODB_URI") || msg.includes("MongoNetworkError") || msg.includes("connect ECONNREFUSED")) {
      console.error("[client/services GET] DB:", e);
      return jsonResponse({ error: "Services temporarily unavailable. Please try again in a moment." }, 503);
    }
    console.error("[client/services GET]", e);
    return jsonResponse({ error: "Failed to load services. Please try again." }, 500);
  }
}
