"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { NewOrderToastProvider } from "@/components/admin/NewOrderToast";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  pendingReview: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/admin/dashboard/stats", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((d: DashboardStats) => {
        if (typeof d.pendingReview === "number") setPendingOrders(d.pendingReview);
      })
      .catch(console.error);
  }, [accessToken]);

  return (
    <NewOrderToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#060608]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          pendingOrdersCount={pendingOrders}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar onMobileMenuOpen={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </NewOrderToastProvider>
  );
}
