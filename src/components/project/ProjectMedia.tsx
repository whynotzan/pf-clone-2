import { MediaAsset } from "./MediaAsset";
import type { ProjectMediaBlock } from "@/types/project";

/** One row of body media: a 1-4 column grid, optionally breaking out to full-bleed width. */
export function ProjectMedia({ block }: { block: ProjectMediaBlock }) {
  const { columns, gap, fullBleed, assets } = block;

  return (
    <div className={fullBleed ? "w-full" : "mx-auto w-full max-w-[85%]"}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}>
        {assets.map((asset, i) => (
          <MediaAsset key={i} asset={asset} className="block h-auto w-full min-w-0 object-cover" />
        ))}
      </div>
    </div>
  );
}
