"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, CreditCard, CheckCircle2, XCircle, Clock, AlertTriangle,
  FileText, Loader2, X, Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubStatus = "pending_acceptance" | "active" | "paused" | "cancelled" | "rejected";
type InvoiceStatus = "draft" | "sent" | "paid" | "failed" | "refunded";

interface PopulatedService {
  _id: string; name: string; description?: string; category: string;
  icon?: string; basePrice: number; billingCycle: string;
  features: string[]; isMandatory: boolean;
}
interface ClientSub {
  _id: string; serviceId: PopulatedService; customPrice?: number | null;
  status: SubStatus; isMandatory: boolean;
  nextBillingDate?: string; billingStartDate?: string; createdAt: string;
}
interface IMandate {
  _id: string; status: string; paymentMethod?: string;
  maskedAccount?: string; maxAmount: number; activatedAt?: string;
}
interface IInvoice {
  _id: string; invoiceNo: string; month: string; total: number;
  status: InvoiceStatus; lineItems: { serviceName: string; price: number }[];
  paidAt?: string; createdAt: string;
}

// Razorpay global types are in types/razorpay.d.ts

const STATUS_CFG: Record<SubStatus, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  pending_acceptance: { icon: <Clock size={12} />,         label: "Awaiting Response", color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  active:             { icon: <CheckCircle2 size={12} />,  label: "Active",            color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  paused:             { icon: <AlertTriangle size={12} />, label: "Paused",            color: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
  cancelled:          { icon: <XCircle size={12} />,       label: "Cancelled",         color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  rejected:           { icon: <XCircle size={12} />,       label: "Rejected",          color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

const INV_CFG: Record<InvoiceStatus, { label: string; color: string }> = {
  draft:    { label: "Draft",    color: "#64748B" },
  sent:     { label: "Due",      color: "#FBBF24" },
  paid:     { label: "Paid",     color: "#34D399" },
  failed:   { label: "Failed",   color: "#F87171" },
  refunded: { label: "Refunded", color: "#A78BFA" },
};

const CATEGORY_ICONS: Record<string, string> = {
  hosting: "🖥️", maintenance: "🔧", infrastructure: "⚙️",
  security: "🔒", domain: "🌐", integration: "⚡", support: "💬", custom: "📦",
};

// ─── Load Razorpay script ─────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src    = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Inner Page (needs useSearchParams — wrapped in Suspense below) ───────────

function ClientServicesInner() {
  const { accessToken }  = useAuth();
  const searchParams     = useSearchParams();
  const [subs,         setSubs]         = useState<ClientSub[]>([]);
  const [mandate,      setMandate]       = useState<IMandate | null>(null);
  const [invoices,     setInvoices]      = useState<IInvoice[]>([]);
  const [monthlyTotal, setMonthlyTotal]  = useState(0);
  const [loading,      setLoading]       = useState(true);
  const [settingUp,    setSettingUp]     = useState(false);
  const [autopayMsg,   setAutopayMsg]    = useState<{ type: "error" | "success"; text: string } | null>(null);
  const rzpScriptLoaded = useRef(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const r = await fetch("/api/client/services", { headers: { Authorization: `Bearer ${accessToken}` } });
      const d = await r.json();
      setSubs(d.services   ?? []);
      setMandate(d.mandate  ?? null);
      setInvoices(d.invoices ?? []);
      setMonthlyTotal(d.monthlyTotal ?? 0);
    } finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

  // Show success/fail toast when redirected back from Razorpay
  useEffect(() => {
    const status = searchParams.get("autopay");
    if (status === "success") {
      setAutopayMsg({ type: "success", text: "Autopay activated! ₹2 was verified via UPI AutoPay." });
      load();
    } else if (status === "failed") {
      setAutopayMsg({ type: "error", text: "Autopay setup failed or was cancelled. You can try again or pay manually from chat." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-load Razorpay script once services are fetched
  useEffect(() => {
    if (!rzpScriptLoaded.current && subs.length > 0) {
      rzpScriptLoaded.current = true;
      loadRazorpayScript();
    }
  }, [subs.length]);

  const handleAccept = async (id: string) => {
    await fetch(`/api/client/services/${id}/accept`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
    load();
  };

  const handleReject = async (id: string) => {
    if (!confirm("Decline this service?")) return;
    await fetch(`/api/client/services/${id}/reject`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
    load();
  };

  const handleCancel = async (id: string, name: string) => {
    if (!confirm(`Cancel "${name}"? This will stop future billing for this service.`)) return;
    await fetch(`/api/client/services/${id}/cancel`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
    load();
  };

  const setupAutopay = async () => {
    setSettingUp(true);
    setAutopayMsg(null);
    try {
      const loaded = await loadRazorpayScript();

      const r = await fetch("/api/mandate/create", {
        method:  "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const d = await r.json();

      if (d.alreadyActive) { load(); return; }

      // Mock mode — keys not configured, auto-activated
      if (d.mock) {
        setAutopayMsg({ type: "success", text: "Autopay activated successfully!" });
        load();
        return;
      }

      if (d.error || !d.orderId) {
        setAutopayMsg({
          type: "error",
          text: d.error ?? "Could not initiate autopay. Payments can still be made manually from chat.",
        });
        return;
      }

      if (!loaded || !window.Razorpay) {
        setAutopayMsg({ type: "error", text: "Payment gateway unavailable. Please try again." });
        return;
      }

      // ── UPI AutoPay / Recurring checkout ──────────────────────────────────
      // `recurring: "1"` + `customer_id` + `callback_url` is the Razorpay
      // mandate registration flow. ₹2 is charged via UPI AutoPay to register
      // the mandate (max ₹15,000/month). Page redirects back after approval.
      const rzp = new window.Razorpay({
        key:          d.keyId,
        amount:       d.amount,          // 200 paise = ₹2
        currency:     d.currency,
        order_id:     d.orderId,
        customer_id:  d.customerId,
        recurring:    "1",               // enable UPI AutoPay mandate
        callback_url: d.callbackUrl,     // Razorpay will redirect here
        name:         "Websevix",
        description:  "AutoPay Setup — ₹2 via UPI AutoPay (max ₹15,000/month)",
        prefill:      d.prefill,
        theme:        { color: "#6366F1" },
        modal: { ondismiss: () => setSettingUp(false) },
      });
      rzp.open();
      // Note: no handler needed — Razorpay redirects to callback_url after payment
    } catch {
      setAutopayMsg({
        type: "error",
        text: "Setup failed. You can still make payments manually from the chat.",
      });
      setSettingUp(false);
    }
  };

  const pending     = subs.filter(s => s.status === "pending_acceptance");
  const active      = subs.filter(s => s.status === "active");
  const others      = subs.filter(s => !["pending_acceptance", "active"].includes(s.status));
  const nextBill    = active.map(s => s.nextBillingDate).filter(Boolean).sort()[0];
  const hasServices = subs.length > 0;

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-snow">My Services</h1>
        <p className="text-sm text-slate mt-1">Manage your active services and billing</p>
      </div>

      {/* Autopay message toast */}
      <AnimatePresence>
        {autopayMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm"
            style={{
              background: autopayMsg.type === "success" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              border:     autopayMsg.type === "success" ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(248,113,113,0.25)",
              color:      autopayMsg.type === "success" ? "#34D399" : "#F87171",
            }}>
            <span className="flex items-center gap-2">
              {autopayMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {autopayMsg.text}
            </span>
            <button onClick={() => setAutopayMsg(null)} className="opacity-60 hover:opacity-100"><X size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Billing Summary Card — only when services are assigned ── */}
      {hasServices && (
        <BillingSummaryCard
          mandate={mandate}
          monthlyTotal={monthlyTotal}
          activeCount={active.length}
          nextBillingDate={nextBill}
          onSetupAutopay={setupAutopay}
          settingUp={settingUp}
        />
      )}

      {/* Pending Acceptance */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <Clock size={14} /> Awaiting Your Response ({pending.length})
            </h2>
            {pending.map((sub, i) => (
              <motion.div key={sub._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <PendingCard sub={sub} onAccept={handleAccept} onReject={handleReject} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Services */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-snow flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" /> Active Services ({active.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((sub, i) => (
              <motion.div key={sub._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ActiveCard sub={sub} onCancel={handleCancel} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Other (cancelled/paused/rejected) */}
      {others.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate">Other Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {others.map(sub => (
              <div key={sub._id} className="rounded-2xl p-4 flex items-center justify-between opacity-60"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{sub.serviceId.icon ?? CATEGORY_ICONS[sub.serviceId.category] ?? "📦"}</span>
                  <div>
                    <p className="text-sm text-snow">{sub.serviceId.name}</p>
                    <p className="text-xs text-slate">₹{(sub.customPrice ?? sub.serviceId.basePrice).toLocaleString("en-IN")}/{sub.serviceId.billingCycle}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: STATUS_CFG[sub.status].color, background: STATUS_CFG[sub.status].bg }}>
                  {STATUS_CFG[sub.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasServices && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Shield size={40} className="text-slate" />
          <p className="text-sm font-medium text-snow">No services yet</p>
          <p className="text-xs text-slate">Services assigned by Websevix will appear here</p>
        </div>
      )}

      {/* Invoice History */}
      {invoices.length > 0 && <InvoiceSection invoices={invoices} />}
    </motion.div>
  );
}

// ─── Default export wrapped in Suspense (required for useSearchParams) ────────

export default function ClientServicesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        ))}
      </div>
    }>
      <ClientServicesInner />
    </Suspense>
  );
}

// ─── Billing Summary Card ─────────────────────────────────────────────────────

function BillingSummaryCard({ mandate, monthlyTotal, activeCount, nextBillingDate, onSetupAutopay, settingUp }: {
  mandate: IMandate | null; monthlyTotal: number; activeCount: number;
  nextBillingDate?: string; onSetupAutopay: () => void; settingUp: boolean;
}) {
  const isActive = mandate?.status === "active" || mandate?.status === "authenticated";
  const pct      = isActive && mandate ? Math.min(100, Math.round((monthlyTotal / mandate.maxAmount) * 100)) : 0;

  if (!isActive) {
    // Only show setup card when there are active services that need billing
    if (activeCount === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.04))", border: "1px solid rgba(99,102,241,0.25)" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))" }}>
              <Zap size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-snow">Set Up Websevix Autopay</p>
              <p className="text-xs text-slate mt-0.5">
                {activeCount} active {activeCount === 1 ? "service" : "services"} · ₹{monthlyTotal.toLocaleString("en-IN")}/month · ₹2 one-time verification charge
              </p>
            </div>
          </div>
          <button
            onClick={onSetupAutopay}
            disabled={settingUp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-all flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
            {settingUp ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
            {settingUp ? "Opening…" : "Setup Websevix Autopay"}
          </button>
        </div>
      </motion.div>
    );
  }

  // Active mandate — show billing overview
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))", border: "1px solid rgba(16,185,129,0.2)" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
            <Shield size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-snow">Billing Overview</p>
            {nextBillingDate && (
              <p className="text-xs text-slate">
                Next billing: {new Date(nextBillingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-display text-snow">₹{monthlyTotal.toLocaleString("en-IN")}</p>
          <p className="text-xs text-slate">/month · {activeCount} {activeCount === 1 ? "service" : "services"}</p>
        </div>
      </div>

      {/* Mandate info bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="text-slate flex items-center gap-1.5">
            <CheckCircle2 size={11} className="text-emerald-400" />
            Autopay Active
            {mandate?.paymentMethod && ` · ${mandate.paymentMethod}`}
            {mandate?.maskedAccount  && ` (${mandate.maskedAccount})`}
          </span>
          <span className="text-slate">
            ₹{monthlyTotal.toLocaleString("en-IN")} / ₹{(mandate?.maxAmount ?? 15000).toLocaleString("en-IN")} limit
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-white/5">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ background: pct > 80 ? "linear-gradient(90deg,#F59E0B,#EF4444)" : "linear-gradient(90deg,#10B981,#34D399)" }}
          />
        </div>
        <p className="text-[10px] text-slate">{pct}% of ₹15,000 mandate limit used</p>
      </div>
    </motion.div>
  );
}

// ─── Pending Card ─────────────────────────────────────────────────────────────

function PendingCard({ sub, onAccept, onReject }: {
  sub: ClientSub; onAccept: (id: string) => void; onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const price = sub.customPrice ?? sub.serviceId.basePrice;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.2)" }}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sub.serviceId.icon ?? CATEGORY_ICONS[sub.serviceId.category] ?? "📦"}</span>
            <div>
              <p className="text-sm font-semibold text-snow">{sub.serviceId.name}</p>
              <p className="text-xs text-slate">₹{price.toLocaleString("en-IN")}/{sub.serviceId.billingCycle} · Offered by Websevix</p>
            </div>
          </div>
          {sub.serviceId.features.length > 0 && (
            <button onClick={() => setExpanded(v => !v)} className="p-1.5 text-slate hover:text-snow transition-colors">
              <motion.div animate={{ rotate: expanded ? 180 : 0 }}><X size={13} /></motion.div>
            </button>
          )}
        </div>

        <AnimatePresence>
          {expanded && sub.serviceId.features.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="mb-3 space-y-1.5">
                {sub.serviceId.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate">
                    <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />{f}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mt-2">
          {!sub.isMandatory && (
            <button onClick={() => onReject(sub._id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate border border-white/10 hover:border-red-500/30 hover:text-red-400 transition-all">
              <XCircle size={12} /> Decline
            </button>
          )}
          <button onClick={() => onAccept(sub._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            <CheckCircle2 size={12} />
            {sub.isMandatory ? "Acknowledge" : "Accept Service"} · ₹{price.toLocaleString("en-IN")}/mo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Active Card ──────────────────────────────────────────────────────────────

function ActiveCard({ sub, onCancel }: { sub: ClientSub; onCancel: (id: string, name: string) => void }) {
  const price = sub.customPrice ?? sub.serviceId.basePrice;

  return (
    <div className="rounded-2xl p-4 hover:border-emerald-500/20 transition-all"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{sub.serviceId.icon ?? CATEGORY_ICONS[sub.serviceId.category] ?? "📦"}</span>
          <div>
            <p className="text-sm font-semibold text-snow">{sub.serviceId.name}</p>
            <p className="text-xs text-slate">
              Since {new Date(sub.billingStartDate ?? sub.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-snow">₹{price.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-slate">/{sub.serviceId.billingCycle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ color: "#34D399", background: "rgba(52,211,153,0.1)" }}>
            <CheckCircle2 size={10} /> Active
          </span>
          {sub.isMandatory && (
            <span className="text-[10px] px-2 py-0.5 rounded-full text-amber-400 bg-amber-500/10">🔒 Mandatory</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sub.nextBillingDate && (
            <p className="text-[10px] text-slate">Next: {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
          )}
          {!sub.isMandatory && (
            <button onClick={() => onCancel(sub._id, sub.serviceId.name)}
              className="text-[10px] text-slate hover:text-red-400 border border-transparent hover:border-red-500/20 px-2 py-1 rounded-lg transition-all">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Section ──────────────────────────────────────────────────────────

function InvoiceSection({ invoices }: { invoices: IInvoice[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-snow flex items-center gap-2">
        <FileText size={14} className="text-indigo-400" /> Invoice History
      </h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Invoice", "Month", "Services", "Amount", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-slate font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate">{inv.invoiceNo}</td>
                <td className="px-4 py-3 text-xs text-snow">{inv.month}</td>
                <td className="px-4 py-3 text-xs text-slate">{inv.lineItems?.length ?? 0} services</td>
                <td className="px-4 py-3 text-xs font-semibold text-snow">₹{inv.total.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium" style={{ color: INV_CFG[inv.status]?.color ?? "#64748B" }}>
                    {INV_CFG[inv.status]?.label ?? inv.status}
                    {inv.paidAt && ` · ${new Date(inv.paidAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
