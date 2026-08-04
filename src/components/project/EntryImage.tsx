import { MediaAsset } from "./MediaAsset";
import type { EntryImage as EntryImageType } from "@/types/project";

/** Full-bleed hero image. Sits behind the fixed, blurred header (no z-index needed — normal flow renders under it). */
export function EntryImage({ image }: { image: EntryImageType }) {
  return (
    <div className="relative w-full">
      <MediaAsset asset={image} className="block h-auto w-full object-cover" />
    </div>
  );
}
