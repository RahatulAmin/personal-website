import Image from 'next/image';

export function ResearchImage({ src, alt, caption, width = 1600, height = 1000 }: {
  src: string; alt: string; caption?: string; width?: number; height?: number;
}) {
  return <figure><Image className="narrative-image" src={src} alt={alt} width={width} height={height} sizes="(max-width: 700px) 100vw, 1160px" />{caption && <figcaption className="caption">{caption}</figcaption>}</figure>;
}
