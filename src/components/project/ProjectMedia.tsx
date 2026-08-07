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
 * row to an authored height (the original uses 1036, 705, 829 ... regardless of what the
 * image's own proportions are), and `columnWidths` gives uneven splits like 735/490 - which
 * also cover partial-width rows, since tracks narrower than the container leave the row
 * short and `align` decides where it sits.
 */
export function ProjectMedia({ block }: { block: ProjectMediaBlock }) {
  const { columns, gap, fullBleed, rowHeight, columnWidths, align, assets } = block;

  const gridTemplateColumns = columnWidths.length
    ? columnWidths.map(canvasPx).join(" ")
    : `repeat(${columns}, minmax(0, 1fr))`;

  return (
    <div className={fullBleed ? "w-full" : "mx-auto w-full max-w-[81.57%]"}>
      <div
        className="grid"
        style={{
          gridTemplateColumns,
          gap,
          justifyContent: JUSTIFY[align],
          height: rowHeight ? canvasPx(rowHeight) : undefined,
        }}
      >
        {assets.map((asset, i) => (
          <MediaAsset
            key={i}
            asset={asset}
            fill={!!rowHeight}
            className={
              rowHeight
                ? "block h-full w-full min-w-0 object-cover"
                : "block h-auto w-full min-w-0 object-cover"
            }
          />
        ))}
      </div>
    </div>
  );
}
