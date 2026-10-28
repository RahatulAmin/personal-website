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
const links = [...html.matchAll(/href="(\/projects\/[^"#?]+)"/g)].map(match=>match[1]);
const unique = [...new Set(links)];
assert.deepEqual(unique,projects.map(p=>`/projects/${p.slug}/`),'Rendered project links must preserve metadata order');
for (const path of [...unique, '/robots.txt', '/sitemap.xml', '/opengraph-image']) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, `Route failed: ${path}`);
  const index = unique.indexOf(path);
  if (index !== -1) {
    const page = await response.text();
    assert(page.includes(projects[index].title), `Project title must render: ${path}`);
    const navigation = page.match(/<nav[^>]*aria-label="Adjacent projects"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    const adjacent = [...navigation.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(adjacent, [unique[index - 1], unique[index + 1]].filter(Boolean), `Wrong adjacent projects: ${path}`);
  }
}
assert.equal((await fetch(`${origin}/projects/not-a-real-project`)).status, 404);
console.log(`Verified the scrolling homepage, rendered project order, all ${unique.length} case studies, social image, and missing-project 404.`);
