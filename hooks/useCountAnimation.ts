"use client";

import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export function useCountAnimation(
  target: number,
  duration = 2000,
  startOnView = true
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnView || (inView && !hasAnimated.current)) {
      hasAnimated.current = true;
      const startTime = startOnView && inView ? Date.now() : 0;
      const startValue = 0;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.floor(eased * target);
        setCount(current);
        if (progress < 1) requestAnimationFrame(animate);
      };

      if (startOnView && !inView) return;
      requestAnimationFrame(animate);
    }
  }, [target, duration, inView, startOnView]);

  return { count, ref };
}
