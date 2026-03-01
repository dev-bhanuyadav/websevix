"use client";

import { useState, useEffect, useCallback } from "react";

export function useOTPTimer(expiresInSeconds: number | null, onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const start = useCallback((durationSeconds: number) => {
    setStartedAt(Date.now());
    setSecondsLeft(durationSeconds);
  }, []);

  useEffect(() => {
    if (startedAt === null || secondsLeft <= 0) return;
    const endAt = startedAt + secondsLeft * 1000;
    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((endAt - now) / 1000));
      setSecondsLeft(left);
      if (left === 0) onExpire?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, secondsLeft, onExpire]);

  return { secondsLeft, start, canResend: secondsLeft <= 0 };
}
