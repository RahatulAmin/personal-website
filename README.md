# Rahatul Ananto · Research portfolio

A gallery-led research portfolio built with Next.js App Router, TypeScript, optional local MDX narratives, and validated JSON content. Six selected projects appear initially; a full-width accordion opens the remaining work. Project case studies expand inline on the homepage, while statically generated legacy URLs return visitors to the matching inline project. There is no paid CMS or backend.

## Local development

Use Node.js 22.13+ (recommended) and npm.

```sh
npm install
npm run dev
```

Open the localhost URL printed by Next.js. Production checks:

```sh
npm run check:content
npm run typecheck
npm run lint
npm run build
npm start
```

## Content

- `content/projects.json`: identity, order, visibility, visual composition, narrative sections, media, links, and publication references.
- `content/site.json`: name, affiliation, canonical production URL, email, professional profiles, and CV path.
- `content/profile.json`: shared biography, education, and methods used on About and CV.
- `content/publications.json`: single source for publication records.
- `content/narratives/`: optional MDX case-study narratives, referenced by project metadata.
- `app/globals.css`: centralized palette, typography, spacing, and responsive layouts.

See [ADDING_PROJECTS.md](ADDING_PROJECTS.md) for editing instructions and [CONTENT_TODO.md](CONTENT_TODO.md) for missing source material. Research descriptions are grounded in the supplied brief, with explicit gaps where dates, methods, outcomes, or personal responsibilities need verification. No project photographs were supplied. Plain media placeholders identify the photograph or artifact needed; the former geometric illustration system has been removed.

## Deployment

Import this folder into a Git repository, connect it to Vercel, select Next.js, and deploy using `npm run build`. No environment variables are required. Set `content/site.json` → `url` to the real HTTPS origin before public launch to enable absolute canonical URLs and the sitemap. Set verified contact information and upload a CV before launch. `url` remains null to avoid indexing a fabricated domain.

The site includes metadata, an Open Graph image, robots.txt, and a domain-dependent sitemap. Barlow Condensed and DM Sans fonts are self-hosted through Fontsource; no Google Fonts connection is required. No analytics or external embeds are included by default.

## Architecture

`lib/content.ts` validates metadata with Zod and exposes a single ordered public project list. The homepage gallery, inline case studies, project index, static legacy routes, and sitemap use that same list. Titles never determine order, identity, or routing. Both `published` and `showOnHomepage` must be true for a project to appear publicly. Hiding a project removes it from public routes as well as listings.

The first five PhD contributions lead the continuous portfolio. Each project's `composition` metadata controls its desktop and mobile image ratios. The gallery uses normal grid flow, preserving DOM, visual, and keyboard order; an expanded project spans both columns and pushes later work down. Semantic buttons, focus states, a skip link, labeled navigation, and reduced-motion support are included.

The redesign follows observations from the live Banter reference: bold condensed display type, sparse navigation, off-center large media, mixed portrait/landscape framing, and minimal captions. It uses original code and no template photographs, logo, or source assets. See `DESIGN_REVIEW.md` for observations and verification.
