import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProjectPageRedirect } from '@/components/ProjectPageRedirect';
import { publicProjects, site } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return publicProjects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = publicProjects.find(item => item.slug === slug);
  return project ? {
    title: project.title,
    description: project.summary,
    ...(site.url ? { alternates: { canonical: '/' } } : {}),
    openGraph: { title: project.title, description: project.summary },
  } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = publicProjects.find(item => item.slug === slug);
  if (!project) notFound();
  return <ProjectPageRedirect slug={project.slug} title={project.title} />;
}
