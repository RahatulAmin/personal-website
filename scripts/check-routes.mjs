import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const projects = JSON.parse(readFileSync(new URL('../content/projects.json', import.meta.url), 'utf8')).filter(p=>p.published && p.showOnHomepage).sort((a,b)=>a.order-b.order);
const origin = process.argv[2] || 'http://127.0.0.1:3000';
const home = await fetch(origin);
assert.equal(home.status, 200);
const html = await home.text();
for (const section of ['intro', 'work', 'publications', 'cv', 'about', 'contact']) {
  assert(html.includes(`id="${section}"`), `Missing homepage section: ${section}`);
}
const initialProjects = projects.slice(0, 6);
const renderedProjects = [...html.matchAll(/id="project-([^"#?]+)"/g)].map(match=>match[1]).filter(slug=>!slug.startsWith('details-'));
assert.deepEqual([...new Set(renderedProjects)],initialProjects.map(project=>project.slug),'The initial inline project set must preserve metadata order');
assert(html.includes('Explore the rest of my projects'),'Missing control for revealing the remaining projects');
const projectRoutes = projects.map(project=>`/projects/${project.slug}/`);
for (const path of [...projectRoutes, '/robots.txt', '/sitemap.xml', '/opengraph-image']) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, `Route failed: ${path}`);
  const index = projectRoutes.indexOf(path);
  if (index !== -1) {
    const page = await response.text();
    assert(page.includes(projects[index].title), `Project title must render: ${path}`);
    assert(page.includes(`/#project-${projects[index].slug}`), `Legacy project route must point to its inline homepage project: ${path}`);
  }
}
assert.equal((await fetch(`${origin}/projects/not-a-real-project`)).status, 404);
console.log(`Verified the inline homepage gallery, initial project order, all ${projectRoutes.length} legacy project routes, social image, and missing-project 404.`);
