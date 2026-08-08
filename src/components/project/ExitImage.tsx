import { MediaAsset } from "./MediaAsset";
import type { ExitImage as ExitImageType } from "@/types/project";

/**
 * Full-bleed closing image, cropped to the original's 1492x906 design box.
 * Fixed to the canvas width for the same reason as the entry image — it measured
 * 906px at both 900px and 1300px viewport heights. Runs flush to the bottom edge
 * so it sits behind the fixed, blurred footer.
 *
 * The original's mobile closing section clips to 217px of its 375px canvas —
 * a slightly shallower crop than desktop's, with the asset itself covering it.
 */
export function ExitImage({ image }: { image: ExitImageType }) {
  return (
    <div className="relative h-[calc(100vw*217/375)] w-full lg:h-[calc(100vw*906/1492)]">
      <MediaAsset asset={image} className="block h-full w-full object-cover" />
    </div>
  );
}
