"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals children the first time they scroll into view by clipping them down
 * to a thin sliver and expanding out to full size - a curtain-like wipe, not a
 * fade (opacity stays at 100% throughout). Fires immediately on mount if
 * already in view (e.g. the entry image on page load).
 */
export function RevealOnView({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  /** Which edge the thin sliver starts at and expands from: "down" starts at the top and grows downward, "up" starts at the bottom and grows upward. */
  direction?: "down" | "up";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Double rAF: guarantees the browser has painted the clipped starting
          // state at least once before we flip to visible, so the transition
          // actually has something to animate from (otherwise an already-in-view
          // element like the entry image jumps straight to its end state).
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hiddenClip = direction === "down" ? "inset(0 0 98% 0)" : "inset(98% 0 0 0)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: visible ? "inset(0 0 0 0)" : hiddenClip,
        transition: "clip-path 0.7s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
