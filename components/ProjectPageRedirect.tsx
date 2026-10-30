'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export function ProjectPageRedirect({ slug, title }: { slug: string; title: string }) {
  const destination = `/#project-${slug}`;

  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return <main id="main" className="page wrap project-route-redirect">
    <p className="eyebrow">Opening project</p>
    <h1>{title}</h1>
    <Link className="text-link" href={destination}>View this project on the homepage ↓</Link>
  </main>;
}
