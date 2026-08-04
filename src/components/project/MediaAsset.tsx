import type { ProjectMediaAsset } from "@/types/project";

export function MediaAsset({ asset, className }: { asset: ProjectMediaAsset; className?: string }) {
  if (asset.kind === "video") {
    return <video src={asset.src} className={className} autoPlay loop muted playsInline />;
  }

  // eslint-disable-next-line @next/next/no-img-element -- dimensions are unknown at build time (CMS-driven asset)
  return <img src={asset.src} alt="" className={className} />;
}
