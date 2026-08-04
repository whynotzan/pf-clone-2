import { MediaAsset } from "./MediaAsset";
import type { ProjectMediaBlock } from "@/types/project";

/** One row of body media: full-bleed, centered "wide", or two assets side by side. */
export function ProjectMedia({ block }: { block: ProjectMediaBlock }) {
  if (block.layout === "full") {
    return (
      <div className="w-full">
        <MediaAsset asset={block.assets[0]} className="block h-auto w-full object-cover" />
      </div>
    );
  }

  if (block.layout === "wide") {
    return (
      <div className="mx-auto w-full max-w-[1217px] px-4 sm:px-0">
        <MediaAsset asset={block.assets[0]} className="block h-auto w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1217px] justify-center gap-4 px-4 sm:gap-6 sm:px-0">
      {block.assets.map((asset, i) => (
        <MediaAsset key={i} asset={asset} className="h-auto flex-1 object-cover" />
      ))}
    </div>
  );
}
