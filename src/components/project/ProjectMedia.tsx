import type { CSSProperties } from "react";
import { MediaAsset } from "./MediaAsset";
import type { ProjectMediaBlock } from "@/types/project";

/** Design-canvas px -> a viewport-scaled length, the same convention the entry/exit images use. */
const canvasPx = (px: number) => `calc(100vw * ${px} / 1492)`;

const JUSTIFY = { left: "start", center: "center", right: "end" } as const;

/**
 * One row of body media: a 1-4 column grid, optionally breaking out to full-bleed width.
 * The 81.57% cap is the original's 1217px content column against its 1492px canvas.
 *
 * Two things follow the original rather than the assets themselves. `rowHeight` crops the
 * row to an authored height (the original uses 1036, 705, 829 ... regardless of the image's
 * own proportions), and `columnWidths` gives uneven splits like 735/490 - which also cover
 * partial-width rows, since tracks narrower than the container leave the row short and
 * `align` decides where it sits.
 *
 * Fixing the height needs `gridAutoRows` as well as `height`. Grid tracks size to their
 * content by default, so an image whose aspect-ratio makes it taller than the row simply
 * overflows the box while `h-full` resolves against the *grown* track and changes nothing.
 * Pinning the rows to `minmax(0, 1fr)` makes them share the container's height instead,
 * which is what lets `h-full` + `object-cover` crop.
 *
 * All of that is desktop-only. Below 1024 the original stacks every row into a single
 * column at left 18 / width 338 of its 375px canvas — no splits, no full-bleed, and no
 * authored height, since those numbers are measurements of the 1492px canvas and mean
 * nothing on a phone. `globals.css` holds the two states; these are the desktop values.
 */
export function ProjectMedia({ block }: { block: ProjectMediaBlock }) {
  const { columns, gap, fullBleed, rowHeight, columnWidths, align, assets } = block;

  const height = rowHeight ? canvasPx(rowHeight) : "auto";
  const gridTemplateColumns = columnWidths.length
    ? columnWidths.map(canvasPx).join(" ")
    : `repeat(${columns}, minmax(0, 1fr))`;

  const vars = {
    "--row-max": fullBleed ? "none" : "81.57%",
    "--row-cols": gridTemplateColumns,
    "--row-justify": JUSTIFY[align],
    "--row-h": height,
    "--row-auto": rowHeight ? "minmax(0, 1fr)" : "auto",
    "--row-asset-h": rowHeight ? "100%" : "auto",
  } as CSSProperties;

  return (
    <div className="project-row-wrap" style={vars}>
      <div className={`project-row ${rowHeight ? "lg:overflow-hidden" : ""}`} style={{ gap }}>
        {assets.map((asset, i) => (
          <MediaAsset key={i} asset={asset} className="project-row-asset block w-full min-w-0 object-cover" />
        ))}
      </div>
    </div>
  );
}
