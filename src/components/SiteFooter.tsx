// Measured on the original the same way as SiteHeader — the footer sits on
// slightly different offsets than the header, so it keeps its own values.
const ITEM = "absolute top-1/2 -translate-y-1/2 font-bold text-[17px] whitespace-nowrap";

export function SiteFooter() {
  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-50 bg-background/23 backdrop-blur-[30px]"
      style={{ height: 34 }}
    >
      <span className={ITEM} style={{ left: "1.08%" }}>
        2026
      </span>
      <a
        href="https://www.linkedin.com/in/alessandro-zanatta-515478223/"
        target="_blank"
        rel="noreferrer"
        className={ITEM}
        style={{ left: "25.68%" }}
      >
        LinkedIn
      </a>
      <span className={ITEM} style={{ left: "50.68%" }}>
        Download Area
      </span>
      {/* Right-anchored: the original's right edge sits at 98.95% at every width. */}
      <a
        href="mailto:work@alessandrozanatta.it"
        className={ITEM}
        style={{ right: "1.05%" }}
      >
        work@alessandrozanatta.it
      </a>
    </footer>
  );
}
