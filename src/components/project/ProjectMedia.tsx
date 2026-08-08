import { MediaAsset } from "./MediaAsset";
import type { ProjectMediaBlock } from "@/types/project";

/**
 * One row of body media: a 1-4 column grid, optionally breaking out to full-bleed width.
 * The 81.57% cap is the original's 1217px content column against its 1492px canvas.
 *
 * An authored `height` crops the row rather than letting the assets set their own
 * proportions, which is how the original sizes its rows. It is expressed against the
 * same 1492px canvas as the entry/exit boxes, so it scales with window width rather
 * than window height. With a height set, `h-full` overrides the aspect-ratio that
 * MediaAsset applies, and `object-cover` does the cropping.
 */
export function ProjectMedia({ block }: { block: ProjectMediaBlock }) {
  const { columns, gap, fullBleed, height, assets } = block;
  const rowHeight = height ? `calc(100vw * ${height} / 1492)` : undefined;

  return (
    <div className={fullBleed ? "w-full" : "mx-auto w-full max-w-[81.57%]"}>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap, height: rowHeight }}
      >
        {assets.map((asset, i) => (
          <MediaAsset
            key={i}
            asset={asset}
            className={`block w-full min-w-0 object-cover ${rowHeight ? "h-full" : "h-auto"}`}
          />
        ))}
      </div>
    </div>
  );
}
