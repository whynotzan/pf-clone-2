import Image from "next/image";
import type { CSSProperties } from "react";
import { TransitionLink } from "./transition/TransitionLink";
import { ScaledCanvas } from "./ScaledCanvas";
import { getPublishedProjectSlugs } from "@/lib/projects";
import type { CanvasItem, CanvasPlacement } from "@/types/portfolio";

/**
 * 86px past Visual Group's bottom edge (3814), which with `--canvas-tail` in
 * `globals.css` puts the CV ~100px below it at any window height. Was 4274,
 * which left the CV adrift.
 */
const CANVAS_HEIGHT = 3900;

/**
 * Stopped at 2806, where the original's mobile bio begins, so the bio and CV
 * flowed straight on underneath rather than after a gap. (The original's own
 * mobile section runs to 3926, but the rest of that height is the bio and CV,
 * which we render as normal blocks.) Now 3149: OCTA LINK is appended past the
 * original's last item, and the bio moves down by exactly what it needs.
 */
const MOBILE_CANVAS_HEIGHT = 2664;

/**
 * Mobile placements are the original's own, read from its embedded layout table
 * and multiplied by the 375px reference width.
 *
 * Slugs are likewise the original's real link targets, read from `link.url` in
 * that same table rather than inferred from the artwork — three had been guessed
 * wrong: the video reel is Bella, not Meller; the gif is Nutrients; and the item
 * at 2403 is the unannounced project the COMING SOON label sits on, which the
 * original leaves unlinked. Each becomes a link only once its project renders,
 * so adding one needs no change here.
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
    // Restored from the webm/mov pair commit 3fe8a4e converted it to. The
    // artwork is large flat areas of saturated red, which is the worst case for
    // a lossy codec at 4:2:0: the conversion mottled them visibly. Turning the
    // quality up does not buy it back — CRF 18 moves SSIM 0.940 -> 0.944 for
    // 732KB -> 2.3MB, because the damage is chroma subsampling, and VP9's alpha
    // mode cannot do 4:4:4. At 2.3MB the GIF is both smaller and exact.
    src: "/images/home/01K6ED322FX5PF204385YMPZ13.gif",
    alt: "Nutrients project animation",
    slug: "nutrients",
    // "eager" rather than "priority", and the difference is worth 12 seconds.
    // Next passes animated GIFs through unoptimized, so this stays 2.6MB no
    // matter what, and it is the LCP element on mobile. Left lazy it lands last
    // in the queue: mobile LCP 18.8s. Marked priority it becomes an eager image
    // React will hold the first paint for, which cost desktop 1.0s -> 3.1s.
    // Eager at low fetch priority is the one that wins both — mobile 6.0s,
    // desktop 1.1s.
    loadStrategy: "eager",
    desktop: { top: 622, left: 655, width: 583, height: 711, zIndex: 32 },
    mobile: { top: 332, left: 54, width: 267, height: 369, zIndex: 326 },
  },
  {
    id: "coming-soon",
    src: "",
    alt: "",
    desktop: { top: 3050, left: 1043, width: 105, height: 25, zIndex: 48 },
    mobile: { top: 675, left: 262, width: 105, height: 25, zIndex: 328 },
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
    desktop: { top: 1850, left: 898, width: 371, height: 464, zIndex: 43, rotate: -10 },
    // The original tilts this one the other way on mobile.
    mobile: { top: 1120, left: 65, width: 244, height: 272, zIndex: 324, rotate: 10 },
  },
  {
    id: "miche",
    src: "/images/home/01K7J9GXPKRC6EHA66C8E3TMWC.webp",
    alt: "Miche project photo",
    slug: "miche",
    desktop: { top: 2167, left: 632, width: 557, height: 557, zIndex: 10, borderRadius: 9999 },
    // 0.2146 of the layout width resolves to ~80px here, well short of the half
    // that would round it off — a rounded square on mobile, a circle on desktop.
    mobile: { top: 1430, left: 37, width: 301, height: 301, zIndex: 207, borderRadius: 80 },
  },
  {
    id: "anselmi",
    src: "/images/home/01K7H4E2QYKQSFEAY19RKRPFWJ.png",
    alt: "Anselmi project",
    slug: "anselmi",
    desktop: { top: 2570, left: 508, width: 570, height: 433, zIndex: 26 },
    mobile: { top: 1742, left: 18, width: 338, height: 257, zIndex: 220 },
  },
  {
    id: "coming-soon-project",
    src: "/images/home/01K7CH55PWQR15RV07GT255G67.webp",
    // Unlinked on the original: this is the project the COMING SOON label marks.
    alt: "Unannounced project",
    desktop: { top: 2769, left: 757, width: 611, height: 599, zIndex: 29 },
    mobile: { top: 1978, left: 41, width: 293, height: 288, zIndex: 217 },
  },
  {
    id: "visualgroup",
    src: "/images/home/01K7J8RZ7BY2Z2QGC84N1D65G7.webp",
    alt: "Visual Group project",
    slug: "visualgroup",
    desktop: { top: 3226, left: 558, width: 560, height: 588, zIndex: 28 },
    mobile: { top: 2288, left: 50, width: 275, height: 302, zIndex: 218 },
  },
  {
    id: "octalink",
    kind: "video",
    // ProRes 4444 at 1450x1450, and the alpha is doing the work: the artwork is
    // a halftone ring whose gaps are transparent, so ~98% of the frame is. That
    // rules out plain H.264 exactly as it did for Nutrients, and wants the same
    // pair — VP9-in-WebM for Chromium and Firefox, HEVC-in-QuickTime for Safari.
    // Chromium decodes HEVC but not its alpha, so declaring the .mov as
    // video/quicktime is what makes it skip past and take the WebM. 35MB -> 220KB
    // (WebM) / 964KB (HEVC), encoded at 1120px for a 560px tile at 2x.
    src: "/videos/home/octalink.webm",
    sources: [
      { src: "/videos/home/octalink.mov", type: "video/quicktime" },
      { src: "/videos/home/octalink.webm", type: "video/webm" },
    ],
    alt: "OCTA LINK project animation",
    slug: "octalink",
    // A project the original never had, so there is no recorded coordinate to
    // transcribe. Centre ~935 sits halfway across between Matteo Meller (~794)
    // above it and Bella (~1083) below, continuing their left/right swing.
    desktop: { top: 1540, left: 705, width: 460, height: 460, zIndex: 44 },
    mobile: { top: 950, left: 50, width: 230, height: 230, zIndex: 327 },
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
        // `src` and <source> children cannot coexist — src wins — so an item
        // offering alternatives has to go through the children alone.
        {...(item.sources ? {} : { src: item.src })}
        poster={item.poster}
        // Nothing is fetched for a below-the-fold reel until the browser means
        // to play it; an item marked above the fold loads up front instead.
        preload={item.loadStrategy ? "auto" : "none"}
        autoPlay
        loop
        muted
        playsInline
      >
        {item.sources?.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
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
        // for anything marked low, so it loads early without blocking. No
        // image uses this today — it is what the Nutrients GIF needed before
        // it became a video — but the strategy is per-item, not per-kind.
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
      // context. Without it the tallest of them (coming-soon at 48, the poster
      // at 42) paint straight over the CV panel's z-30 as it sticks into view.
      className="canvas-root relative w-full"
      style={{
        isolation: "isolate",
        height: "calc(var(--canvas-h) / var(--canvas-w) * 100vw + var(--canvas-tail, 0px))",
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
