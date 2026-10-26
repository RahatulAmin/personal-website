import type { Metadata } from 'next';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { site, socialProfiles } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact', description: 'Contact Rahatul Ananto about human–robot interaction research and collaboration.' };

export default function Contact() {
  return <main id="main" className="page wrap contact-page">
    <header className="contact-header editorial-page-header">
      <p className="eyebrow">Contact</p>
      <h1>Let&apos;s talk.</h1>
      <p>Whether it&apos;s about human–robot interaction, a potential research collaboration, or an interesting idea, I&apos;d be happy to connect.</p>
    </header>

    <section className="contact-group" aria-labelledby="contact-email-heading">
      <h2 id="contact-email-heading">Email</h2>
      <div className="contact-email-row"><a href={`mailto:${site.email}`}>{site.email}</a><CopyEmailButton email={site.email} /></div>
    </section>

    {socialProfiles.length > 0 && <section className="contact-group" aria-labelledby="contact-elsewhere-heading">
      <h2 id="contact-elsewhere-heading">Elsewhere</h2>
      <nav className="contact-profiles" aria-label="Professional profiles">{socialProfiles.map(profile => <a href={profile.url} key={profile.url} target="_blank" rel="noreferrer"><span>{profile.label}</span><span aria-hidden="true">↗</span></a>)}</nav>
    </section>}

    <div className="contact-location"><p>{site.location}</p><p>PhD Researcher · McGill University</p></div>
  </main>;
}
