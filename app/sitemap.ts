import { publicProjects,site } from '@/lib/content';
import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function sitemap():MetadataRoute.Sitemap {if(!site.url)return [];return ['',...publicProjects.map(p=>`/projects/${p.slug}`)].map(path=>({url:`${site.url}${path}`}));}
