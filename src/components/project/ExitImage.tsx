import { MediaAsset } from "./MediaAsset";
import type { ExitImage as ExitImageType } from "@/types/project";

/** Full-bleed closing image. Runs flush to the bottom edge so it sits behind the fixed, blurred footer. */
export function ExitImage({ image }: { image: ExitImageType }) {
  return (
    <div className="relative h-screen w-full">
      <MediaAsset asset={image} className="block h-full w-full object-cover" />
    </div>
  );
}
