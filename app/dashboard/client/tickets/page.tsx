"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TicketCard } from "@/components/tickets/TicketCard";
import { RaiseTicketModal } from "@/components/tickets/RaiseTicketModal";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Loader2 } from "lucide-react";

const FILTERS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_client", label: "Waiting" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

export default function ClientTicketsPage() {
  const { accessToken } = useAuth();
  const [tickets, setTickets] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showRaise, setShowRaise] = useState(false);
  const [services, setServices] = useState<{ _id: string; serviceId?: { name?: string }; customPrice?: number }[]>([]);
  const [orders, setOrders] = useState<{ id?: string; _id?: string; orderId?: string; title?: string }[]>([]);

  const loadTickets = async () => {
    if (!accessToken) return;
    const url = filter ? `/api/tickets?status=${filter}` : "/api/tickets";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const d = await res.json();
    setTickets(d.tickets ?? []);
  };

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    loadTickets().finally(() => setLoading(false));
  }, [accessToken, filter]);

  useEffect(() => {
    if (!accessToken || !showRaise) return;
    fetch("/api/client/services", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((d) => setServices(d.subscriptions ?? []))
      .catch(() => {});
    fetch("/api/orders", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {});
  }, [accessToken, showRaise]);

  const handleCreateTicket = async (data: {
    category: string;
    relatedServiceId?: string;
    relatedOrderId?: string;
    subject: string;
    description: string;
    priority: string;
    attachments: { url: string; name: string; size: number; mimeType: string }[];
  }) => {
    if (!accessToken) return;
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    if (out.error) throw new Error(out.error);
    await loadTickets();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display font-bold text-xl text-snow">My Tickets</h1>
        <button
          onClick={() => setShowRaise(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#6366F1,#7C3AED)" }}
        >
          <Plus size={18} /> Raise New Ticket
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-white/10 w-fit" style={{ background: "rgba(255,255,255,0.03)" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value ? "bg-indigo-500/20 text-indigo-300" : "text-slate hover:text-snow hover:bg-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-12 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-slate mb-2">No tickets yet</p>
          <p className="text-sm text-slate/80 mb-4">Raise a ticket for any issue or question.</p>
          <button
            onClick={() => setShowRaise(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-300 border border-indigo-500/30"
          >
            <Plus size={16} /> Raise New Ticket
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <TicketCard
              key={String(t._id)}
              _id={String(t._id)}
              ticketId={String(t.ticketId)}
              subject={String(t.subject)}
              status={t.status as "open" | "in_progress" | "waiting_client" | "resolved" | "closed" | "reopened"}
              priority={t.priority as "low" | "medium" | "high" | "critical"}
              category={String(t.category)}
              relatedServiceId={t.relatedServiceId as never}
              relatedOrderId={t.relatedOrderId as never}
              createdAt={String(t.createdAt)}
              updatedAt={String(t.updatedAt)}
              slaDeadline={t.slaDeadline as string | null}
              isSlaBreach={!!t.isSlaBreach}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showRaise && (
          <RaiseTicketModal
            onClose={() => setShowRaise(false)}
            onSubmit={handleCreateTicket}
            clientServices={services}
            clientOrders={orders.map((o) => ({ _id: o.id ?? o._id ?? "", orderId: o.orderId, title: o.title }))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
