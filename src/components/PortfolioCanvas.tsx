import Image from "next/image";
import { ScaledCanvas, DESIGN_WIDTH } from "./ScaledCanvas";
import { getProjectSlugs } from "@/lib/projects";
import type { CanvasItem } from "@/types/portfolio";

const CANVAS_HEIGHT = 4200;

/**
 * Slugs below are the original's real link targets, read out of the layout JSON
 * embedded in alessandrozanatta.it rather than inferred from the artwork. Three
 * were previously guessed wrong: the video reel is Bella, not Meller; the gif is
 * Nutrients; and the item at 2403 is the unannounced project the COMING SOON
 * label sits on, which the original leaves unlinked.
 */
const ITEMS: CanvasItem[] = [
  {
    id: "intersections",
    top: 192,
    left: 647,
    width: 581,
    height: 533,
    zIndex: 13,
    rotate: -10,
    src: "/images/home/01K7FSHN3PBRK38PQNRBV3S3XH.webp",
    alt: "Intersections poster on gravel",
    slug: "intersections",
  },
  {
    id: "matteomeller",
    top: 1167,
    left: 610,
    width: 368,
    height: 494,
    zIndex: 42,
    src: "/images/home/01KFRM9P6S9WPJZY8WYQMH09AQ.png",
    alt: "Matteo Meller poster detail",
    slug: "matteomeller",
  },
  {
    id: "miche",
    top: 1801,
    left: 632,
    width: 557,
    height: 557,
    zIndex: 10,
    src: "/images/home/01K7J9GXPKRC6EHA66C8E3TMWC.webp",
    alt: "Miche project photo",
    slug: "miche",
    borderRadius: 9999,
  },
  {
    id: "anselmi",
    top: 2204,
    left: 508,
    width: 570,
    height: 433,
    zIndex: 26,
    src: "/images/home/01K7H4E2QYKQSFEAY19RKRPFWJ.png",
    alt: "Anselmi project",
    slug: "anselmi",
  },
  {
    id: "bella-reel",
    top: 1484,
    left: 898,
    width: 371,
    height: 464,
    zIndex: 43,
    rotate: -10,
    kind: "video",
    src: "/videos/home/01K7FVNCECYCS9NXXCMDEPJFNY.mp4",
    poster: "/images/home/01KAVH6HP6ZK57SPGRTM885Q7M.jpeg",
    alt: "Bella che ti Spiazza project video reel",
    slug: "bella",
  },
  {
    id: "nutrients",
    top: 622,
    left: 655,
    width: 583,
    height: 711,
    zIndex: 32,
    src: "/images/home/01K6ED322FX5PF204385YMPZ13.gif",
    alt: "Nutrients project animation",
    slug: "nutrients",
  },
  {
    id: "coming-soon-project",
    top: 2403,
    left: 757,
    width: 611,
    height: 599,
    zIndex: 29,
    src: "/images/home/01K7CH55PWQR15RV07GT255G67.webp",
    // Unlinked on the original: this is the project the COMING SOON label marks.
    alt: "Unannounced project",
  },
  {
    id: "coming-soon",
    top: 2684,
    left: 1043,
    width: 105,
    height: 25,
    zIndex: 48,
    src: "",
    alt: "",
  },
  {
    id: "visualgroup",
    top: 2860,
    left: 558,
    width: 560,
    height: 588,
    zIndex: 28,
    src: "/images/home/01K7J8RZ7BY2Z2QGC84N1D65G7.webp",
    alt: "Visual Group project",
    slug: "visualgroup",
  },
  {
    id: "attivaservizi",
    top: 3327,
    left: 784,
    width: 539,
    height: 413,
    zIndex: 27,
    src: "/images/home/01K7CHHJ966KN521QRZEA3GEW7.webp",
    alt: "Attiva Servizi project",
    slug: "attivaservizi",
    // The original declares 934.572px here; the browser clamps it against the
    // box, so keeping the declared value reproduces the same rounded shape.
    borderRadius: 935,
  },
];

function Item({ item, href }: { item: CanvasItem; href?: string }) {
  if (item.id === "coming-soon") {
    return (
      <div
        style={{
          position: "absolute",
          top: item.top,
          left: item.left,
          zIndex: item.zIndex,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "#1b1b1b",
        }}
      >
        COMING SOON
      </div>
    );
  }

  // The original rotates the asset inside its positioned wrapper, so the tilt
  // pivots on the item's centre and leaves the recorded top/left untouched.
  const rotation = item.rotate ? { rotate: `${item.rotate}deg` } : null;

  const img =
    item.kind === "video" ? (
      <video
        src={item.src}
        poster={item.poster}
        style={{
          width: item.width,
          height: item.height,
          objectFit: "cover",
          borderRadius: item.borderRadius ?? 0,
          display: "block",
          ...rotation,
        }}
        // The reel is the heaviest asset on the site (8MB) and sits well below
        // the fold. It has a poster, so deferring costs nothing visually.
        preload="metadata"
        autoPlay
        loop
        muted
        playsInline
      />
    ) : (
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        style={{
          width: item.width,
          height: item.height,
          objectFit: "cover",
          borderRadius: item.borderRadius ?? 0,
          display: "block",
          ...rotation,
        }}
        unoptimized
      />
    );

  return (
    <div
      style={{
        position: "absolute",
        top: item.top,
        left: item.left,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex,
      }}
    >
      {href ? (
        <a
          href={href}
          aria-label={item.alt}
          className="block transition-[filter,opacity] duration-200 ease-linear hover:opacity-80 hover:blur-[1px]"
        >
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}

export async function PortfolioCanvas() {
  // A thumbnail becomes a link only once its project exists in the CMS. Every
  // item can therefore carry its real slug today without shipping dead links,
  // and adding a project needs no change here.
  const published = new Set(await getProjectSlugs());

  return (
    <div
      className="relative w-full"
      style={{ height: `calc(${CANVAS_HEIGHT} / ${DESIGN_WIDTH} * 100vw)` }}
    >
      <ScaledCanvas>
        <div style={{ position: "relative", width: DESIGN_WIDTH, height: CANVAS_HEIGHT }}>
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
