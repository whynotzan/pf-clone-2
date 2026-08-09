import type { CSSProperties } from "react";
import Image from "next/image";
import type { ProjectCanvasBlock, ProjectCanvasItem } from "@/types/project";

/** Design-canvas px -> a viewport-scaled length, the same convention the rows and entry/exit images use. */
const canvasPx = (px: number) => `calc(100vw * ${px} / 1492)`;

/**
 * A freely placed group, for the parts of the original that are not rows.
 *
 * Its project pages run the same canvas engine as the homepage, and several
 * pages lean on it: intersections has a 379px image at 45° and two paragraphs
 * floating over a media row, its lower pair of columns overlap by 198px, and
 * nutrients opens on a YouTube embed with a 60x30 mark rotated 180° across a
 * row seam. None of that is expressible as a stack of rows, so those blocks are
 * authored in the original's own 1492px coordinates instead and simply placed.
 *
 * Desktop positions absolutely inside a box of the authored height. Below 1024
 * the coordinates are meaningless — they measure a canvas three times the width
 * of a phone — so items stack in top order at the same 18px margins every other
 * block uses, which is what the original does with its own mobile layout.
 * `globals.css` holds both states.
 */
export function ProjectCanvas({ block }: { block: ProjectCanvasBlock }) {
  // Top order is both the paint order the original implies and the reading
  // order mobile stacks in, so sort once here rather than in two places.
  const items = [...block.items].sort((a, b) => a.top - b.top || a.left - b.left);
  const height =
    block.height ??
    items.reduce((max, i) => Math.max(max, i.top + (i.height ?? 0)), 0);

  return (
    <div
      className="project-canvas"
      style={{ "--canvas-block-h": canvasPx(height) } as CSSProperties}
    >
      {items.map((item, i) => (
        <CanvasItem key={i} item={item} />
      ))}
    </div>
  );
}

function CanvasItem({ item }: { item: ProjectCanvasItem }) {
  const vars = {
    "--ci-top": canvasPx(item.top),
    "--ci-left": canvasPx(item.left),
    "--ci-w": canvasPx(item.width),
    // Text has no authored height on the original; it sizes to its content.
    "--ci-h": item.height ? canvasPx(item.height) : "auto",
    "--ci-rot": `${item.rotate}deg`,
    zIndex: item.zIndex,
  } as CSSProperties;

  return (
    <div className="project-canvas-item" style={vars}>
      {renderContent(item)}
    </div>
  );
}

function renderContent(item: ProjectCanvasItem) {
  switch (item.kind) {
    case "rectangle":
      return (
        <div className="project-canvas-media" style={{ backgroundColor: item.src }} />
      );

    case "text":
      return (
        <p
          className="project-canvas-text"
          style={{
            // Type is authored against the original's 1440px text reference, not
            // the 1492px canvas — the two differ, see PAGE_TOPOLOGY.md.
            fontSize: `calc(100vw * ${item.fontSize} / 1440)`,
            fontWeight: item.fontWeight,
          }}
        >
          {item.text}
        </p>
      );

    case "youtube":
      return (
        <iframe
          className="project-canvas-media"
          src={`https://www.youtube-nocookie.com/embed/${item.src}`}
          title="Embedded video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );

    case "video":
      return (
        <video
          className="project-canvas-media object-cover"
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      );

    default:
      return (
        <Image
          className="project-canvas-media object-cover"
          src={item.src ?? ""}
          alt=""
          width={item.naturalWidth ?? item.width}
          height={item.naturalHeight ?? item.height ?? item.width}
          unoptimized
        />
      );
  }
}
