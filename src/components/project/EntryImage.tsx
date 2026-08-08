import { MediaAsset } from "./MediaAsset";
import type { EntryImage as EntryImageType } from "@/types/project";

/**
 * Full-bleed hero image, cropped to the original's 1492x754 design box.
 *
 * It is *not* a viewport-height image: probing alessandrozanatta.it at 900px and
 * 1300px viewport heights returned 754px both times, so the height is fixed to
 * the canvas width, not the screen. The original also starts it below the 35px
 * header rather than running underneath it.
 *
 * Mobile gets its own box, 375x444 on the original's 375px canvas — markedly
 * taller in proportion than the desktop crop, not the same box rescaled.
 */
export function EntryImage({ image }: { image: EntryImageType }) {
  return (
    <div
      className="relative h-[calc(100vw*444/375)] w-full lg:h-[calc(100vw*754/1492)]"
      style={{ marginTop: 35 }}
    >
      <MediaAsset asset={image} className="block h-full w-full object-cover" />
    </div>
  );
}
