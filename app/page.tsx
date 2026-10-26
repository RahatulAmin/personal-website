import type { CSSProperties } from 'react';
import Link from 'next/link';
import { publicProjects } from '@/lib/content';
import { ProjectVisual } from '@/components/ProjectVisual';

export default function Home() {
  return (
    <main id="main" className="home">
      <section className="work wrap" id="work" aria-labelledby="work-heading">
        <h1 className="visually-hidden" id="work-heading">Selected research projects</h1>
        <div className="project-gallery">
          {publicProjects.map((project, index) => (
            <article className="project" key={project.id} style={{
              '--ratio': project.composition.ratio,
              '--mobile-ratio': project.composition.mobileRatio,
            } as CSSProperties}>
              <Link className="project-link" href={`/projects/${project.slug}`}>
                <div className="project-image-wrap"><ProjectVisual project={project} eager={index < 2} /><span className="project-open" aria-hidden="true">View project &#8599;</span></div>
                <div className="project-caption"><h3>{project.title}</h3><p>{project.category} <span aria-hidden="true">&middot;</span> {project.period} <span aria-hidden="true">&middot;</span> {project.year}</p></div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
