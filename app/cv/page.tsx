import Link from 'next/link';
import type { Metadata } from 'next';
import { cv, site } from '@/lib/content';

export const metadata: Metadata = { title: 'CV', description: cv.introduction };

function ExperienceEntry({ entry }: { entry: (typeof cv.researchExperience)[number] }) {
  return <article className="cv-entry">
    <div className="cv-entry-heading"><div><h3>{entry.role}</h3><p>{entry.institution} · {entry.location}</p></div><time>{entry.dates}</time></div>
    {entry.description && <p className="cv-description">{entry.description}</p>}
    {entry.highlights && <ul>{entry.highlights.map(item => <li key={item}>{item}</li>)}</ul>}
  </article>;
}

export default function CV() {
  return <main id="main" className="page wrap cv-page">
    <header className="cv-header editorial-page-header">
      <p className="eyebrow">{cv.eyebrow}</p>
      <h1>{cv.heading}</h1>
      <p>{cv.introduction}</p>
      {site.cv && <div className="cv-actions">
        <a className="cv-download" href={site.cv.url} download={site.cv.filename}>Download CV <span aria-hidden="true">↓</span></a>
        <div><span>Full academic CV · PDF</span>{site.cv.lastUpdated && <span>Updated {site.cv.lastUpdated}</span>}<a href={site.cv.url} target="_blank" rel="noreferrer">View CV in browser ↗</a></div>
      </div>}
    </header>

    <section className="cv-section"><h2>Research Experience</h2><div>{cv.researchExperience.map(entry => <ExperienceEntry entry={entry} key={`${entry.role}-${entry.institution}`} />)}</div></section>
    <section className="cv-section"><h2>Industry Experience</h2><div>{cv.industryExperience.map(entry => <ExperienceEntry entry={entry} key={`${entry.role}-${entry.institution}`} />)}</div></section>

    <section className="cv-section"><h2>Education</h2><div>{cv.education.map(entry => <article className="cv-compact-entry" key={entry.degree}><div><h3>{entry.degree}</h3><p>{entry.institution}</p><p>Research focus: {entry.focus}</p></div><time>{entry.dates}</time></article>)}</div></section>

    <section className="cv-section"><h2>Research Expertise & Technical Skills</h2><div className="cv-skills">{cv.skills.map(group => <article key={group.category}><h3>{group.category}</h3><p>{group.items.join(' · ')}</p></article>)}</div></section>

    <section className="cv-section"><h2>Teaching, Mentoring & Service</h2><div className="cv-list">{cv.service.map(entry => <article key={`${entry.role}-${entry.dates}`}><h3>{entry.role}</h3><time>{entry.dates}</time></article>)}</div></section>

    <section className="cv-section"><h2>Selected Recognition</h2><div className="cv-list">{cv.recognition.map(entry => <article key={`${entry.name}-${entry.dates}`}><div><h3>{entry.name}</h3><p>{entry.institution}</p></div><time>{entry.dates}</time></article>)}</div></section>

    <section className="cv-section cv-outputs"><h2>{cv.outputs.heading}</h2><div><p>{cv.outputs.introduction}</p><Link className="text-link" href="/publications">View all publications ↗</Link></div></section>
  </main>;
}
