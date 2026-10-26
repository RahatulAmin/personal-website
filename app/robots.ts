import { site } from '@/lib/content';
import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/'},...(site.url?{sitemap:`${site.url}/sitemap.xml`}:{})};}
