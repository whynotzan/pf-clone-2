import { MediaAsset } from "./MediaAsset";
import type { ExitImage as ExitImageType } from "@/types/project";

/**
 * Full-bleed closing image, cropped to the original's 1492x906 design box.
 * Fixed to the canvas width for the same reason as the entry image — it measured
 * 906px at both 900px and 1300px viewport heights. Runs flush to the bottom edge
 * so it sits behind the fixed, blurred footer.
 *
 * On mobile it matches the entry image's 444-of-375 box rather than the 217 the
 * original clips to, so a project opens and closes on the same height.
 */
export function ExitImage({ image }: { image: ExitImageType }) {
  return (
    <div className="relative h-[calc(100vw*444/375)] w-full lg:h-[calc(100vw*906/1492)]">
      <MediaAsset asset={image} className="block h-full w-full object-cover" />
    </div>
  );
}
