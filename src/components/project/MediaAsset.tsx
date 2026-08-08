import type { ProjectMediaAsset } from "@/types/project";

/**
 * `priority` marks the one asset that is above the fold — the Entry Image, which
 * is also the page's LCP element. Everything else defers: a project page stacks
 * a dozen-plus full-width assets (matteomeller alone is ~22MB) and without this
 * the browser fetches every one of them before the visitor has scrolled.
 */
export function MediaAsset({
  asset,
  className,
  priority = false,
}: {
  asset: ProjectMediaAsset;
  className?: string;
  priority?: boolean;
}) {
  const style = asset.width && asset.height ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined;

  if (asset.kind === "video") {
    return (
      <video
        src={asset.src}
        className={className}
        style={style}
        // "metadata" rather than "none": it still yields a first frame to paint,
        // so a deferred video does not flash an empty box. Body videos carry no
        // poster — the CMS schema has no field for one yet.
        preload={priority ? "auto" : "metadata"}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- dimensions are read from disk at build time and applied via aspect-ratio
    <img
      src={asset.src}
      alt=""
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
