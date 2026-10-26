import { Fragment } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { publications, publicProjects, type Publication } from '@/lib/content';
import { publicationStatusMeta } from '@/lib/publications';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Peer-reviewed publications, manuscripts, and research contributions.',
};

const sections = [
  {
    id: 'conference',
    title: 'Conference',
    records: publications.filter(publication => publication.type === 'conference'),
  },
  {
    id: 'workshop',
    title: 'Workshop',
    records: publications.filter(publication => publication.type === 'workshop'),
  },
  {
    id: 'under-review',
    title: 'Under Review',
    records: publications.filter(publication => ['under_review', 'in_preparation'].includes(publication.status)),
  },
  {
    id: 'thesis',
    title: 'Thesis',
    records: publications.filter(publication => publication.type === 'thesis'),
  },
].map(section => ({ ...section, records: [...section.records].sort((a, b) => b.year - a.year) }));

function Authors({ publication }: { publication: Publication }) {
  return <p className="publication-authors">{publication.authors.map((author, index) => {
    const separator = index === 0 ? '' : index === publication.authors.length - 1 ? publication.authors.length === 2 ? ' and ' : ', and ' : ', ';
    return <Fragment key={`${publication.id}-${author.name}`}>{separator}<span>{author.isMe ? <strong>{author.name}</strong> : author.name}{author.equalContribution && <sup>*</sup>}</span></Fragment>;
  })}</p>;
}

function PublicationEntry({ publication }: { publication: Publication }) {
  const status = publicationStatusMeta[publication.status];
  const project = publication.projectSlug ? publicProjects.find(project => project.slug === publication.projectSlug) : null;
  const hasLinks = publication.doi || publication.pdf || publication.externalUrl || project;
  return <article className="publication-entry" id={publication.id}>
    <div className="publication-meta"><span>{publication.year}</span><span className={`publication-status status-${status.tone}`}>{status.label}</span></div>
    <h2>{publication.title}</h2>
    <Authors publication={publication} />
    {(publication.typeLabel || publication.venue || publication.statusNote) && <p className="publication-venue">{[publication.typeLabel, publication.venue, publication.statusNote].filter(Boolean).join(' · ')}</p>}
    {publication.equalContributionNote && <p className="contribution-note"><sup>*</sup> {publication.equalContributionNote}</p>}
    {hasLinks && <div className="publication-links">
      {publication.doi && <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">DOI ↗</a>}
      {publication.pdf && <a href={publication.pdf} target="_blank" rel="noreferrer">PDF ↗</a>}
      {publication.externalUrl && <a href={publication.externalUrl} target="_blank" rel="noreferrer">External link ↗</a>}
      {project && <Link href={`/projects/${project.slug}`}>Related project: {project.internalName} ↗</Link>}
    </div>}
  </article>;
}

export default function Publications() {
  return <main id="main" className="page wrap publications-page">
    <header className="page-header publications-header editorial-page-header">
      <p className="eyebrow">Research outputs</p>
      <h1 className="page-title">Publications</h1>
      <p className="page-intro">Peer-reviewed publications, manuscripts, and research contributions.</p>
    </header>
    {sections.map(section => <section className="publication-section" id={section.id} key={section.id}>
      <h2 className="publication-section-title">{section.title}</h2>
      <div>{section.records.map(publication => <PublicationEntry publication={publication} key={publication.id} />)}</div>
    </section>)}
  </main>;
}
