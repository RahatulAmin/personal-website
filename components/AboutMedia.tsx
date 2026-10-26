import Image from 'next/image';
import type { AboutImage } from '@/lib/content';

export function AboutMedia({ image, className = '' }: { image: AboutImage; className?: string }) {
  return <figure className={`about-media ${image.src ? 'has-media' : 'media-placeholder'} ${className}`.trim()}>
    {image.src ? <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 560px" /> : <div className="about-media-placeholder" role="img" aria-label={`${image.label}. ${image.alt}`}><span className="missing-image-mark" aria-hidden="true">×</span><span>{image.label}</span></div>}
    {!image.src && image.note && <figcaption>{image.note}</figcaption>}
  </figure>;
}
