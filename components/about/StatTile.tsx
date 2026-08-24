"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// ease-out cubic — quick start, settles gently into the final value instead
// of stopping abruptly.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatTile({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string | null;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const duration = 1200;
    let start: number | null = null;
    let frame: number;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.round(value * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center gap-1.5 bg-base-black/20 px-4 py-8 text-center backdrop-blur-md sm:items-start sm:px-7 sm:text-left"
    >
      <div className="font-heading text-3xl font-bold text-gradient sm:text-4xl">
        {display}
        {suffix}
      </div>
      <div className="text-xs text-base-gray sm:text-sm">{label}</div>
    </div>
  );
}
