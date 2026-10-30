import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { about, cv, publications, publicProjects, projects, site } from '../lib/content';
const expected=['hallway-study','collaborative-study','robot-service','social-robots-loneliness','roboethics','secondary-user-study','mofasa-framework','mofasa-tools','accessible-robotics','underwater-robotics','embodied-ai-safety'];
const expectedPublications=['secondary-users-2026','robot-service-2026','roboethics-2024','accessible-robotics-2024','loneliness-survey-2021','robot-pets-2020','domestic-robots-loneliness-2020','mofasa-framework-2026','behavioral-diversity-2026','telepresence-collaboration-2026','mofasa-tools-2026','msc-thesis-2022'];
assert.deepEqual(publicProjects.map(p=>p.id),expected,'Portfolio order must match the approved inventory');
assert.deepEqual(publications.map(publication=>publication.id),expectedPublications,'Publication inventory must match the CV-based bibliography');
assert.equal(new Set(publications.map(publication=>publication.id)).size,publications.length,'Publication IDs must be unique');
const publicationGroups = [
  (publication: (typeof publications)[number]) => publication.type !== 'thesis' && publication.status === 'published',
  (publication: (typeof publications)[number]) => publication.type !== 'thesis' && publication.status === 'in_press',
  (publication: (typeof publications)[number]) => publication.type !== 'thesis' && publication.status === 'under_review',
  (publication: (typeof publications)[number]) => publication.type !== 'thesis' && publication.status === 'in_preparation',
  (publication: (typeof publications)[number]) => publication.type === 'thesis',
];
for (const publication of publications) assert.equal(publicationGroups.filter(matches => matches(publication)).length, 1, `Publication must belong to exactly one accordion section: ${publication.id}`);
assert(publications.some(publicationGroups[0]), 'Published & Peer-Reviewed must contain at least one record');
assert(cv.researchExperience.length > 0, 'Research Experience must contain at least one position');
assert(cv.industryExperience.length > 0, 'Industry Experience must contain at least one position');
assert(cv.education.length > 0, 'Education must contain at least one degree');
assert(cv.skills.length > 0, 'Research & Technical Skills must contain at least one category');
assert(cv.teaching.length > 0, 'Teaching & Mentoring must contain at least one record');
assert(cv.recognition.length > 0, 'Awards & Recognition must contain at least one record');
for(const p of projects){for(const media of [p.thumbnail,p.heroImage,...p.gallery,...p.sections.map(s=>s.image)].filter(Boolean)){assert(existsSync(join(process.cwd(),'public',media!.src)),`Missing image: ${media!.src}`);}for(const section of p.sections)if(section.video)assert(existsSync(join(process.cwd(),'public',section.video.src)),`Missing video: ${section.video.src}`);}
for (const p of projects) if (p.narrative) assert(existsSync(join(process.cwd(), 'content', 'narratives', p.narrative)), `Missing MDX narrative: ${p.narrative}`);
const publicProjectCopy = JSON.stringify(projects);
for (const phrase of ['to be confirmed', 'to be verified', 'will be added', 'remain to be added', 'details to be added']) {
  assert(!publicProjectCopy.toLowerCase().includes(phrase), `Public project copy still contains placeholder language: ${phrase}`);
}
for (const image of [about.portrait, ...about.personal.familyImages, ...about.personal.photographyImages]) if (image.src) assert(existsSync(join(process.cwd(),'public',image.src)),`Missing About image: ${image.src}`);
if(site.cv)assert(existsSync(join(process.cwd(),'public',site.cv.url)),'Missing CV');
console.log(`Validated ${publicProjects.length} project routes, ${publications.length} publication records, references, and configured local media.`);
