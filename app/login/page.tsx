"use client";

import { AuthModal } from "@/components/auth/AuthModal";

export default function LoginPage() {
  return <AuthModal defaultMode="login" onSuccess={redirectToDashboard} />;
}

function redirectToDashboard() {
  window.location.href = "/dashboard";
}
