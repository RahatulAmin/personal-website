import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { publicProjects, publications, site } from '@/lib/content';
import { publicationStatusMeta } from '@/lib/publications';
import { ProjectVisual } from '@/components/ProjectVisual';
import { ResearchImage } from '@/components/ResearchImage';
import { WorkIndex } from '@/components/Shell';

export const dynamicParams = false;

export function generateStaticParams() {
  return publicProjects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = publicProjects.find(project => project.slug === slug);
  return project ? {
    title: project.title,
    description: project.summary,
    ...(site.url ? { alternates: { canonical: `/projects/${project.slug}` } } : {}),
    openGraph: { title: project.title, description: project.summary },
  } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = publicProjects.findIndex(project => project.slug === slug);
  const project = publicProjects[index];
  if (!project) notFound();

  const previous = publicProjects[index - 1];
  const next = publicProjects[index + 1];
  const outputs = publications.filter(publication => publication.projectSlug === project.slug);
  const heroMedia = project.heroImage ?? project.thumbnail;

  return (
    <main id="main" className="page wrap case-study">
      <Link className="text-link" href="/#work">← All work</Link>
      <header className="case-opening">
        <div className="case-opening-copy">
          <h1 className="page-title">{project.title}</h1>
          {project.researchTitle && <p className="case-research-title">{project.researchTitle}</p>}
          <p className="page-intro">{project.summary}</p>
        </div>
        <figure className="case-opening-media" style={{ '--ratio': project.composition.ratio, '--mobile-ratio': project.composition.mobileRatio } as CSSProperties}>
          <ProjectVisual project={project} hero />
          {heroMedia?.caption && <figcaption className="caption hero-caption">{heroMedia.caption}</figcaption>}
        </figure>
      </header>

      <div className="case-context">
        <p className="eyebrow">Project context</p>
        <dl className="case-meta">
          <div><dt>Area</dt><dd>{project.category}</dd></div>
          <div><dt>Dates</dt><dd>{project.year}</dd></div>
          {project.institution && <div><dt>Institution</dt><dd>{project.institution}</dd></div>}
          <div><dt>Status</dt><dd>{project.status}</dd></div>
          <div className="case-meta-wide"><dt>My role</dt><dd>{project.role}</dd></div>
        </dl>
      </div>

      <div className={`case-body case-mode-${project.contentMode}`}>
        {project.metrics.length > 0 && (
          <dl className="case-metrics">
            {project.metrics.map(metric => <div key={`${metric.value}-${metric.label}`}><dt>{metric.value}</dt><dd>{metric.label}</dd></div>)}
          </dl>
        )}

        <section className="case-question">
          <p className="eyebrow">Research question</p>
          <h2>{project.researchQuestion}</h2>
        </section>

        <section className="essay-section"><h2>Why it mattered</h2><p>{project.motivation}</p></section>

        <section className="essay-section">
          <h2>{project.approachLabel}</h2>
          <ul className="research-list">{project.methods.map(method => <li key={method}>{method}</li>)}</ul>
        </section>

        {project.frameworkSteps.length > 0 && (
          <section className="research-pathway-section">
            <p className="eyebrow">Analytical pathway</p>
            <ol className="research-pathway">{project.frameworkSteps.map(step => <li key={step}>{step}</li>)}</ol>
          </section>
        )}

        <section className="essay-section">
          <h2>{project.outcomeLabel}</h2>
          <ul className="research-list research-findings">{project.findings.map(finding => <li key={finding}>{finding}</li>)}</ul>
        </section>

        {project.sections.map((section, sectionIndex) => (
          <section className="essay-section" key={sectionIndex}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
            {section.image && <ResearchImage {...section.image} />}
            {section.video && <figure><video controls preload="metadata" src={section.video.src} aria-label={section.video.caption} /><figcaption className="caption">{section.video.caption}</figcaption></figure>}
          </section>
        ))}

        <section className="essay-section case-contribution">
          <h2>My contribution</h2>
          <ul className="research-list">{project.contributions.map(contribution => <li key={contribution}>{contribution}</li>)}</ul>
        </section>

        <section className="essay-section"><h2>Why it matters</h2><p>{project.significance}</p></section>

        {project.gallery.length > 0 && (
          <section className="case-media-section">
            {project.galleryTitle && <h2>{project.galleryTitle}</h2>}
            <div className="case-gallery">{project.gallery.map(media => <ResearchImage {...media} key={media.src} />)}</div>
          </section>
        )}

        {outputs.length > 0 && (
          <section className="case-outputs">
            <h2>Research outputs</h2>
            {outputs.map(publication => {
              const status = publicationStatusMeta[publication.status];
              return (
                <article className="record" key={publication.id}>
                  <p className={`publication-status status-${status.tone}`}>{status.label}</p>
                  <h3>{publication.title}</h3>
                  <p>{[publication.venue, publication.year].filter(Boolean).join(' · ')}</p>
                  {publication.equalContributionNote && <p className="output-note">{publication.equalContributionNote}</p>}
                  <div className="output-links">
                    <Link className="text-link" href={`/#${publication.id}`}>Publication record ↗</Link>
                    {publication.doi && <a className="text-link" href={`https://doi.org/${publication.doi}`} rel="noreferrer" target="_blank">DOI ↗</a>}
                    {publication.externalUrl && <a className="text-link" href={publication.externalUrl} rel="noreferrer" target="_blank">Open source ↗</a>}
                    {publication.pdf && <a className="text-link" href={publication.pdf} target="_blank">PDF ↗</a>}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {project.limitations.length > 0 && (
          <section className="essay-section case-limitations">
            <h2>Limits and scope</h2>
            <ul className="research-list">{project.limitations.map(limitation => <li key={limitation}>{limitation}</li>)}</ul>
          </section>
        )}

        {project.links.length > 0 && <div className="contact-links">{project.links.map(link => <a className="text-link" href={link.href} key={link.href} rel="noreferrer" target="_blank">{link.label} ↗</a>)}</div>}
        <div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>

      <nav className="next-project" aria-label="Adjacent projects">
        {previous && <Link href={`/projects/${previous.slug}`}><small>← Previous project</small>{previous.title}</Link>}
        {next && <Link href={`/projects/${next.slug}`}><small>Next project →</small>{next.title}</Link>}
      </nav>
      <WorkIndex />
    </main>
  );
}
