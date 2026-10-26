import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutMedia } from '@/components/AboutMedia';
import { about } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: about.introduction[0],
};

export default function About() {
  return <main id="main" className="page wrap about-page">
    <header className="about-opening">
      <div className="about-introduction editorial-page-header">
        <p className="eyebrow">{about.eyebrow}</p>
        <h1>{about.heading}</h1>
        {about.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <AboutMedia image={about.portrait} className="about-portrait" />
    </header>

    <section className="about-story">
      <h2>{about.journey.heading}</h2>
      <div>{about.journey.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>

    <section className="about-practice">
      <div className="about-section-copy">
        <h2>{about.practice.heading}</h2>
        <p>{about.practice.introduction}</p>
        <ul>{about.practice.activities.map(activity => <li key={activity}>{activity}</li>)}</ul>
      </div>
      <div className="about-research-images">
        {about.practice.images.map((image, index) => <AboutMedia image={image} className={`about-research-image-${index + 1}`} key={image.label} />)}
      </div>
    </section>

    <section className="about-collaboration">
      <h2>{about.collaboration.heading}</h2>
      <p>{about.collaboration.paragraph}</p>
    </section>

    <section className="about-beyond">
      <div className="about-section-copy"><h2>{about.beyond.heading}</h2><p>{about.beyond.paragraph}</p></div>
      <div className="about-personal-gallery">
        {about.beyond.images.map((image, index) => <AboutMedia image={image} className={`about-personal-image-${index + 1}`} key={image.label} />)}
      </div>
    </section>

    <section className="about-experience">
      <div><p className="eyebrow">Background</p><h2>{about.timeline.heading}</h2></div>
      <div>
        {about.timeline.entries.map(entry => <article key={entry.institution}><h3>{entry.institution}</h3><p>{entry.degree}</p></article>)}
        <Link className="text-link" href="/cv">View full CV ↗</Link>
      </div>
    </section>
  </main>;
}
