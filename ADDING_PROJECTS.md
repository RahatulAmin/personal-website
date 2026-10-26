# Editing the portfolio

## Change project order or titles

Edit `content/projects.json`. Every record has independent fields:

```json
{
  "id": "hallway-study",
  "slug": "hallway-interactions",
  "internalName": "Hallway Study",
  "title": "Same Robot, Different Reactions",
  "order": 1
}
```

`order` is a unique positive integer. Lower numbers appear first. Change these numbers to rearrange the portfolio without editing React. `title` is the public-facing title; rename it independently. `id` is a stable editorial identity. Keep `slug` stable to preserve links. The homepage, expanded portfolio index, project numbering, and previous/next navigation follow the same sequence.

The content check records the currently approved sequence. After deliberately changing that sequence or adding a project, update the `expected` IDs in `scripts/check-content.ts`. This is a regression check, not the source of display order.

## Add a project

Copy a record in `content/projects.json`. Give it a unique `id`, `slug`, and `order`; edit its title, summary, category, period, institution, status, role, tags, and narrative sections. Set `published` and `showOnHomepage` to true when ready. No route definition, JSX, or CSS edits are necessary.

Use `composition` to art-direct the gallery without editing CSS:

```json
"composition": { "start": 4, "span": 9, "offset": 0, "ratio": 1.65, "mobileRatio": 1.25 },
"mediaNeeded": "Hallway deployment photograph"
```

The desktop gallery has 12 columns. `start` is the starting column and `span` is the width in columns; together they must fit the grid. `offset` adds up to 200 pixels above the entry on desktop. `ratio` is image width divided by height; values below 1 create portraits. On mobile, entries follow a single reading sequence and use `mobileRatio`. Each entry is individually composed; there is no automatic repeating pattern. Existing `layout`, `visual`, and `accent` fields are retained as legacy metadata but no longer generate art or control presentation.

## Images and video

Put files in `public/images/projects/<slug>/` or `public/videos/<slug>/`. Use descriptive filenames and compressed WebP/AVIF/JPG/PNG images. Add either or both of:

```json
"thumbnail": {"src":"/images/projects/hallway-interactions/cover.webp","alt":"Describe the actual visible research scene","position":"center","caption":"Verified context and photo credit"},
"heroImage": {"src":"/images/projects/hallway-interactions/hero.webp","alt":"Describe the scene","position":"center"}
```

The hero falls back to the thumbnail. Missing media uses a plain neutral slot labeled with `mediaNeeded` and “Image to be added.” No generated artwork or fake research photos are used. Set media `fit` to `"contain"` for screenshots or figures that must remain fully visible; the default `"cover"` fills a photographic crop. `position` controls the focal point. Hero captions are shown below the media. To show a caption in the narrative, add `image` to a section, or add media objects to `gallery`. A section can also contain `video: {"src":"/videos/example/demo.mp4","caption":"Description of the demonstration"}`. Videos use native controls and do not autoplay. Hosted YouTube demonstrations can be included as external links.

## Narratives and outputs

`sections` is an ordered array of `{ "heading": "The question", "text": "Accessible research narrative." }` with optional image or video fields. Add, remove, or reorder sections entirely through content. Use genuine findings and accurately scoped personal contributions. The final contribution section uses `role`.

For richer writing, add an MDX file under `content/narratives/` and set `narrative` to its filename (for example `"hallway-interactions.mdx"`). The MDX replaces the `sections` narrative; metadata, contribution, gallery, and outputs still come from JSON. Use `##` for section headings. Local MDX is trusted author content and is compiled on the server. Do not accept MDX from visitors or external untrusted sources.

The included `ResearchImage` component is available inside MDX without an import:

```mdx
<ResearchImage src="/images/projects/hallway-interactions/deployment.webp" alt="Describe the actual scene" caption="Verified context and credit" width={1600} height={1000} />
```

Only add that element once its real media file exists. Hallway Study provides a working MDX narrative example. Other projects continue to use their existing structured sections.

Add publication records once in `content/publications.json`, then reference their IDs in a project's `relatedPublications`. Keep exact status explicit; never change submitted or under-review work to accepted without evidence. Publication fields support title, authors, year, venue, status, DOI, PDF, and associated project slug. Add external outputs to `links` as `{ "label": "Code", "href": "https://actual-repository-url" }`.

## Visibility and site information

Set `published: false` or `showOnHomepage: false` to hide a project from all public listings and its public route. Never place sensitive drafts or data in a public repository. Update email, profiles (`label`/`url` pairs), production URL, and CV path in `content/site.json`. Store the actual CV under `public/documents/`, then set `cv` to `/documents/your-cv.pdf`.

Run the documented checks and rebuild after edits. Metadata validation rejects duplicate IDs, slugs, and display orders, missing required alt text, invalid links, and unknown publication references.
