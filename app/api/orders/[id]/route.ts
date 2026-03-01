import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { Order, toPublicOrder } from "@/models/Order";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    await connectDB();
    const order = await Order.findOne({ $or: [{ _id: params.id }, { orderId: params.id }], clientId: payload.userId }).lean();
    if (!order) return jsonResponse({ error: "Order not found" }, 404);

    return jsonResponse({ order: toPublicOrder(order as never) });
  } catch (e) {
    console.error("[orders/:id GET]", e);
    return jsonResponse({ error: "Failed to fetch order" }, 500);
  }
}
