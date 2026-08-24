import Image from "next/image";
import type { CSSProperties } from "react";
import { TransitionLink } from "./transition/TransitionLink";
import { ScaledCanvas } from "./ScaledCanvas";
import { getPublishedProjectSlugs } from "@/lib/projects";
import type { CanvasItem, CanvasPlacement } from "@/types/portfolio";

/**
 * The original's 4200, less the 368 the bottom two items came up by when the
 * dropped project's gap was closed. Keeps its 460px of run-out below Attiva,
 * the lowest item, so the CV section starts where it always did relative to
 * the artwork. Mirrored in `globals.css` as `--canvas-h`.
 */
const CANVAS_HEIGHT = 3832;

/**
 * Where the mobile bio begins, so it and the CV flow straight on underneath
 * rather than after a gap. The original puts its own bio item at top 2806; we
 * sit 265 above that, the distance the bottom two items came up by when the
 * dropped project's gap was closed, which keeps its 74px of run-out below
 * Attiva. (The original's mobile section runs to 3926, but the rest of that
 * height is the bio and CV, which we render as normal blocks.)
 * Mirrored in `globals.css` as `--canvas-h`.
 */
const MOBILE_CANVAS_HEIGHT = 2541;

/**
 * Mobile placements are the original's own, read from its embedded layout table
 * and multiplied by the 375px reference width.
 *
 * Slugs are likewise the original's real link targets, read from `link.url` in
 * that same table rather than inferred from the artwork — two had been guessed
 * wrong: the video reel is Bella, not Meller, and the gif is Nutrients. Each
 * becomes a link only once its project renders, so adding one needs no change
 * here.
 *
 * The original's unannounced project at 2403 and the COMING SOON label that
 * marked it are deliberately dropped from this rebuild.
 */
const ITEMS: CanvasItem[] = [
  {
    id: "intersections",
    src: "/images/home/01K7FSHN3PBRK38PQNRBV3S3XH.webp",
    alt: "Intersections poster on gravel",
    slug: "intersections",
    loadStrategy: "priority",
    desktop: { top: 192, left: 647, width: 581, height: 533, zIndex: 13, rotate: -10 },
    mobile: { top: 81, left: 56, width: 263, height: 223, zIndex: 325, rotate: -10 },
  },
  {
    id: "nutrients",
    src: "/images/home/01K6ED322FX5PF204385YMPZ13.gif",
    alt: "Nutrients project animation",
    slug: "nutrients",
    // "eager" rather than "priority", and the difference is worth 12 seconds.
    // Next passes animated GIFs through unoptimized, so this stays 2.6MB no
    // matter what, and it is the LCP element on mobile. Left lazy it lands last
    // in the queue: mobile LCP 18.8s. Marked priority it becomes an eager image
    // React will hold the first paint for, which cost desktop 1.0s -> 3.1s.
    // Eager at low fetch priority is the one that wins both — mobile 6.0s,
    // desktop 1.1s. Revisit once it is a looping <video> of a few hundred KB.
    loadStrategy: "eager",
    desktop: { top: 622, left: 655, width: 583, height: 711, zIndex: 32 },
    mobile: { top: 332, left: 54, width: 267, height: 369, zIndex: 326 },
  },
  {
    id: "matteomeller",
    src: "/images/home/01KFRM9P6S9WPJZY8WYQMH09AQ.png",
    alt: "Matteo Meller poster detail",
    slug: "matteomeller",
    desktop: { top: 1167, left: 610, width: 368, height: 494, zIndex: 42 },
    mobile: { top: 706, left: 74, width: 228, height: 306, zIndex: 323 },
  },
  {
    id: "bella-reel",
    kind: "video",
    src: "/videos/home/01K7FVNCECYCS9NXXCMDEPJFNY.mp4",
    poster: "/images/home/01KAVH6HP6ZK57SPGRTM885Q7M.jpeg",
    alt: "Bella che ti Spiazza project video reel",
    slug: "bella",
    desktop: { top: 1484, left: 898, width: 371, height: 464, zIndex: 43, rotate: -10 },
    // The original tilts this one the other way on mobile.
    mobile: { top: 1050, left: 65, width: 244, height: 272, zIndex: 324, rotate: 10 },
  },
  {
    id: "miche",
    src: "/images/home/01K7J9GXPKRC6EHA66C8E3TMWC.webp",
    alt: "Miche project photo",
    slug: "miche",
    desktop: { top: 1801, left: 632, width: 557, height: 557, zIndex: 10, borderRadius: 9999 },
    // 0.2146 of the layout width resolves to ~80px here, well short of the half
    // that would round it off — a rounded square on mobile, a circle on desktop.
    mobile: { top: 1360, left: 37, width: 301, height: 301, zIndex: 207, borderRadius: 80 },
  },
  {
    id: "anselmi",
    src: "/images/home/01K7H4E2QYKQSFEAY19RKRPFWJ.png",
    alt: "Anselmi project",
    slug: "anselmi",
    // Nudged right from the original's 508: it was the leftmost item on the
    // canvas by 50px, and the collage leaned left once the project below it
    // went. Mobile keeps 18 — at 338 wide on a 375 canvas it is already inset
    // symmetrically and has nowhere to go.
    desktop: { top: 2204, left: 578, width: 570, height: 433, zIndex: 26 },
    mobile: { top: 1672, left: 18, width: 338, height: 257, zIndex: 220 },
  },
  {
    id: "visualgroup",
    src: "/images/home/01K7J8RZ7BY2Z2QGC84N1D65G7.webp",
    alt: "Visual Group project",
    slug: "visualgroup",
    // Raised 368 desktop / 265 mobile to close the hole the dropped project
    // left. Attiva moves by the same amount below, so the pair keeps the
    // spacing the original gave it.
    desktop: { top: 2492, left: 558, width: 560, height: 588, zIndex: 28 },
    mobile: { top: 1953, left: 50, width: 275, height: 302, zIndex: 218 },
  },
  {
    id: "attivaservizi",
    src: "/images/home/01K7CHHJ966KN521QRZEA3GEW7.webp",
    alt: "Attiva Servizi project",
    slug: "attivaservizi",
    // The original declares 934.572px here; the browser clamps it against the
    // box, so keeping the declared value reproduces the same rounded shape.
    desktop: { top: 2959, left: 784, width: 539, height: 413, zIndex: 27, borderRadius: 935 },
    mobile: { top: 2279, left: 50, width: 275, height: 188, zIndex: 206, borderRadius: 235 },
  },
];

/**
 * What share of the viewport the item actually occupies, so the optimizer can
 * pick a width instead of shipping the full-resolution original.
 *
 * Both canvases scale to 100vw (1492px wide on desktop, 375 on mobile — the
 * `--canvas-w` values in `globals.css`), so an item's on-screen width is a
 * fixed fraction of the viewport at every window size. The breakpoint has to
 * stay in step with the 1024px one `globals.css` switches placements at.
 */
function sizesFor(item: CanvasItem): string {
  const share = (width: number, canvas: number) => `${((width / canvas) * 100).toFixed(1)}vw`;
  return `(min-width: 1024px) ${share(item.desktop.width, 1492)}, ${share(item.mobile.width, 375)}`;
}

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

function Item({ item, href }: { item: CanvasItem; href?: string }) {
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
        sizes={sizesFor(item)}
        priority={item.loadStrategy === "priority"}
        // Low fetch priority is what keeps an eager image out of the paint's
        // way: react-dom skips both its preload and its suspensey-image hold
        // for anything marked low, so it loads early without blocking.
        {...(item.loadStrategy === "eager"
          ? { loading: "eager" as const, fetchPriority: "low" as const }
          : {})}
      />
    );

  return (
    <div className="canvas-item" style={placementVars(item)}>
      {href ? (
        <TransitionLink
          href={href}
          aria-label={item.alt}
          // Prefetch off, and it is the *images* that make it worth it. React
          // emits a preload link for every <img> that is not lazy, so each
          // project's eager Entry Image travels inside that route's prefetched
          // payload and lands in this page's <head> — eight of them, 6.7MB,
          // marked fetchpriority=high, outranking this page's own LCP image in
          // the network queue. The route payloads themselves are ~1KB and the
          // chunks are shared with this page, so almost nothing is lost: the
          // 1400ms wipe already covers the navigation.
          prefetch={false}
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

export async function PortfolioCanvas() {
  // A thumbnail becomes a link only once its project renders, so every item can
  // carry its real slug today without shipping dead links.
  const published = new Set(await getPublishedProjectSlugs());

  return (
    <div
      // `isolation` keeps the items' z-indices inside their own stacking
      // context. Without it the tallest of them (the Bella reel at 43, the
      // Meller poster at 42) paint straight over the CV panel's z-30 as it
      // sticks into view.
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
            <Item
              key={item.id}
              item={item}
              href={item.slug && published.has(item.slug) ? `/${item.slug}` : undefined}
            />
          ))}
        </div>
      </ScaledCanvas>
    </div>
  );
}

export { CANVAS_HEIGHT, MOBILE_CANVAS_HEIGHT };
