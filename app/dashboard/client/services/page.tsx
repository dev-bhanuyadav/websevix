"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, CreditCard, CheckCircle2, XCircle, Clock, AlertTriangle,
  IndianRupee, FileText, Loader2, X, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubStatus = "pending_acceptance"|"active"|"paused"|"cancelled"|"rejected";
type InvoiceStatus = "draft"|"sent"|"paid"|"failed"|"refunded";

interface PopulatedService { _id: string; name: string; description?: string; category: string; icon?: string; basePrice: number; billingCycle: string; features: string[]; isMandatory: boolean; }
interface ClientSub { _id: string; serviceId: PopulatedService; customPrice?: number | null; status: SubStatus; isMandatory: boolean; nextBillingDate?: string; billingStartDate?: string; createdAt: string; }
interface IMandate { _id: string; status: string; paymentMethod?: string; maskedAccount?: string; shortUrl?: string; maxAmount: number; }
interface IInvoice { _id: string; invoiceNo: string; month: string; total: number; status: InvoiceStatus; lineItems: { serviceName: string; price: number }[]; paidAt?: string; createdAt: string; }

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

export default function ClientServicesPage() {
  const { accessToken } = useAuth();
  const [subs,         setSubs]         = useState<ClientSub[]>([]);
  const [mandate,      setMandate]       = useState<IMandate | null>(null);
  const [invoices,     setInvoices]      = useState<IInvoice[]>([]);
  const [monthlyTotal, setMonthlyTotal]  = useState(0);
  const [loading,      setLoading]       = useState(true);
  const [settingUp,    setSettingUp]     = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const r = await fetch("/api/client/services", { headers: { Authorization: `Bearer ${accessToken}` } });
      const d = await r.json();
      setSubs(d.services ?? []);
      setMandate(d.mandate ?? null);
      setInvoices(d.invoices ?? []);
      setMonthlyTotal(d.monthlyTotal ?? 0);
    } finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

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
    try {
      const r = await fetch("/api/mandate/create", { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
      const d = await r.json();
      if (d.setupUrl) window.open(d.setupUrl, "_blank");
      else alert("Mandate setup initiated. Check your email for the setup link.");
    } finally { setSettingUp(false); }
  };

  const pending   = subs.filter(s => s.status === "pending_acceptance");
  const active    = subs.filter(s => s.status === "active");
  const others    = subs.filter(s => !["pending_acceptance","active"].includes(s.status));
  const nextBill  = active.map(s => s.nextBillingDate).filter(Boolean).sort()[0];

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

      {/* Billing Summary Card */}
      <BillingSummaryCard
        mandate={mandate} monthlyTotal={monthlyTotal} activeCount={active.length}
        nextBillingDate={nextBill} onSetupAutopay={setupAutopay} settingUp={settingUp}
      />

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

      {/* Others */}
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

      {subs.length === 0 && (
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

// ─── Billing Summary Card ─────────────────────────────────────────────────────

function BillingSummaryCard({ mandate, monthlyTotal, activeCount, nextBillingDate, onSetupAutopay, settingUp }: {
  mandate: IMandate | null; monthlyTotal: number; activeCount: number;
  nextBillingDate?: string; onSetupAutopay: () => void; settingUp: boolean;
}) {
  const hasActive = mandate?.status === "active" || mandate?.status === "authenticated";
  const pct       = mandate ? Math.min(100, Math.round((monthlyTotal / mandate.maxAmount) * 100)) : 0;

  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: hasActive ? "linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))" : "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.02))",
               border: `1px solid ${hasActive ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.25)"}` }}>
      {!hasActive ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
              <AlertTriangle size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-400">Autopay Not Set Up</p>
              <p className="text-xs text-slate mt-0.5">
                {activeCount > 0 ? `You have ${activeCount} active services worth ₹${monthlyTotal.toLocaleString("en-IN")}/month` : "Set up autopay for seamless billing"}
              </p>
            </div>
          </div>
          <button onClick={onSetupAutopay} disabled={settingUp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
            {settingUp ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
            {settingUp ? "Setting up…" : "Set Up Autopay →"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                <Shield size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-snow">Billing Overview</p>
                {nextBillingDate && <p className="text-xs text-slate">Next billing: {new Date(nextBillingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-display text-snow">₹{monthlyTotal.toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate">/month · {activeCount} services</p>
            </div>
          </div>

          {/* Mandate bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-emerald-400" />
                Autopay {mandate?.status === "active" ? "Active" : "Authenticated"} · {mandate?.paymentMethod ?? "UPI"}
                {mandate?.maskedAccount && ` (${mandate.maskedAccount})`}
              </span>
              <span className="text-slate">₹{monthlyTotal.toLocaleString("en-IN")} / ₹{(mandate?.maxAmount ?? 15000).toLocaleString("en-IN")} limit</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-white/5">
              <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ background: pct > 80 ? "linear-gradient(90deg,#F59E0B,#EF4444)" : "linear-gradient(90deg,#10B981,#34D399)" }} />
            </div>
            <p className="text-[10px] text-slate">{pct}% of mandate limit used</p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Pending Card ─────────────────────────────────────────────────────────────

function PendingCard({ sub, onAccept, onReject }: { sub: ClientSub; onAccept: (id: string) => void; onReject: (id: string) => void }) {
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
          {sub.serviceId.description && (
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
            <p className="text-xs text-slate">Since {new Date(sub.billingStartDate ?? sub.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
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
          {sub.isMandatory && <span className="text-[10px] px-2 py-0.5 rounded-full text-amber-400 bg-amber-500/10">🔒 Mandatory</span>}
        </div>
        <div className="flex items-center gap-2">
          {sub.nextBillingDate && <p className="text-[10px] text-slate">Next: {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>}
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
      <h2 className="text-sm font-semibold text-snow flex items-center gap-2"><FileText size={14} className="text-indigo-400" /> Invoice History</h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Invoice","Month","Services","Amount","Status"].map(h => (
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
