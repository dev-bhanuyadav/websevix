"use client";

interface LogoMarkProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LogoMark({ size = 40, color = "white", className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 38"
      fill="none"
      className={className}
    >
      {/* Geometric W — sharp, modern */}
      <path
        d="M2 4L11 34L22 12L33 34L42 4"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top accent dot */}
      <circle cx="22" cy="4" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}
