import Link from 'next/link';
import { site, socialProfiles, publicProjects, number } from '@/lib/content';
import { MainNavigation } from '@/components/MainNavigation';

export function Header() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <div className="sidebar-intro">
        <Link className="wordmark" href="/#intro">{site.name}</Link>
        <p className="sidebar-position">{site.sidebar.position}</p>
        <p className="sidebar-role">{site.sidebar.role}<br />{site.sidebar.lab}</p>
      </div>
      <MainNavigation />
      {socialProfiles.length > 0 && <nav className="social-navigation" aria-label="Professional profiles">
        {socialProfiles.map(profile => <a key={profile.url} href={profile.url} target="_blank" rel="noreferrer">
          <span>{profile.label}</span><span aria-hidden="true">↗</span>
        </a>)}
      </nav>}
      <div className="sidebar-meta"><p>McGill University<br />Montréal, Canada</p><p>© {new Date().getFullYear()}</p></div>
    </header>
  </>;
}

export function WorkIndex() {
  return <details className="work-index"><summary>All projects <span aria-hidden="true">+</span></summary><nav aria-label="Portfolio projects">{publicProjects.map((project, index) => <Link key={project.id} href={`/#project-${project.slug}`}><span>{number(index + 1)}</span>{project.title}</Link>)}</nav></details>;
}

export function Footer() {
  return <footer className="footer wrap"><div className="footer-bottom"><span>{site.affiliation}</span><div><a href={`mailto:${site.email}`}>Email</a>{socialProfiles.map(profile => <a key={profile.url} href={profile.url} target="_blank" rel="noreferrer">{profile.label}</a>)}<Link href="/#cv">CV</Link><a href="#top">Back to top ↑</a></div></div></footer>;
}
