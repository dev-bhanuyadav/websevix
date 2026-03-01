"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (user.role === "client") window.location.href = "/dashboard/client";
    else window.location.href = "/dashboard/developer";
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <p className="text-slate">Loading…</p>
    </div>
  );
}
