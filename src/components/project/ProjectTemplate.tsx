import { EntryImage } from "./EntryImage";
import { ExitImage } from "./ExitImage";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectCanvas } from "./ProjectCanvas";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectTextBlock } from "./ProjectTextBlock";
import type { ProjectData } from "@/types/project";

/**
 * Project Template — the shared layout every project case-study page is built from.
 * Sections, top to bottom: Entry Image, Client/Type/Year + First Description,
 * Body (media rows and interstitial text blocks), Exit Image.
 * Top/bottom sticky chrome lives in the (site) layout, shared with the homepage.
 */
export function ProjectTemplate({ project }: { project: ProjectData }) {
  return (
      <main className="relative min-h-screen bg-background text-foreground">
        <EntryImage image={project.entryImage} />
        <ProjectInfo meta={project.meta} firstDescription={project.firstDescription} />

        {/* A project can pin its own fixed gap; without one the responsive
            default stands, which is what every project but OCTA LINK uses. */}
        <div
          className={`mt-12 flex flex-col sm:mt-20 ${project.bodyGap === null ? "gap-4 sm:gap-6" : ""}`}
          style={project.bodyGap === null ? undefined : { gap: project.bodyGap }}
        >
          {project.body.map((item, i) => {
            if (item.type === "media") return <ProjectMedia key={i} block={item.block} />;
            if (item.type === "canvas") return <ProjectCanvas key={i} block={item.block} />;
            return <ProjectTextBlock key={i} block={item.block} />;
          })}
        </div>

        <div className="mt-16 sm:mt-24">
          <ExitImage image={project.exitImage} />
        </div>

        <div className="w-full bg-background" style={{ height: 35 }} aria-hidden />
      </main>
  );
}
