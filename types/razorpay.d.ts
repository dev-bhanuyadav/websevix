interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  // Recurring / AutoPay fields
  customer_id?: string;
  recurring?: "1" | "0";
  callback_url?: string;          // Redirect URL for recurring flow
  // Regular one-time payment
  handler?: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void; escape?: boolean };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayClass {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: () => void): void;
}

interface Window {
  Razorpay: RazorpayClass;
}
