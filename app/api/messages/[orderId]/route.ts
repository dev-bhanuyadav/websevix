import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { jsonResponse } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import { Order } from "@/models/Order";
import { verifyAccessToken } from "@/lib/jwt";

function buildOrderQuery(id: string, clientId: string) {
  const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
  return isObjectId
    ? { $or: [{ _id: id }, { orderId: id }], clientId }
    : { orderId: id, clientId };
}

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    await connectDB();
    const order = await Order.findOne(buildOrderQuery(params.orderId, payload.userId));
    if (!order) return jsonResponse({ error: "Order not found" }, 404);

    const messages = await Message.find({ orderId: order._id }).sort({ createdAt: 1 }).lean();
    return jsonResponse({ messages });
  } catch (e) {
    console.error("[messages GET]", e);
    return jsonResponse({ error: "Failed to fetch messages" }, 500);
  }
}

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);

    await connectDB();
    const order = await Order.findOne(buildOrderQuery(params.orderId, payload.userId));
    if (!order) return jsonResponse({ error: "Order not found" }, 404);

    const body = await request.json();
    const { type = "text", content, file } = body;
    if (!content && !file) return jsonResponse({ error: "content or file required" }, 400);

    const message = await Message.create({
      orderId:    order._id,
      senderId:   payload.userId,
      senderRole: "client",
      type,
      content,
      file,
    });

    try {
      const { getPusher, orderChannel, PUSHER_EVENTS } = await import("@/lib/pusher");
      await getPusher().trigger(orderChannel(order.orderId), PUSHER_EVENTS.NEW_MESSAGE, { message: message.toObject() });
    } catch { /* Pusher not configured */ }

    return jsonResponse({ success: true, message: message.toObject() }, 201);
  } catch (e) {
    console.error("[messages POST]", e);
    return jsonResponse({ error: "Failed to send message" }, 500);
  }
}
