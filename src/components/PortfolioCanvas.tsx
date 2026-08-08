import Image from "next/image";
import type { CSSProperties } from "react";
import { TransitionLink } from "./transition/TransitionLink";
import { ScaledCanvas } from "./ScaledCanvas";
import type { CanvasItem, CanvasPlacement } from "@/types/portfolio";

const CANVAS_HEIGHT = 4200;

/**
 * Stops where the original's mobile bio begins (its item sits at top 2806 of
 * the 375px canvas), so the bio and CV flow straight on underneath rather than
 * after a gap. The original's own mobile section runs to 3926, but the rest of
 * that height is the bio and CV, which we render as normal blocks.
 */
const MOBILE_CANVAS_HEIGHT = 2806;

/**
 * Mobile placements are the original's own, read from its embedded layout table
 * and multiplied by the 375px reference width. Links are its real targets; the
 * homepage still points every poster at `/matteomeller` until the other
 * projects exist (Phase 4), so those stay as they were.
 */
const ITEMS: CanvasItem[] = [
  {
    id: "intersections",
    src: "/images/home/01K7FSHN3PBRK38PQNRBV3S3XH.webp",
    alt: "Intersections poster on gravel",
    href: "/matteomeller",
    desktop: { top: 192, left: 647, width: 581, height: 533, zIndex: 13, rotate: -10 },
    mobile: { top: 81, left: 56, width: 263, height: 223, zIndex: 325, rotate: -10 },
  },
  {
    id: "nutrients-gif",
    src: "/images/home/01K6ED322FX5PF204385YMPZ13.gif",
    alt: "Nutrients project animation",
    href: "/matteomeller",
    desktop: { top: 622, left: 655, width: 583, height: 711, zIndex: 32 },
    mobile: { top: 332, left: 54, width: 267, height: 369, zIndex: 326 },
  },
  {
    id: "coming-soon",
    src: "",
    alt: "",
    desktop: { top: 2684, left: 1043, width: 105, height: 25, zIndex: 48 },
    mobile: { top: 675, left: 262, width: 105, height: 25, zIndex: 328 },
  },
  {
    id: "matteomeller",
    src: "/images/home/01KFRM9P6S9WPJZY8WYQMH09AQ.png",
    alt: "Matteo Meller poster detail",
    href: "/matteomeller",
    desktop: { top: 1167, left: 610, width: 368, height: 494, zIndex: 42 },
    mobile: { top: 706, left: 74, width: 228, height: 306, zIndex: 323 },
  },
  {
    id: "matteomeller-reel",
    kind: "video",
    src: "/videos/home/01K7FVNCECYCS9NXXCMDEPJFNY.mp4",
    poster: "/images/home/01KAVH6HP6ZK57SPGRTM885Q7M.jpeg",
    alt: "Matteo Meller project video reel",
    href: "/matteomeller",
    desktop: { top: 1484, left: 898, width: 371, height: 464, zIndex: 43, rotate: -10 },
    // The original tilts this one the other way on mobile.
    mobile: { top: 1050, left: 65, width: 244, height: 272, zIndex: 324, rotate: 10 },
  },
  {
    id: "miche",
    src: "/images/home/01K7J9GXPKRC6EHA66C8E3TMWC.webp",
    alt: "Miche project photo",
    href: "/matteomeller",
    desktop: { top: 1801, left: 632, width: 557, height: 557, zIndex: 10, borderRadius: 9999 },
    // 0.2146 of the layout width resolves to ~80px here, well short of the half
    // that would round it off — a rounded square on mobile, a circle on desktop.
    mobile: { top: 1360, left: 37, width: 301, height: 301, zIndex: 207, borderRadius: 80 },
  },
  {
    id: "anselmi",
    src: "/images/home/01K7H4E2QYKQSFEAY19RKRPFWJ.png",
    alt: "Anselmi project",
    href: "/matteomeller",
    desktop: { top: 2204, left: 508, width: 570, height: 433, zIndex: 26 },
    mobile: { top: 1672, left: 18, width: 338, height: 257, zIndex: 220 },
  },
  {
    id: "nutrients",
    src: "/images/home/01K7CH55PWQR15RV07GT255G67.webp",
    alt: "Nutrients project",
    href: "/matteomeller",
    desktop: { top: 2403, left: 757, width: 611, height: 599, zIndex: 29 },
    mobile: { top: 1908, left: 41, width: 293, height: 288, zIndex: 217 },
  },
  {
    id: "visualgroup",
    src: "/images/home/01K7J8RZ7BY2Z2QGC84N1D65G7.webp",
    alt: "Visual Group project",
    href: "/matteomeller",
    desktop: { top: 2860, left: 558, width: 560, height: 588, zIndex: 28 },
    mobile: { top: 2218, left: 50, width: 275, height: 302, zIndex: 218 },
  },
  {
    id: "attivaservizi",
    src: "/images/home/01K7CHHJ966KN521QRZEA3GEW7.webp",
    alt: "Attiva Servizi project",
    href: "/matteomeller",
    // The original declares 934.572px here; the browser clamps it against the
    // box, so keeping the declared value reproduces the same rounded shape.
    desktop: { top: 3327, left: 784, width: 539, height: 413, zIndex: 27, borderRadius: 935 },
    mobile: { top: 2544, left: 50, width: 275, height: 188, zIndex: 206, borderRadius: 235 },
  },
];

/** Both placements as custom properties; `globals.css` picks a set per breakpoint. */
function placementVars(item: CanvasItem): CSSProperties {
  const vars = (p: CanvasPlacement, prefix: string) => ({
    [`--${prefix}-top`]: p.top,
    [`--${prefix}-left`]: p.left,
    [`--${prefix}-w`]: p.width,
    [`--${prefix}-h`]: p.height,
    [`--${prefix}-z`]: p.zIndex,
    [`--${prefix}-rot`]: p.rotate ?? 0,
    [`--${prefix}-radius`]: p.borderRadius ?? 0,
  });

  return { ...vars(item.mobile, "m"), ...vars(item.desktop, "d") } as CSSProperties;
}

function Item({ item }: { item: CanvasItem }) {
  if (item.id === "coming-soon") {
    return (
      <div
        className="canvas-item"
        style={{
          ...placementVars(item),
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "#1b1b1b",
          whiteSpace: "nowrap",
        }}
      >
        COMING SOON
      </div>
    );
  }

  // The original rotates the asset inside its positioned wrapper, so the tilt
  // pivots on the item's centre and leaves the recorded top/left untouched.
  const media =
    item.kind === "video" ? (
      <video
        className="canvas-media"
        src={item.src}
        poster={item.poster}
        autoPlay
        loop
        muted
        playsInline
      />
    ) : (
      <Image
        className="canvas-media"
        src={item.src}
        alt={item.alt}
        width={item.desktop.width}
        height={item.desktop.height}
        unoptimized
      />
    );

  return (
    <div className="canvas-item" style={placementVars(item)}>
      {item.href ? (
        <TransitionLink
          href={item.href}
          aria-label={item.alt}
          className="block h-full w-full transition-[filter,opacity] duration-200 ease-linear hover:opacity-80 hover:blur-[1px]"
        >
          {media}
        </TransitionLink>
      ) : (
        media
      )}
    </div>
  );
}

export function PortfolioCanvas() {
  return (
    <div
      // `isolation` keeps the items' z-indices inside their own stacking
      // context. Without it the tallest of them (coming-soon at 48, the poster
      // at 42) paint straight over the CV panel's z-30 as it sticks into view.
      className="canvas-root relative w-full"
      style={{
        isolation: "isolate",
        height: "calc(var(--canvas-h) / var(--canvas-w) * 100vw)",
      }}
    >
      <ScaledCanvas>
        <div
          style={{
            position: "relative",
            width: "calc(var(--canvas-w) * 1px)",
            height: "calc(var(--canvas-h) * 1px)",
          }}
        >
          {ITEMS.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      </ScaledCanvas>
    </div>
  );
}

export { CANVAS_HEIGHT, MOBILE_CANVAS_HEIGHT };
