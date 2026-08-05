import Image from "next/image";
import { ScaledCanvas, DESIGN_WIDTH } from "./ScaledCanvas";
import type { CanvasItem } from "@/types/portfolio";

const CANVAS_HEIGHT = 4200;

const ITEMS: CanvasItem[] = [
  {
    id: "intersections",
    top: 192,
    left: 647,
    width: 581,
    height: 533,
    zIndex: 13,
    src: "/images/home/01K7FSHN3PBRK38PQNRBV3S3XH.webp",
    alt: "Intersections poster on gravel",
    href: "/matteomeller",
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
    href: "/matteomeller",
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
    href: "/matteomeller",
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
    href: "/matteomeller",
  },
  {
    id: "matteomeller-reel",
    top: 1484,
    left: 898,
    width: 371,
    height: 464,
    zIndex: 43,
    kind: "video",
    src: "/videos/home/01K7FVNCECYCS9NXXCMDEPJFNY.mp4",
    poster: "/images/home/01KAVH6HP6ZK57SPGRTM885Q7M.jpeg",
    alt: "Matteo Meller project video reel",
    href: "/matteomeller",
  },
  {
    id: "nutrients-gif",
    top: 600,
    left: 633,
    width: 563,
    height: 686,
    zIndex: 32,
    src: "/images/home/01K6ED322FX5PF204385YMPZ13.gif",
    alt: "Nutrients project animation",
    href: "/matteomeller",
  },
  {
    id: "nutrients",
    top: 2403,
    left: 757,
    width: 611,
    height: 599,
    zIndex: 29,
    src: "/images/home/01K7CH55PWQR15RV07GT255G67.webp",
    alt: "Nutrients project",
    href: "/matteomeller",
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
    href: "/matteomeller",
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
    href: "/matteomeller",
  },
];

function Item({ item }: { item: CanvasItem }) {
  if (item.id === "coming-soon") {
    return (
      <div
        style={{
          position: "absolute",
          top: item.top,
          left: item.left,
          zIndex: item.zIndex,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: "#1b1b1b",
        }}
      >
        COMING SOON
      </div>
    );
  }

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
        }}
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
      {item.href ? (
        <a
          href={item.href}
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

export function PortfolioCanvas() {
  return (
    <div
      className="relative w-full"
      style={{ height: `calc(${CANVAS_HEIGHT} / ${DESIGN_WIDTH} * 100vw)` }}
    >
      <ScaledCanvas>
        <div style={{ position: "relative", width: DESIGN_WIDTH, height: CANVAS_HEIGHT }}>
          {ITEMS.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      </ScaledCanvas>
    </div>
  );
}
