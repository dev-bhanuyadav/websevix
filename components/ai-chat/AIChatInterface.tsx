"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, SkipForward } from "lucide-react";
import { AIMessage } from "./AIMessage";
import { UserMessage } from "./UserMessage";
import { TypingIndicator } from "./TypingIndicator";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OPENING_MESSAGE, type AIResponse } from "@/lib/aiPrompt";
import { useAuth } from "@/hooks/useAuth";

interface ChatMsg {
  id:             string;
  role:           "user" | "assistant";
  content:        string;
  showChips?:     string[];
  showCheckboxes?: string[];
}

interface AIChatInterfaceProps {
  onOrderPlaced?: (orderId: string) => void;
}

function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}

const PROGRESS_FIELDS = ["projectType","description","features","designStyle","budget","timeline"] as const;

function calcProgress(data: AIResponse["collectedData"]): number {
  const filled = PROGRESS_FIELDS.filter(f => {
    const v = data[f];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;
  return Math.round((filled / PROGRESS_FIELDS.length) * 100);
}

export function AIChatInterface({ onOrderPlaced }: AIChatInterfaceProps) {
  const { accessToken } = useAuth();
  const sessionId       = useRef(`vix-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const scrollRef       = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLTextAreaElement>(null);

  const [messages,      setMessages]      = useState<ChatMsg[]>([]);
  const [input,         setInput]         = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [collectedData, setCollectedData] = useState<AIResponse["collectedData"]>({});
  const [isComplete,    setIsComplete]    = useState(false);
  const [isPlacing,     setIsPlacing]     = useState(false);
  const [payModal,      setPayModal]      = useState(false);
  const [historyLock,   setHistoryLock]   = useState(false); // prevent sending while chips showing

  // Init with opening message
  useEffect(() => {
    setTimeout(() => {
      setMessages([{
        id:        genId(),
        role:      "assistant",
        content:   OPENING_MESSAGE.message,
        showChips: OPENING_MESSAGE.showChips ?? undefined,
      }]);
    }, 400);
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(scrollToBottom, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    setHistoryLock(false);

    const userMsg: ChatMsg = { id: genId(), role: "user", content: text };

    setMessages(prev => {
      // Disable chips on last AI message
      const updated = prev.map((m, i) => i === prev.length - 1 && m.role === "assistant"
        ? { ...m, showChips: undefined, showCheckboxes: undefined }
        : m
      );
      return [...updated, userMsg];
    });

    setInput("");
    setIsTyping(true);

    try {
      const historyForAPI = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/consult", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sessionId:           sessionId.current,
          userMessage:         text,
          conversationHistory: historyForAPI,
          collectedData,
        }),
      });

      const data: AIResponse = await res.json();

      setCollectedData(prev => ({ ...prev, ...data.collectedData }));
      if (data.isComplete) setIsComplete(true);

      const aiMsg: ChatMsg = {
        id:              genId(),
        role:            "assistant",
        content:         data.message,
        showChips:       data.showChips  ?? undefined,
        showCheckboxes:  data.showCheckboxes ?? undefined,
      };

      setMessages(prev => [...prev, aiMsg]);
      if (data.showChips || data.showCheckboxes) setHistoryLock(true);

    } catch {
      setMessages(prev => [...prev, { id: genId(), role: "assistant", content: "Hmm, something went wrong on my end. Could you try again?" }]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, messages, collectedData, accessToken]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handlePlaceOrder = async () => {
    setPayModal(true);
  };

  const handlePaymentConfirm = async () => {
    setIsPlacing(true);
    setPayModal(false);

    try {
      // Create payment order
      const payRes = await fetch("/api/payment/create", {
        method:  "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${accessToken}` },
        body:    JSON.stringify({ amount: 500, currency: "INR" }),
      });
      const payData = await payRes.json();

      // Create order in DB
      const orderRes = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${accessToken}` },
        body:    JSON.stringify({
          title:     collectedData.projectType ?? "Web Project",
          aiSummary: collectedData,
          paymentId: payData.order?.id ?? null,
        }),
      });
      const orderData = await orderRes.json();

      // Verify payment (mock for now)
      await fetch("/api/payment/verify", {
        method:  "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${accessToken}` },
        body:    JSON.stringify({
          razorpay_order_id:   payData.order?.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature:  "mock",
          orderId:             orderData.order?.id,
          _mock:               payData.order?._mock,
        }),
      });

      onOrderPlaced?.(orderData.order?.orderId ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlacing(false);
    }
  };

  const progress = calcProgress(collectedData);

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* ─── Chat Panel ─── */}
      <div className="flex-1 flex flex-col min-w-0 rounded-2xl border border-white/[0.07] overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)" }}>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]"
          style={{ background: "rgba(7,7,15,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 0 14px rgba(99,102,241,0.4)" }}>
            V
          </div>
          <div>
            <p className="text-sm font-semibold text-snow">Vix</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate">AI Project Consultant</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scroll-smooth"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => msg.role === "assistant" ? (
              <AIMessage
                key={msg.id}
                content={msg.content}
                showChips={msg.showChips}
                showCheckboxes={msg.showCheckboxes}
                isLatest={i === messages.length - 1}
                onChipSelect={sendMessage}
                onCheckboxConfirm={vals => sendMessage(vals.join(", "))}
                disabled={isTyping}
              />
            ) : (
              <UserMessage key={msg.id} content={msg.content} />
            ))}
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-white/[0.05]">
          {isComplete && (
            <motion.div
              className="mb-3 p-3 rounded-xl text-sm text-emerald-300 border border-emerald-500/20 bg-emerald-500/[0.06]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✅ All information collected! Click "Place Order" to proceed.
            </motion.div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTyping ? "Vix is typing…" : "Type your message…"}
              disabled={isTyping || historyLock}
              rows={1}
              maxLength={2000}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-sm text-snow placeholder-slate/50 bg-white/[0.05] border border-white/[0.09] focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
              style={{ maxHeight: 120 }}
            />
            <div className="flex gap-1.5">
              {!isComplete && (
                <motion.button
                  onClick={() => sendMessage("skip")}
                  disabled={isTyping}
                  className="p-3 rounded-xl text-slate hover:text-silver hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
                  title="Skip this question"
                  whileTap={{ scale: 0.92 }}
                >
                  <SkipForward size={16} />
                </motion.button>
              )}
              <motion.button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ background: input.trim() ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.92 }}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Summary Card ─── */}
      <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
        <OrderSummaryCard
          data={collectedData}
          progress={progress}
          onPlace={handlePlaceOrder}
          isPlacing={isPlacing}
          isComplete={isComplete}
        />
      </div>

      {/* ─── Payment Modal ─── */}
      <AnimatePresence>
        {payModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPayModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm rounded-2xl border border-white/[0.1] p-6 space-y-5"
                style={{ background: "#0E0E1A", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="font-display font-bold text-snow text-lg">Confirm Your Order</h3>
                  <p className="text-sm text-slate mt-1">A one-time placement fee to confirm your project slot</p>
                </div>

                <div className="rounded-xl p-4 space-y-2 bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Project</span>
                    <span className="text-snow font-medium">{collectedData.projectType ?? "Web Project"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Budget</span>
                    <span className="text-snow font-medium">{collectedData.budget ?? "—"}</span>
                  </div>
                  <div className="h-px bg-white/[0.05] my-1" />
                  <div className="flex justify-between">
                    <span className="text-sm text-slate">Placement Fee</span>
                    <span className="font-display font-bold text-snow">₹500</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.button
                    onClick={handlePaymentConfirm}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                    style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Pay ₹500 & Place Order
                  </motion.button>
                  <button onClick={() => setPayModal(false)} className="w-full py-2 text-sm text-slate hover:text-silver transition-colors">
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-center text-slate">
                  🔒 Secured by Razorpay · No subscription
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
