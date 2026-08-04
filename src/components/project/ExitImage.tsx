import { MediaAsset } from "./MediaAsset";
import type { ExitImage as ExitImageType } from "@/types/project";

/** Full-bleed closing image. Runs flush to the bottom edge so it sits behind the fixed, blurred footer. */
export function ExitImage({ image }: { image: ExitImageType }) {
  return (
    <div className="relative w-full">
      <MediaAsset asset={image} className="block h-auto w-full object-cover" />
    </div>
  );
}
