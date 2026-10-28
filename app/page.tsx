import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import { AboutMedia } from '@/components/AboutMedia';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { ProjectVisual } from '@/components/ProjectVisual';
import { about, cv, publications, publicProjects, site, socialProfiles, type Publication } from '@/lib/content';
import { publicationStatusMeta } from '@/lib/publications';

const publicationSections = [
  { title: 'Conference', records: publications.filter(publication => publication.type === 'conference') },
  { title: 'Workshop', records: publications.filter(publication => publication.type === 'workshop') },
  { title: 'Under Review', records: publications.filter(publication => ['under_review', 'in_preparation'].includes(publication.status)) },
  { title: 'Thesis', records: publications.filter(publication => publication.type === 'thesis') },
].map(section => ({ ...section, records: [...section.records].sort((a, b) => b.year - a.year) }));

function Authors({ publication }: { publication: Publication }) {
  return <p className="publication-authors">{publication.authors.map((author, index) => {
    const separator = index === 0 ? '' : index === publication.authors.length - 1 ? publication.authors.length === 2 ? ' and ' : ', and ' : ', ';
    return <Fragment key={`${publication.id}-${author.name}`}>{separator}<span>{author.isMe ? <strong>{author.name}</strong> : author.name}{author.equalContribution && <sup>*</sup>}</span></Fragment>;
  })}</p>;
}

function PublicationEntry({ publication }: { publication: Publication }) {
  const status = publicationStatusMeta[publication.status];
  const project = publication.projectSlug ? publicProjects.find(item => item.slug === publication.projectSlug) : null;
  const hasLinks = publication.doi || publication.pdf || publication.externalUrl || project;
  return <article className="publication-entry" id={publication.id}>
    <div className="publication-meta"><span>{publication.year}</span><span className={`publication-status status-${status.tone}`}>{status.label}</span></div>
    <h3>{publication.title}</h3>
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

function ExperienceEntry({ entry }: { entry: (typeof cv.researchExperience)[number] }) {
  return <article className="cv-entry">
    <div className="cv-entry-heading"><div><h3>{entry.role}</h3><p>{entry.institution} · {entry.location}</p></div><time>{entry.dates}</time></div>
    {entry.description && <p className="cv-description">{entry.description}</p>}
    {entry.highlights && <ul>{entry.highlights.map(item => <li key={item}>{item}</li>)}</ul>}
  </article>;
}

export default function Home() {
  return (
    <main id="main" className="home single-page">
      <section className="page wrap about-page home-section intro-section" id="intro" aria-labelledby="intro-heading">
        <header className="about-opening">
          <div className="about-introduction editorial-page-header">
            <h1 id="intro-heading">{about.heading}</h1>
            {about.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <AboutMedia image={about.portrait} className="about-portrait" />
        </header>
      </section>

      <section className="work wrap home-section" id="work" aria-labelledby="work-heading">
        <header className="section-heading">
          <p className="eyebrow">Selected research</p>
          <h2 id="work-heading">My work</h2>
        </header>
        <div className="project-gallery">
          {publicProjects.map((project, index) => (
            <article className="project" key={project.id} style={{
              '--ratio': project.composition.ratio,
              '--mobile-ratio': project.composition.mobileRatio,
            } as CSSProperties}>
              <Link className="project-link" href={`/projects/${project.slug}`}>
                <div className="project-image-wrap"><ProjectVisual project={project} eager={index < 2} /><span className="project-open" aria-hidden="true">View project ↗</span></div>
                <div className="project-caption"><h3>{project.title}</h3><p>{project.category} <span aria-hidden="true">·</span> {project.period} <span aria-hidden="true">·</span> {project.year}</p></div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="page wrap publications-page home-section" id="publications" aria-labelledby="publications-heading">
        <header className="publications-header editorial-page-header">
          <p className="eyebrow">Research outputs</p>
          <h2 id="publications-heading">Publications</h2>
          <p>{cv.outputs.introduction}</p>
        </header>
        <div className="embedded-publications">
          {publicationSections.map(section => <div className="publication-section" key={section.title}>
            <h3 className="publication-section-title">{section.title}</h3>
            <div>{section.records.map(publication => <PublicationEntry publication={publication} key={publication.id} />)}</div>
          </div>)}
        </div>
      </section>

      <section className="page wrap cv-page home-section" id="cv" aria-labelledby="cv-heading">
        <header className="cv-header editorial-page-header">
          <p className="eyebrow">{cv.eyebrow}</p>
          <h2 id="cv-heading">{cv.heading}</h2>
          <p>{cv.introduction}</p>
          {site.cv && <div className="cv-actions">
            <a className="cv-download" href={site.cv.url} download={site.cv.filename}>Download CV <span aria-hidden="true">↓</span></a>
            <div><span>Full academic CV · PDF</span>{site.cv.lastUpdated && <span>Updated {site.cv.lastUpdated}</span>}<a href={site.cv.url} target="_blank" rel="noreferrer">View CV in browser ↗</a></div>
          </div>}
        </header>

        <div className="cv-section"><h2>Research Experience</h2><div>{cv.researchExperience.map(entry => <ExperienceEntry entry={entry} key={`${entry.role}-${entry.institution}`} />)}</div></div>
        <div className="cv-section"><h2>Industry Experience</h2><div>{cv.industryExperience.map(entry => <ExperienceEntry entry={entry} key={`${entry.role}-${entry.institution}`} />)}</div></div>
        <div className="cv-section"><h2>Education</h2><div>{cv.education.map(entry => <article className="cv-compact-entry" key={entry.degree}><div><h3>{entry.degree}</h3><p>{entry.institution}</p><p>Research focus: {entry.focus}</p></div><time>{entry.dates}</time></article>)}</div></div>
        <div className="cv-section"><h2>Research Expertise &amp; Technical Skills</h2><div className="cv-skills">{cv.skills.map(group => <article key={group.category}><h3>{group.category}</h3><p>{group.items.join(' · ')}</p></article>)}</div></div>
        <div className="cv-section"><h2>Teaching, Mentoring &amp; Service</h2><div className="cv-list">{cv.service.map(entry => <article key={`${entry.role}-${entry.dates}`}><h3>{entry.role}</h3><time>{entry.dates}</time></article>)}</div></div>
        <div className="cv-section"><h2>Selected Recognition</h2><div className="cv-list">{cv.recognition.map(entry => <article key={`${entry.name}-${entry.dates}`}><div><h3>{entry.name}</h3><p>{entry.institution}</p></div><time>{entry.dates}</time></article>)}</div></div>
      </section>

      <section className="page wrap about-page home-section journey-section" id="about" aria-labelledby="about-heading">
        <div className="about-collaboration about-collaboration-lead">
          <h2>{about.collaboration.heading}</h2>
          <p>{about.collaboration.paragraph}</p>
        </div>

        <header className="journey-header editorial-page-header">
          <p className="eyebrow">About</p>
          <h2 id="about-heading">{about.journey.heading}</h2>
        </header>
        <div className="about-story">
          <h2>Background</h2>
          <ol className="journey-timeline">
            {about.journey.paragraphs.map(paragraph => <li key={paragraph}><p>{paragraph}</p></li>)}
          </ol>
        </div>

        <div className="about-personal">
          <div className="about-section-copy"><h2>{about.personal.heading}</h2><p>{about.personal.paragraph}</p></div>
          <div className="about-personal-group">
            <p className="eyebrow">Family</p>
            <div className="about-family-gallery">
              {about.personal.familyImages.map(image => <AboutMedia image={image} key={image.src ?? image.label} />)}
            </div>
          </div>
          <div className="about-personal-group">
            <p className="eyebrow">Through my lens</p>
            <div className="about-photography-gallery">
              {about.personal.photographyImages.map(image => <AboutMedia image={image} key={image.src ?? image.label} />)}
            </div>
          </div>
        </div>

      </section>

      <section className="page wrap contact-page home-section" id="contact" aria-labelledby="contact-heading">
        <header className="contact-header editorial-page-header">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-heading">Let&apos;s talk.</h2>
          <p>Whether it&apos;s about human–robot interaction, a potential research collaboration, or an interesting idea, I&apos;d be happy to connect.</p>
        </header>
        <div className="contact-group" aria-labelledby="contact-email-heading">
          <h2 id="contact-email-heading">Email</h2>
          <div className="contact-email-row"><a href={`mailto:${site.email}`}>{site.email}</a><CopyEmailButton email={site.email} /></div>
        </div>
        {socialProfiles.length > 0 && <div className="contact-group" aria-labelledby="contact-elsewhere-heading">
          <h2 id="contact-elsewhere-heading">Elsewhere</h2>
          <nav className="contact-profiles" aria-label="Professional profiles">{socialProfiles.map(profile => <a href={profile.url} key={profile.url} target="_blank" rel="noreferrer"><span>{profile.label}</span><span aria-hidden="true">↗</span></a>)}</nav>
        </div>}
        <div className="contact-location"><p>{site.location}</p><p>PhD Researcher · McGill University</p></div>
      </section>
    </main>
  );
}
