'use client';

import { useState, type ReactNode } from 'react';
import type { Cv } from '@/lib/content';

type AccordionSectionProps = {
  id: string;
  title: string;
  count?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function AccordionSection({ id, title, count, isOpen, onToggle, children }: AccordionSectionProps) {
  const headingId = `cv-${id}-heading`;
  const panelId = `cv-${id}-panel`;

  return <section className={`cv-accordion${isOpen ? ' is-open' : ''}`}>
    <h3 id={headingId}>
      <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}>
        <span>{title}</span>
        <span className="cv-accordion-meta">
          {count && <span>{count}</span>}
          <span className="cv-accordion-indicator" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </span>
      </button>
    </h3>
    <div className="cv-accordion-panel" id={panelId} role="region" aria-labelledby={headingId} hidden={!isOpen}>
      <div className="cv-accordion-inner">{children}</div>
    </div>
  </section>;
}

function ExperienceEntry({ entry, education }: { entry: Cv['researchExperience'][number]; education?: Cv['education'][number] }) {
  return <article className="cv-entry">
    <div className="cv-entry-heading">
      <div>
        <h4>{education?.degree ?? entry.role}</h4>
        <p>{education ? `${entry.role} · ` : ''}{entry.institution} · {entry.location}</p>
        {education && <p>Research focus: {education.focus}</p>}
      </div>
      <time>{entry.dates}</time>
    </div>
    {entry.description && <p className="cv-description">{entry.description}</p>}
    {entry.highlights && <ul>{entry.highlights.map(item => <li key={item}>{item}</li>)}</ul>}
  </article>;
}

export function CvAccordion({ cv }: { cv: Cv }) {
  const [openSections, setOpenSections] = useState(() => new Set<string>(['research']));
  const matchedEducation = new Set(cv.researchExperience.map(entry => entry.institution));
  const unmatchedEducation = cv.education.filter(entry => !matchedEducation.has(entry.institution));
  const educationAndResearchCount = cv.researchExperience.length + unmatchedEducation.length;

  const toggleSection = (id: string) => {
    setOpenSections(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sectionProps = (id: string) => ({
    isOpen: openSections.has(id),
    onToggle: () => toggleSection(id),
  });

  return <div className="cv-accordions">
    {educationAndResearchCount > 0 && <AccordionSection id="research" title="Education and Research" count={`${educationAndResearchCount} ${educationAndResearchCount === 1 ? 'record' : 'records'}`} {...sectionProps('research')}>
      {cv.researchExperience.map(entry => <ExperienceEntry entry={entry} education={cv.education.find(education => education.institution === entry.institution)} key={`${entry.role}-${entry.institution}`} />)}
      {unmatchedEducation.map(entry => <article className="cv-compact-entry" key={entry.degree}>
        <div><h4>{entry.degree}</h4><p>{entry.institution}</p><p>Research focus: {entry.focus}</p></div>
        <time>{entry.dates}</time>
      </article>)}
    </AccordionSection>}

    {cv.industryExperience.length > 0 && <AccordionSection id="industry" title="Industry Experience" count={`${cv.industryExperience.length} ${cv.industryExperience.length === 1 ? 'position' : 'positions'}`} {...sectionProps('industry')}>
      {cv.industryExperience.map(entry => <ExperienceEntry entry={entry} key={`${entry.role}-${entry.institution}`} />)}
    </AccordionSection>}

    {cv.skills.length > 0 && <AccordionSection id="skills" title="Skills" {...sectionProps('skills')}>
      <div className="cv-skills">{cv.skills.map(group => <article key={group.category}><h4>{group.category}</h4><p>{group.items.join(' · ')}</p></article>)}</div>
    </AccordionSection>}

    {cv.teaching.length > 0 && <AccordionSection id="teaching" title="Teaching & Mentoring" {...sectionProps('teaching')}>
      <div className="cv-list">{cv.teaching.map(entry => <article key={`${entry.role}-${entry.dates}`}><h4>{entry.role}</h4><time>{entry.dates}</time></article>)}</div>
    </AccordionSection>}

    {cv.recognition.length > 0 && <AccordionSection id="recognition" title="Awards & Recognition" {...sectionProps('recognition')}>
      <div className="cv-list">{cv.recognition.map(entry => <article key={`${entry.name}-${entry.dates}`}><div><h4>{entry.name}</h4><p>{entry.institution}</p></div><time>{entry.dates}</time></article>)}</div>
    </AccordionSection>}

    {cv.academicService.length > 0 && <AccordionSection id="service" title="Academic Service" {...sectionProps('service')}>
      <div className="cv-list">{cv.academicService.map(entry => <article key={`${entry.role}-${entry.dates}`}><h4>{entry.role}</h4><time>{entry.dates}</time></article>)}</div>
    </AccordionSection>}
  </div>;
}
