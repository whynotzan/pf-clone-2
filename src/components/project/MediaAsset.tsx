import type { ProjectMediaAsset } from "@/types/project";

/**
 * `fill` suppresses the intrinsic aspect-ratio so the asset can be cropped to a
 * container height instead (fixed-height rows, entry/exit images). It is also what
 * makes videos safe to place: they have no dimensions on disk for sharp to read, so
 * without a fixed height they would reserve no space and shift the page as they load.
 */
export function MediaAsset({
  asset,
  className,
  fill = false,
}: {
  asset: ProjectMediaAsset;
  className?: string;
  fill?: boolean;
}) {
  const style = !fill && asset.width && asset.height ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined;

  if (asset.kind === "video") {
    return <video src={asset.src} className={className} style={style} autoPlay loop muted playsInline />;
  }

  // eslint-disable-next-line @next/next/no-img-element -- dimensions are read from disk at build time and applied via aspect-ratio
  return <img src={asset.src} alt="" className={className} style={style} />;
}
