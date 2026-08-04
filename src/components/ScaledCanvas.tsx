import type { CSSProperties, ReactNode } from "react";

export const DESIGN_WIDTH = 1440;

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
        transform: `scale(calc(100vw / ${DESIGN_WIDTH}))`,
        transformOrigin: "top left",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
