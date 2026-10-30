'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { flushSync } from 'react-dom';
import { ProjectVisual } from '@/components/ProjectVisual';
import type { Project, Publication } from '@/lib/content';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const collagePlacementOrder = [
  'hallway-interactions',
  'telepresence-collaboration',
  'roboethics',
  'robot-service',
  'social-robots-loneliness',
];

function ProjectDetails({ project, outputs }: { project: Project; outputs: Publication[] }) {
  const resources = [
    ...outputs.map(publication => publication.doi
      ? { label: 'DOI', href: `https://doi.org/${publication.doi}`, external: true }
      : publication.externalUrl
        ? { label: publication.type === 'thesis' ? 'Thesis' : 'Source', href: publication.externalUrl, external: true }
        : publication.pdf
          ? { label: 'Paper', href: publication.pdf, external: true }
          : { label: 'Publication', href: `/#${publication.id}`, external: false }),
    ...project.links.map(link => ({
      label: link.label.toLowerCase().includes('repository') ? 'Code' : link.label,
      href: link.href,
      external: true,
    })),
  ].filter((resource, index, all) => all.findIndex(item => item.href === resource.href) === index).slice(0, 3);

  return (
    <div className="inline-project-details" id={`project-details-${project.slug}`}>
      <div className="inline-project-layout">
        <div className="inline-project-intro">
          <p className="eyebrow">{project.category} <span aria-hidden="true">·</span> {project.year}</p>
          <h4>{project.inline.question}</h4>
          {project.inline.metrics.length > 0 && <dl className="inline-project-metrics">
            {project.inline.metrics.map(metric => <div key={`${metric.value}-${metric.label}`}><dt>{metric.value}</dt><dd>{metric.label}</dd></div>)}
          </dl>}
          {project.institution && <p className="inline-project-institution">{project.institution}</p>}
        </div>

        <div className="inline-project-groups">
          {project.inline.groups.map(group => <section key={group.heading}>
            <h4>{group.heading}</h4>
            <p>{group.body}</p>
          </section>)}
        </div>
      </div>

      <footer className="inline-project-footer">
        <span>{project.status}</span>
        {resources.length > 0 && <nav aria-label={`${project.title} resources`}>
          {resources.map(resource => resource.external
            ? <a href={resource.href} key={resource.href} rel="noreferrer" target="_blank">{resource.label} ↗</a>
            : <Link href={resource.href} key={resource.href}>{resource.label} ↗</Link>)}
        </nav>}
      </footer>
    </div>
  );
}

export function ProjectGallery({ projects, publications }: { projects: Project[]; publications: Publication[] }) {
  const cutoff = 6;
  const galleryRef = useRef<HTMLDivElement>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const openFromHash = () => {
      const slug = window.location.hash.replace(/^#project-/, '');
      if (!projects.some(project => project.slug === slug)) return;
      setExpandedSlug(slug);
      if (projects.findIndex(project => project.slug === slug) >= cutoff) setShowAll(true);
      window.requestAnimationFrame(() => document.getElementById(`project-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [cutoff, projects]);

  const updateWithTransition = (update: () => void) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDocument = document as ViewTransitionDocument;
    if (!reducedMotion && transitionDocument.startViewTransition) {
      return transitionDocument.startViewTransition(() => flushSync(update)).finished.catch(() => undefined);
    }
    update();
    return Promise.resolve();
  };

  const toggleProject = (slug: string) => {
    const isClosing = expandedSlug === slug;
    updateWithTransition(() => setExpandedSlug(current => current === slug ? null : slug));
    if (isClosing && window.location.hash === `#project-${slug}`) window.history.replaceState(null, '', '/#work');
  };

  const visibleProjects = showAll ? projects : projects.slice(0, cutoff);

  const toggleAllProjects = () => {
    updateWithTransition(() => {
      if (expandedSlug && projects.findIndex(project => project.slug === expandedSlug) >= cutoff) setExpandedSlug(null);
      setShowAll(current => !current);
    });
  };

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const rowHeight = 8;
    const itemGap = 42;
    const layout = () => {
      const items = [...gallery.querySelectorAll<HTMLElement>('[data-masonry-item]')];

      items.forEach(item => {
        const isFullWidth = item.dataset.fullWidth === 'true' || item.classList.contains('is-expanded');
        item.style.gridColumn = isFullWidth ? '1 / -1' : String((Number(item.dataset.projectIndex) % 2) + 1);
        item.style.gridRow = 'auto';
      });

      const placementItems = [...items].sort((a, b) => {
        if (a.dataset.fullWidth === 'true') return 1;
        if (b.dataset.fullWidth === 'true') return -1;
        const aPriority = collagePlacementOrder.indexOf(a.dataset.projectSlug ?? '');
        const bPriority = collagePlacementOrder.indexOf(b.dataset.projectSlug ?? '');
        const aRank = aPriority === -1 ? collagePlacementOrder.length + Number(a.dataset.projectIndex) : aPriority;
        const bRank = bPriority === -1 ? collagePlacementOrder.length + Number(b.dataset.projectIndex) : bPriority;
        return aRank - bRank;
      });

      const nextRow = [1, 1];
      placementItems.forEach((item, itemIndex) => {
        const isFullWidth = item.dataset.fullWidth === 'true' || item.classList.contains('is-expanded');
        const gapAfterItem = itemIndex === placementItems.length - 1 ? 0 : itemGap;
        const span = Math.max(1, Math.ceil((item.offsetHeight + gapAfterItem) / rowHeight));

        if (isFullWidth) {
          const start = Math.max(...nextRow);
          item.style.gridColumn = '1 / -1';
          item.style.gridRow = `${start} / span ${span}`;
          nextRow[0] = start + span;
          nextRow[1] = start + span;
        } else {
          const column = nextRow[0] <= nextRow[1] ? 0 : 1;
          const start = nextRow[column];
          item.style.gridColumn = String(column + 1);
          item.style.gridRow = `${start} / span ${span}`;
          nextRow[column] = start + span;
        }
      });
    };

    const observer = new ResizeObserver(layout);
    gallery.querySelectorAll<HTMLElement>('[data-masonry-item]').forEach(item => observer.observe(item));
    layout();
    return () => {
      observer.disconnect();
    };
  }, [expandedSlug, showAll]);

  return <div className="project-gallery" ref={galleryRef}>
    {visibleProjects.map((project, index) => {
      const isExpanded = expandedSlug === project.slug;
      const outputs = publications.filter(publication => publication.projectSlug === project.slug);
      return <Fragment key={project.id}>
        <article className={`project${isExpanded ? ' is-expanded' : ''}${showAll && index >= cutoff ? ' is-revealed-project' : ''}`} id={`project-${project.slug}`} data-masonry-item data-project-index={index} data-project-slug={project.slug} style={{
          '--ratio': project.composition.ratio,
          '--mobile-ratio': project.composition.mobileRatio,
          '--project-transition-name': `project-${project.slug}`,
          '--reveal-delay': `${Math.floor(Math.max(0, index - cutoff) / 2) * 180}ms`,
        } as CSSProperties}>
          <button className="project-card" type="button" aria-expanded={isExpanded} aria-controls={`project-details-${project.slug}`} onClick={() => toggleProject(project.slug)}>
            <div className="project-image-wrap"><ProjectVisual project={project} eager={index < 2} /><span className="project-open" aria-hidden="true">{isExpanded ? 'Close project ↑' : 'View project ↓'}</span></div>
            <div className="project-caption">
              <h3>{project.title}</h3>
              <p>{project.category} <span aria-hidden="true">·</span> {project.period} <span aria-hidden="true">·</span> {project.year}</p>
              {isExpanded && <div className="project-expanded-intro"><p>{project.summary}</p></div>}
            </div>
          </button>
          {isExpanded && <>
            <ProjectDetails project={project} outputs={outputs} />
            <button className="project-collapse" type="button" onClick={() => toggleProject(project.slug)}>
              <span className="project-collapse-arrow" aria-hidden="true">↑</span>
              <span>Close project</span>
            </button>
          </>}
        </article>
      </Fragment>;
    })}

    {cutoff < projects.length && <button className={`reveal-projects${showAll ? ' is-open' : ''}`} data-masonry-item data-full-width="true" type="button" aria-expanded={showAll} onClick={toggleAllProjects}>
      <span>{showAll ? 'Show fewer projects' : 'Explore the rest of my projects'}</span>
      <span className="reveal-projects-arrow" aria-hidden="true">{showAll ? '↑' : '↓'}</span>
    </button>}
  </div>;
}
