import { MediaAsset } from "./MediaAsset";
import type { EntryImage as EntryImageType } from "@/types/project";

/**
 * Full-bleed hero image, cropped to the original's 1492x754 design box.
 *
 * It is *not* a viewport-height image: probing alessandrozanatta.it at 900px and
 * 1300px viewport heights returned 754px both times, so the height is fixed to
 * the canvas width, not the screen. The original also starts it below the 35px
 * header rather than running underneath it.
 */
export function EntryImage({ image }: { image: EntryImageType }) {
  return (
    <div className="relative w-full" style={{ marginTop: 35, height: "calc(100vw * 754 / 1492)" }}>
      <MediaAsset asset={image} className="block h-full w-full object-cover" priority />
    </div>
  );
}
