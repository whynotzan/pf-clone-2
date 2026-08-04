import type { ProjectTextBlock as ProjectTextBlockType } from "@/types/project";

/** An interstitial paragraph block that sometimes appears between body media, e.g. a "Visit the website!" CTA. */
export function ProjectTextBlock({ block }: { block: ProjectTextBlockType }) {
  return (
    <div className="mx-auto flex w-full max-w-[1217px] flex-wrap items-baseline gap-x-3 gap-y-2 px-4 py-6 sm:px-0">
      {block.paragraphs.map((p, i) => (
        <span key={i} style={{ fontSize: 22, fontWeight: 400, color: "#1b1b1b" }}>
          {p}
        </span>
      ))}
      {block.cta && (
        <a
          href={block.cta.href}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 22, fontWeight: 500, color: "#1b1b1b" }}
        >
          {block.cta.label}
        </a>
      )}
    </div>
  );
}
