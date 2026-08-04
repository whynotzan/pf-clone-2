import { notFound } from "next/navigation";
import { ProjectTemplate } from "@/components/project/ProjectTemplate";
import { getProject, getProjectSlugs } from "@/lib/projects";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return <ProjectTemplate project={project} />;
}
