import type { CSSProperties, ReactNode } from "react";

/**
 * The original's canvas is authored at 1492px, not 1440 — measured by probing
 * alessandrozanatta.it at a 1492px viewport, where its item coordinates land
 * exactly on the values in `PortfolioCanvas`. Scaling by 1440 drew the whole
 * composition 1440/1492 ≈ 3.6% too large at every width.
 *
 * Note the original sizes its *text* against 1440 instead, which is why the
 * fixed chrome, bio and CV keep plain pixel values outside this canvas.
 */
export const DESIGN_WIDTH = 1492;

export function ScaledCanvas({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: DESIGN_WIDTH,
        // Note the `px` on the divisor. `calc(100vw / 1492)` divides a length by a
        // number, which is invalid, so the whole transform was silently dropped and
        // the canvas never scaled at all — invisible while DESIGN_WIDTH was 1440,
        // because the intended scale there was 1. Dividing length by length yields
        // the unitless ratio scale() needs.
        transform: `scale(calc(100vw / ${DESIGN_WIDTH}px))`,
        transformOrigin: "top left",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
