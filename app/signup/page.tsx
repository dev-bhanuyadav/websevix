"use client";

import { AuthModal } from "@/components/auth/AuthModal";

export default function SignupPage() {
  return <AuthModal defaultMode="signup" onSuccess={redirectToDashboard} />;
}

function redirectToDashboard() {
  window.location.href = "/dashboard";
}
