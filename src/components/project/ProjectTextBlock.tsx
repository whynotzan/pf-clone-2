import type { ProjectTextBlock as ProjectTextBlockType } from "@/types/project";

/** An interstitial paragraph block that sometimes appears between body media, e.g. a "Visit the website!" CTA. */
export function ProjectTextBlock({ block }: { block: ProjectTextBlockType }) {
  const textStyle = { fontSize: block.fontSize, fontWeight: block.fontWeight, color: "#1b1b1b" };
  // The original site weights the CTA one step above its paragraph. The CMS only exposes a
  // block-level weight, so derive that emphasis rather than asking the author to set it.
  const ctaStyle = { ...textStyle, fontWeight: block.fontWeight === 400 ? 500 : block.fontWeight };
  const justify = block.textAlign === "center" ? "center" : block.textAlign === "right" ? "flex-end" : "flex-start";

  return (
    <div
      className="mx-auto flex w-full max-w-[1217px] flex-wrap items-baseline gap-x-3 gap-y-2 px-4 py-6 sm:px-0"
      style={{ textAlign: block.textAlign, justifyContent: justify }}
    >
      {block.paragraphs.map((p, i) => (
        <span key={i} style={textStyle}>
          {p}
        </span>
      ))}
      {block.cta && (
        <a href={block.cta.href} target="_blank" rel="noreferrer" style={ctaStyle}>
          {block.cta.label}
        </a>
      )}
    </div>
  );
}
