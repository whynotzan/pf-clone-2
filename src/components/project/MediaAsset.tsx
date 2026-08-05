import type { ProjectMediaAsset } from "@/types/project";

export function MediaAsset({ asset, className }: { asset: ProjectMediaAsset; className?: string }) {
  const style = asset.width && asset.height ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined;

  if (asset.kind === "video") {
    return <video src={asset.src} className={className} style={style} autoPlay loop muted playsInline />;
  }

  // eslint-disable-next-line @next/next/no-img-element -- dimensions are read from disk at build time and applied via aspect-ratio
  return <img src={asset.src} alt="" className={className} style={style} />;
}
