"use client";

import { useRef, type MouseEvent } from "react";

// Tracks the cursor position over an element as CSS custom properties
// (written directly to the DOM node, no React state) so the `.spotlight`
// radial-gradient in globals.css can follow the mouse without triggering
// a re-render on every mousemove.
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  function onMouseMove(e: MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return { ref, onMouseMove };
}
