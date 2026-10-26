import Image from 'next/image';
import type { Project } from '@/lib/content';

export function ProjectVisual({ project, hero = false }: { project: Project; hero?: boolean }) {
  const media = hero ? project.heroImage ?? project.thumbnail : project.thumbnail;
  return (
    <div className={`project-visual ${media ? 'has-media' : 'media-placeholder'}`}>
      {media ? (
        <Image src={media.src} alt={media.alt} fill
          sizes={hero ? '(max-width: 820px) 100vw, 75vw' : '(max-width: 700px) 100vw, 38vw'}
          style={{ objectFit: media.fit, objectPosition: media.position }} priority={hero} />
      ) : (
        <div className="placeholder-label"><span className="missing-image-mark" aria-hidden="true">×</span><span>Project image pending</span><span className="visually-hidden">Needed: {project.mediaNeeded}</span></div>
      )}
    </div>
  );
}
