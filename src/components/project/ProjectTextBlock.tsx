import type { ProjectTextBlock as ProjectTextBlockType, TextStyle } from "@/types/project";

const typeStyle = (style: TextStyle) => ({
  fontSize: style.fontSize,
  fontWeight: style.fontWeight,
  color: "#1b1b1b",
});

/**
 * An interstitial paragraph block that sometimes appears between body media, e.g. a
 * "Visit the website!" CTA. Alignment is a property of the block, but size and weight
 * are carried per piece, so a run of body copy can sit next to a heavier link the way
 * the original sets its CTAs.
 */
export function ProjectTextBlock({ block }: { block: ProjectTextBlockType }) {
  const justify = block.textAlign === "center" ? "center" : block.textAlign === "right" ? "flex-end" : "flex-start";

  return (
    <div
      className="mx-auto flex w-full max-w-[1217px] flex-wrap items-baseline gap-x-3 gap-y-2 px-4 py-6 sm:px-0"
      style={{ textAlign: block.textAlign, justifyContent: justify }}
    >
      {block.paragraphs.map((p, i) => (
        <span key={i} style={typeStyle(p)}>
          {p.text}
        </span>
      ))}
      {block.cta && (
        <a href={block.cta.href} target="_blank" rel="noreferrer" style={typeStyle(block.cta)}>
          {block.cta.label}
        </a>
      )}
    </div>
  );
}
