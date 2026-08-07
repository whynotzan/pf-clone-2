import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { EntryImage } from "./EntryImage";
import { ExitImage } from "./ExitImage";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectTextBlock } from "./ProjectTextBlock";
import type { ProjectData } from "@/types/project";

/**
 * Project Template — the shared layout every project case-study page is built from.
 * Sections, top to bottom: Entry Image, Client/Type/Year + First Description,
 * Body (media rows and interstitial text blocks), Exit Image.
 * Top/bottom sticky chrome (SiteHeader/SiteFooter) is identical to the homepage's.
 */
export function ProjectTemplate({ project }: { project: ProjectData }) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen bg-background text-foreground">
        <EntryImage image={project.entryImage} />
        <ProjectInfo meta={project.meta} firstDescription={project.firstDescription} />

        <div className="mt-12 flex flex-col gap-4 sm:mt-20 sm:gap-6">
          {project.body.map((item, i) =>
            item.type === "media" ? (
              <ProjectMedia key={i} block={item.block} />
            ) : (
              <ProjectTextBlock key={i} block={item.block} />
            )
          )}
        </div>

        <div className="mt-16 sm:mt-24">
          <ExitImage image={project.exitImage} />
        </div>

        <div className="w-full bg-background" style={{ height: 35 }} aria-hidden />
      </main>

      <Link
        href="/"
        className="fixed bottom-0 left-0 z-50 flex w-full items-center gap-2 px-4 bg-background/23 backdrop-blur-[30px]"
        style={{ height: 35, fontSize: 16, fontWeight: 500 }}
      >
        <span aria-hidden>←</span> Back
      </Link>
    </>
  );
}
