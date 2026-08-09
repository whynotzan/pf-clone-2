import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectTemplate } from "@/components/project/ProjectTemplate";
import { getProject, getProjectSeo, getProjectSlugs } from "@/lib/projects";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getProjectSeo(slug);
  if (!seo) return {};

  // The entry image is the page's own hero, so a shared link previews the work
  // itself rather than the site-wide card — except when it is an SVG, which no
  // major network renders in a link preview (nutrients has one). Those fall back
  // to the site card, which is at least visible.
  const preview = seo.image.toLowerCase().endsWith(".svg")
    ? { url: "/seo/og-image.jpeg", alt: "Alessandro Zanatta / Graphic Designer" }
    : { url: seo.image, alt: seo.name };

  return {
    title: seo.name,
    description: seo.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "article",
      title: `${seo.name} / Alessandro Zanatta`,
      description: seo.description,
      url: `/${slug}`,
      images: [preview],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.name} / Alessandro Zanatta`,
      description: seo.description,
      images: [preview.url],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return <ProjectTemplate project={project} />;
}
