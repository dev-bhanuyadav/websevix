"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Package, MessageSquare, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MilestoneTracker } from "@/components/dashboard/MilestoneTracker";
import { ChatWindow } from "@/components/order-chat/ChatWindow";
import type { IOrder, IMilestone } from "@/models/Order";

type Tab = "overview" | "chat";

interface PublicOrder {
  id: string;
  orderId: string;
  clientId: string;
  title: string;
  status: string;
  aiSummary?: {
    projectType?: string;
    description?: string;
    features?: string[];
    designStyle?: string;
    budget?: string;
    timeline?: string;
    references?: string[];
  };
  milestones: IMilestone[];
  placementFee: number;
  paymentStatus: string;
  paymentId?: string;
  assignedAdmin?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const STATUS_CONFIG = {
  pending_review: { label: "Pending Review", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  in_progress:    { label: "In Progress",    cls: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  completed:      { label: "Completed",      cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  cancelled:      { label: "Cancelled",      cls: "text-red-400 bg-red-500/10 border-red-500/20" },
};

export default function OrderDetailPage() {
  const { orderId }    = useParams<{ orderId: string }>();
  const searchParams   = useSearchParams();
  const initialTab     = (searchParams.get("tab") as Tab) ?? "overview";

  const { accessToken } = useAuth();
  const [order,   setOrder]   = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<Tab>(initialTab);

  useEffect(() => {
    if (!orderId || !accessToken) return;
    fetch(`/api/orders/${orderId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(d => setOrder(d.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId, accessToken]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="h-10 w-32 rounded-xl bg-white/[0.04] animate-pulse mb-6" />
        <div className="h-48 rounded-2xl bg-white/[0.03] animate-pulse mb-4" />
        <div className="h-64 rounded-2xl bg-white/[0.03] animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <Package className="w-12 h-12 text-slate mx-auto mb-4" />
        <p className="text-silver font-medium mb-2">Order not found</p>
        <Link href="/dashboard/client/orders" className="text-indigo-400 text-sm hover:text-indigo-300">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending_review;
  const summary   = order.aiSummary ?? {};
  const completedMs = order.milestones.filter(m => m.status === "completed").length;
  const progressPct = order.milestones.length ? Math.round((completedMs / order.milestones.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/dashboard/client/orders"
          className="inline-flex items-center gap-2 text-sm text-slate hover:text-silver transition-colors">
          <ArrowLeft size={15} /> Back to orders
        </Link>
      </motion.div>

      {/* Order header card */}
      <motion.div
        className="rounded-2xl border border-white/[0.08] p-6"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-mono text-indigo-400">{order.orderId}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
            </div>
            <h1 className="font-display font-bold text-xl text-snow">{order.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs text-slate">
              <span>Placed: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              {summary.budget && <span>Budget: <span className="text-silver">{summary.budget}</span></span>}
              {summary.timeline && <span>Timeline: <span className="text-silver">{summary.timeline}</span></span>}
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                <motion.circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="url(#prog)" strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPct} 100`}
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${progressPct} 100` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
                <defs>
                  <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-snow">
                {progressPct}%
              </span>
            </div>
            <div>
              <p className="text-xs text-slate">Overall</p>
              <p className="text-sm font-semibold text-snow">Progress</p>
            </div>
          </div>
        </div>

        {/* AI Summary pills */}
        {(summary.features ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
            {(summary.features ?? []).map(f => (
              <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-indigo-300">{f}</span>
            ))}
            {summary.designStyle && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/15 text-violet-300">{summary.designStyle}</span>
            )}
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex items-center gap-1 p-1 rounded-xl border border-white/[0.07] w-fit"
        style={{ background: "rgba(255,255,255,0.02)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
      >
        {([["overview", "Overview", Package], ["chat", "Project Chat", MessageSquare]] as const).map(([val, label, Icon]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === val ? "text-snow" : "text-slate hover:text-silver"
            }`}
          >
            {tab === val && (
              <motion.div layoutId="detail-tab" className="absolute inset-0 rounded-lg bg-white/[0.08]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            )}
            <Icon size={14} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "overview" ? (
          <motion.div
            key="overview"
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Project Brief */}
            {summary.description && (
              <div className="rounded-2xl border border-white/[0.07] p-5"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <h2 className="font-display font-semibold text-snow text-sm mb-3 flex items-center gap-2">
                  <MapPin size={15} className="text-indigo-400" /> Project Brief
                </h2>
                <p className="text-sm text-silver leading-relaxed">{summary.description}</p>
              </div>
            )}

            {/* Milestone tracker */}
            <div className="rounded-2xl border border-white/[0.07] p-5"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="font-display font-semibold text-snow text-sm mb-4">Milestone Tracker</h2>
              <MilestoneTracker milestones={order.milestones} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            className="rounded-2xl border border-white/[0.07] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", height: 520 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <ChatWindow orderId={order.orderId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
