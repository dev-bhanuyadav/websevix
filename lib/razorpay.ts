import Razorpay from "razorpay";
import crypto from "crypto";

let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (_razorpay) return _razorpay;
  
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys not configured");
  }
  
  // Validate key format
  if (!keyId.startsWith("rzp_")) {
    throw new Error("Invalid Razorpay key format");
  }
  
  try {
    _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    return _razorpay;
  } catch (err) {
    throw new Error(`Razorpay initialization failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return !!(keyId && keySecret && keyId.startsWith("rzp_"));
}

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET missing");
  const body    = `${params.orderId}|${params.paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === params.signature;
}
