import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/api";
import { verifyAccessToken } from "@/lib/jwt";
import { Mandate } from "@/models/Mandate";
import { createPlan, createSubscription } from "@/lib/razorpayMandate";
import { calculateMRR } from "@/lib/billingEngine";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!auth) return jsonResponse({ error: "Unauthorized" }, 401);
    const payload = await verifyAccessToken(auth);
    await connectDB();

    // Determine total monthly amount
    const { total } = await calculateMRR();
    const mandatesNeeded = Math.max(1, Math.ceil(total / 15000));
    const existingCount  = await Mandate.countDocuments({
      clientId: new mongoose.Types.ObjectId(payload.userId),
      status:   { $in: ["active", "authenticated", "created"] },
    });
    const nextMandateNum = existingCount + 1;
    if (nextMandateNum > mandatesNeeded && existingCount > 0) {
      return jsonResponse({ message: "Sufficient mandates already exist" });
    }

    const amount = Math.min(total - (existingCount * 15000), 15000);
    const plan   = await createPlan(Math.max(amount, 1), `Websevix Services — Mandate ${nextMandateNum}`);
    const sub    = await createSubscription(plan.id, payload.userId);

    const mandate = await Mandate.create({
      clientId:       new mongoose.Types.ObjectId(payload.userId),
      subscriptionId: sub.id,
      planId:         plan.id,
      maxAmount:      15000,
      status:         "created",
      mandateNumber:  nextMandateNum,
      shortUrl:       (sub as Record<string, unknown>).short_url ?? null,
    });

    return jsonResponse({ success: true, mandate, setupUrl: (sub as Record<string, unknown>).short_url });
  } catch (e) {
    console.error("[mandate/create]", e);
    return jsonResponse({ error: "Failed to create mandate" }, 500);
  }
}
