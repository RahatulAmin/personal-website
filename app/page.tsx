import { AboutMedia } from '@/components/AboutMedia';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { CvAccordion } from '@/components/CvAccordion';
import { ProjectGallery } from '@/components/ProjectGallery';
import { PublicationsAccordion } from '@/components/PublicationsAccordion';
import { about, cv, publications, publicProjects, site, socialProfiles } from '@/lib/content';

export default function Home() {
  const currentPosition = cv.researchExperience[0];

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
        <ProjectGallery projects={publicProjects} publications={publications} />
      </section>

      <section className="page wrap publications-page home-section" id="publications" aria-labelledby="publications-heading">
        <header className="publications-header editorial-page-header">
          <p className="eyebrow">Research outputs</p>
          <h2 id="publications-heading">Publications</h2>
          <p>{cv.outputs.introduction}</p>
        </header>
        <PublicationsAccordion publications={publications} projectNames={Object.fromEntries(publicProjects.map(project => [project.slug, project.internalName]))} />
      </section>

      <section className="page wrap cv-page home-section" id="cv" aria-labelledby="cv-heading">
        <header className="cv-header editorial-page-header">
          <p className="eyebrow">{cv.eyebrow}</p>
          <h2 id="cv-heading">{cv.heading}</h2>
          <p>{cv.introduction}</p>
          {currentPosition && <div className="cv-current-position">
            <span>Current position</span>
            <div><h3>{currentPosition.role}</h3><p>{currentPosition.institution}</p></div>
          </div>}
          {site.cv && <div className="cv-actions">
            <a className="cv-download" href={site.cv.url} download={site.cv.filename}>Download Academic CV <span aria-hidden="true">↓</span></a>
            <div><span>Full academic CV · PDF</span>{site.cv.lastUpdated && <span>Updated {site.cv.lastUpdated}</span>}<a href={site.cv.url} target="_blank" rel="noreferrer">View CV in browser ↗</a></div>
          </div>}
        </header>
        <CvAccordion cv={cv} />
      </section>

      <section className="page wrap about-page home-section journey-section" id="about" aria-labelledby="about-heading">
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
      </section>
    </main>
  );
}
