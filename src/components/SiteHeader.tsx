import Link from "next/link";

// Offsets are percentages of the viewport width, measured on the original at
// 1024/1440/1920 — they were identical at all three, so the original positions
// this bar proportionally rather than at fixed pixel offsets.
const ITEM = "absolute top-1/2 -translate-y-1/2 font-bold text-[17px] whitespace-nowrap";

export function SiteHeader() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-background/23 backdrop-blur-[30px]"
      style={{ height: 35 }}
    >
      <Link href="/" className={ITEM} style={{ left: "0.91%" }}>
        Alessandro Zanatta
      </Link>
      <span className={ITEM} style={{ left: "25.69%" }}>
        Graphic Design
      </span>
      <span className={ITEM} style={{ left: "50.25%" }}>
        Portfolio
      </span>
      {/* Right-anchored: the original's right edge sits at 99% at every width. */}
      <a href="mailto:work@alessandrozanatta.it" className={ITEM} style={{ right: "1%" }}>
        Say Hello!
      </a>
    </header>
  );
}
