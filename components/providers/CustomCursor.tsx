"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.1, ease: "power2.out" });
    };

    const raf = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.15;
      ringPos.y += (pos.y - ringPos.y) * 0.15;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      requestAnimationFrame(raf);
    };

    const growCursor = () =>
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: "power2.out" });
    const shrinkCursor = () =>
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" });

    window.addEventListener("mousemove", onMouseMove);
    document
      .querySelectorAll("a, button, [data-cursor-hover]")
      .forEach((el) => {
        el.addEventListener("mouseenter", growCursor);
        el.addEventListener("mouseleave", shrinkCursor);
      });

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
