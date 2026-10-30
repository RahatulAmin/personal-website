'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import type { Publication } from '@/lib/content';
import { publicationStatusMeta } from '@/lib/publications';

const groupDefinitions = [
  { id: 'published', label: 'Published & Peer-Reviewed', matches: (record: Publication) => record.type !== 'thesis' && record.status === 'published' },
  { id: 'in-press', label: 'In Press', matches: (record: Publication) => record.type !== 'thesis' && record.status === 'in_press' },
  { id: 'under-review', label: 'Under Review', matches: (record: Publication) => record.type !== 'thesis' && record.status === 'under_review' },
  { id: 'in-preparation', label: 'In Preparation', matches: (record: Publication) => record.type !== 'thesis' && record.status === 'in_preparation' },
  { id: 'theses', label: 'Theses', matches: (record: Publication) => record.type === 'thesis' },
] as const;

function Authors({ publication }: { publication: Publication }) {
  return <p className="publication-authors">{publication.authors.map((author, index) => {
    const separator = index === 0 ? '' : index === publication.authors.length - 1 ? publication.authors.length === 2 ? ' and ' : ', and ' : ', ';
    return <Fragment key={`${publication.id}-${author.name}`}>{separator}<span>{author.isMe ? <strong>{author.name}</strong> : author.name}{author.equalContribution && <sup>*</sup>}</span></Fragment>;
  })}</p>;
}

function PublicationEntry({ publication, projectName, showStatus }: { publication: Publication; projectName?: string; showStatus: boolean }) {
  const status = publicationStatusMeta[publication.status];
  const hasLinks = publication.doi || publication.pdf || publication.externalUrl || (publication.projectSlug && projectName);

  return <article className="publication-entry" id={publication.id}>
    <div className="publication-meta"><span>{publication.year}</span>{showStatus && <span>{status.label}</span>}</div>
    <h4>{publication.title}</h4>
    <Authors publication={publication} />
    <p className="publication-venue">{[publication.typeLabel, publication.venue, publication.statusNote].filter(Boolean).join(' · ')}</p>
    {publication.equalContributionNote && <p className="contribution-note"><sup>*</sup> {publication.equalContributionNote}</p>}
    {hasLinks && <div className="publication-links">
      {publication.doi && <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">DOI ↗</a>}
      {publication.pdf && <a href={publication.pdf} target="_blank" rel="noreferrer">PDF ↗</a>}
      {publication.externalUrl && <a href={publication.externalUrl} target="_blank" rel="noreferrer">Source ↗</a>}
      {publication.projectSlug && projectName && <Link href={`/#project-${publication.projectSlug}`}>Related project: {projectName} ↓</Link>}
    </div>}
  </article>;
}

export function PublicationsAccordion({ publications, projectNames }: { publications: Publication[]; projectNames: Record<string, string> }) {
  const [openGroups, setOpenGroups] = useState(() => new Set<string>(['published']));
  const groups = groupDefinitions.map(definition => ({
    ...definition,
    records: publications
      .map((record, sourceIndex) => ({ record, sourceIndex }))
      .filter(({ record }) => definition.matches(record))
      .sort((a, b) => b.record.year - a.record.year || a.sourceIndex - b.sourceIndex)
      .map(({ record }) => record),
  })).filter(group => group.records.length > 0);

  const toggleGroup = (id: string) => {
    setOpenGroups(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return <div className="publication-accordions">
    {groups.map(group => {
      const isOpen = openGroups.has(group.id);
      const headingId = `publication-${group.id}-heading`;
      const panelId = `publication-${group.id}-panel`;
      return <section className={`publication-accordion${isOpen ? ' is-open' : ''}`} key={group.id}>
        <h3 id={headingId}>
          <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggleGroup(group.id)}>
            <span>{group.label}</span>
            <span className="publication-accordion-meta"><span>{group.records.length} {group.records.length === 1 ? 'record' : 'records'}</span><span className="publication-accordion-indicator" aria-hidden="true">{isOpen ? '−' : '+'}</span></span>
          </button>
        </h3>
        <div className="publication-accordion-panel" id={panelId} role="region" aria-labelledby={headingId} hidden={!isOpen}>
          <div className="publication-accordion-inner">
            {group.records.map(publication => <PublicationEntry publication={publication} projectName={publication.projectSlug ? projectNames[publication.projectSlug] : undefined} showStatus={group.id !== 'published'} key={publication.id} />)}
          </div>
        </div>
      </section>;
    })}
  </div>;
}
