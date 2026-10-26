'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Project } from '@/lib/content';

export function ProjectVisual({ project, hero = false, eager = false }: { project: Project; hero?: boolean; eager?: boolean }) {
  const media = hero ? project.heroImage ?? project.thumbnail : project.thumbnail;
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`project-visual ${media ? `has-media${loaded ? ' is-loaded' : ''}` : 'media-placeholder'}`}>
      {media ? (
        <Image src={media.src} alt={media.alt} fill
          sizes={hero ? '(max-width: 820px) 100vw, 75vw' : '(max-width: 700px) 100vw, 38vw'}
          style={{ objectFit: media.fit, objectPosition: media.position }}
          preload={hero || eager}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)} />
      ) : (
        <div className="placeholder-label"><span className="missing-image-mark" aria-hidden="true">×</span><span>Project image pending</span><span className="visually-hidden">Needed: {project.mediaNeeded}</span></div>
      )}
    </div>
  );
}
