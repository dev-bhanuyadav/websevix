"use client";

import { useCountAnimation } from "@/hooks/useCountAnimation";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  isDecimal?: boolean;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  isDecimal = false,
  decimals = 1,
  className = "",
}: AnimatedCounterProps) {
  const { count, ref } = useCountAnimation(target, duration, true);

  const displayValue = isDecimal
    ? (count / Math.pow(10, decimals)).toFixed(decimals)
    : count.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
