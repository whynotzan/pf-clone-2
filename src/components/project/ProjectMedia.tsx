import { MediaAsset } from "./MediaAsset";
import type { ProjectMediaBlock } from "@/types/project";

/**
 * One row of body media: a 1-4 column grid, optionally breaking out to full-bleed width.
 * The 81.57% cap is the original's 1217px content column against its 1492px canvas.
 *
 * An authored `height` crops the row rather than letting the assets set their own
 * proportions, which is how the original sizes its rows. It is expressed against the
 * same 1492px canvas as the entry/exit boxes, so it scales with window width rather
 * than window height.
 *
 * Fixing that height needs `gridAutoRows` as well as `height`. Grid tracks size to
 * their content by default, so an image whose aspect-ratio makes it taller than the
 * row simply overflows the box while `h-full` resolves against the *grown* track and
 * changes nothing. Pinning the tracks to `minmax(0, 1fr)` makes them share the
 * container's height instead, which is what lets `h-full` + `object-cover` crop.
 */
export function ProjectMedia({ block }: { block: ProjectMediaBlock }) {
  const { columns, gap, fullBleed, height, assets } = block;
  const rowHeight = height ? `calc(100vw * ${height} / 1492)` : undefined;

  return (
    <div className={fullBleed ? "w-full" : "mx-auto w-full max-w-[81.57%]"}>
      <div
        className={`grid ${rowHeight ? "overflow-hidden" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap,
          height: rowHeight,
          gridAutoRows: rowHeight ? "minmax(0, 1fr)" : undefined,
        }}
      >
        {assets.map((asset, i) => (
          <MediaAsset
            key={i}
            asset={asset}
            className={`block w-full min-w-0 object-cover ${rowHeight ? "h-full min-h-0" : "h-auto"}`}
          />
        ))}
      </div>
    </div>
  );
}
