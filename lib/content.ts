import { z } from 'zod';
import records from '@/content/projects.json';
import siteData from '@/content/site.json';
import profileData from '@/content/profile.json';
import aboutData from '@/content/about.json';
import cvData from '@/content/cv.json';
import publicationData from '@/content/publications.json';
import { publicationStatuses } from '@/lib/publications';

const media = z.object({ src: z.string().startsWith('/'), alt: z.string().min(1), caption: z.string().optional(), position: z.string().default('center'), fit: z.enum(['cover', 'contain']).default('cover') });
const composition = z.object({
  start: z.number().int().min(1).max(12), span: z.number().int().min(1).max(12),
  offset: z.number().min(0).max(200).default(0), ratio: z.number().min(0.6).max(3),
  mobileRatio: z.number().min(0.75).max(3).default(1.3),
}).refine(value => value.start + value.span <= 13, 'Gallery placement must fit the 12-column grid');
const projectMetric = z.object({ value: z.string().min(1), label: z.string().min(1) });
export const projectSchema = z.object({
  id: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), order: z.number().int().positive(),
  title: z.string().min(1), internalName: z.string(), category: z.string(), period: z.string(), year: z.string().min(4), published: z.boolean(), showOnHomepage: z.boolean(),
  layout: z.enum(['wide','regular','portrait']), visual: z.string(), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/), summary: z.string(),
  researchTitle: z.string().nullable().default(null),
  contentMode: z.enum(['field','experiment','framework','software','education','longitudinal','perspective','engineering','proposal']).default('field'),
  researchQuestion: z.string().min(1), motivation: z.string().min(1),
  methods: z.array(z.string().min(1)).default([]), metrics: z.array(projectMetric).default([]),
  findings: z.array(z.string().min(1)).default([]), contributions: z.array(z.string().min(1)).min(1),
  significance: z.string().min(1), limitations: z.array(z.string().min(1)).default([]),
  frameworkSteps: z.array(z.string().min(1)).default([]),
  approachLabel: z.string().default('Approach'), outcomeLabel: z.string().default('Findings'),
  composition: composition.default({ start: 1, span: 8, offset: 0, ratio: 1.5, mobileRatio: 1.3 }),
  mediaNeeded: z.string().default('Project photograph or research artifact'),
  narrative: z.string().regex(/^[a-z0-9-]+\.mdx$/).optional(),
  institution: z.string().nullable(), role: z.string(), status: z.string(), tags: z.array(z.string()),
  relatedProjects: z.array(z.string()).default([]),
  thumbnail: media.optional(), heroImage: media.optional(), galleryTitle: z.string().optional(), gallery: z.array(media).default([]),
  links: z.array(z.object({ label: z.string(), href: z.url().refine(value => value.startsWith('https://')) })),
  sections: z.array(z.object({ heading: z.string(), text: z.string(), image: media.optional(), video: z.object({ src: z.string().startsWith('/'), caption: z.string() }).optional() }))
});
export type Project = z.infer<typeof projectSchema>;
export const projects = z.array(projectSchema).parse(records);
for (const key of ['id','slug','order'] as const) {
  if (new Set(projects.map(p => p[key])).size !== projects.length) throw new Error(`Duplicate project ${key}`);
}
// One shared sequence drives the homepage, work index, numbering, and next/previous links.
export const publicProjects = projects.filter(p => p.published && p.showOnHomepage).sort((a,b) => a.order-b.order);
const cvFileSchema = z.object({ url: z.string().startsWith('/'), filename: z.string().endsWith('.pdf'), lastUpdated: z.string().nullable() });
const siteSchema = z.object({
  name: z.string(), fullName: z.string(), description: z.string(), affiliation: z.string(),
  sidebar: z.object({ position: z.string(), role: z.string(), lab: z.string(), summary: z.string() }),
  url: z.url().nullable(), email: z.email(), location: z.string(), cv: cvFileSchema.nullable(),
  social: z.object({ linkedin: z.url().nullable(), googleScholar: z.url().nullable(), github: z.url().nullable() }),
});
export const site = siteSchema.parse(siteData);
export const socialProfiles = [
  { label: 'LinkedIn', url: site.social.linkedin },
  { label: 'Google Scholar', url: site.social.googleScholar },
  { label: 'GitHub', url: site.social.github },
].filter((profile): profile is { label: string; url: string } => Boolean(profile.url));
export const profile = profileData;
const aboutImageSchema = z.object({
  src: z.string().startsWith('/').nullable(),
  alt: z.string().min(1),
  label: z.string().min(1),
  note: z.string().optional(),
  ratio: z.number().positive().optional(),
});
const aboutSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  introduction: z.array(z.string().min(1)).min(1),
  portrait: aboutImageSchema,
  journey: z.object({ heading: z.string(), paragraphs: z.array(z.string().min(1)).min(1) }),
  personal: z.object({
    heading: z.string(),
    paragraph: z.string(),
    familyImages: z.array(aboutImageSchema),
    photographyImages: z.array(aboutImageSchema),
  }),
  collaboration: z.object({ heading: z.string(), paragraph: z.string() }),
  timeline: z.object({ heading: z.string(), entries: z.array(z.object({ institution: z.string(), degree: z.string() })) }),
});
export const about = aboutSchema.parse(aboutData);
export type AboutImage = z.infer<typeof aboutImageSchema>;
const datedEntry = z.object({ role: z.string(), institution: z.string(), location: z.string(), dates: z.string(), description: z.string().optional(), highlights: z.array(z.string()).optional() });
const cvSchema = z.object({
  eyebrow: z.string(), heading: z.string(), introduction: z.string(),
  researchExperience: z.array(datedEntry),
  industryExperience: z.array(datedEntry),
  education: z.array(z.object({ degree: z.string(), institution: z.string(), dates: z.string(), focus: z.string() })),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
  service: z.array(z.object({ role: z.string(), dates: z.string() })),
  recognition: z.array(z.object({ name: z.string(), institution: z.string(), dates: z.string() })),
  outputs: z.object({ heading: z.string(), introduction: z.string() }),
});
export const cv = cvSchema.parse(cvData);
const publicationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.object({ name: z.string().min(1), isMe: z.boolean().default(false), equalContribution: z.boolean().default(false) })).min(1),
  year: z.number().int(),
  publicationYear: z.number().int().nullable().optional(),
  submissionYear: z.number().int().nullable().optional(),
  venue: z.string().nullable(),
  type: z.enum(['conference', 'workshop', 'journal_manuscript', 'conference_manuscript', 'manuscript', 'thesis']),
  typeLabel: z.string().optional(),
  status: z.enum(publicationStatuses),
  statusNote: z.string().optional(),
  equalContributionNote: z.string().optional(),
  doi: z.string().nullable(),
  pdf: z.string().nullable(),
  externalUrl: z.string().url().nullable(),
  projectSlug: z.string().nullable(),
});
export const publications = z.array(publicationSchema).parse(publicationData);
export type Publication = z.infer<typeof publicationSchema>;
for (const p of projects) {
  for (const slug of p.relatedProjects) if (!projects.some(other => other.slug === slug)) throw new Error(`Unknown related project ${slug}`);
}
for (const publication of publications) if (publication.projectSlug && !projects.some(project => project.slug === publication.projectSlug)) throw new Error(`Unknown project ${publication.projectSlug} for publication ${publication.id}`);
export function number(n:number) { return String(n).padStart(2,'0'); }
