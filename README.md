# Kenny He · Product Photography

Portfolio site for product photography, built with Astro. English and Spanish.
Sister site to the [event photography portfolio](https://kennyhc.github.io/event-photographer/).

Live: https://kennyhc.github.io/product-photography/

## Run locally

Needs Node 22.12 or newer.

```sh
npm install
npx astro dev --background   # http://localhost:4321/product-photography/
npx astro dev stop           # also: status, logs
npm run build                # output in dist/
npm run check                # type and template checks
```

## Add a project

1. Make a folder `src/assets/projects/<slug>/` (lowercase, hyphens, e.g. `ceramic-mugs`).
2. Add the photos. They show in filename order, so name them `01.jpg`, `02.jpg` and so on. Up to 30 are shown.
   - `cover.jpg`: the main shot, used on the card and the project page. Make it 4:5 (e.g. 2000 × 2500).
   - `alt.jpg` (optional): the shot the card switches to on hover, usually the lifestyle or in-context version. Also 4:5.
   - `before-01.jpg` + `after-01.jpg` (optional): a retouching pair. Adds a before/after slider. Same size for both. Not shown in the gallery.
3. Add two text files with the same slug, `src/content/projects/en/<slug>.md` and `src/content/projects/es/<slug>.md`:

```md
---
title: "Ceramic mugs for [brand]"
client: "[brand]"          # optional, leave out to stay anonymous
category: "ecommerce"      # ecommerce, lifestyle or still-life
shots: ["white", "detail"] # any of: white, lifestyle, flatlay, detail
date: "October 2026"
summary: "One line for search results and link previews."
order: 1                   # position on Work and Home (lowest first)
---

One factual line about the shoot.
```

A `testimonial: { quote: "...", author: "..." }` field is optional. Only use real quotes.

## Photo sizes

Before committing photos, back up the originals outside the repo, then shrink the copies in the repo to 2500 px on the long edge:

```sh
sips -Z 2500 -s formatOptions 85 *.jpg   # macOS, run inside the folder
```

Camera originals (5 to 16 MB each) would stay in the git history forever.

## Placeholders

`npm run placeholders` generates grey placeholder photos for the sample projects and the home hero. They only fill files that don't exist yet (`--force` overwrites). Delete the `sample-*` projects and their folders once real work is in.

## Where things live

- `src/i18n/ui.ts`: every piece of text on the site, in English and Spanish.
- `src/lib/site.ts`: email, WhatsApp number, Instagram handle.
- `src/views/`: page bodies, shared by both languages. `src/pages/` and `src/pages/es/` are thin route files.
- `src/assets/home/`: `hero.jpg` (landscape, desktop) and `hero-portrait.jpg` (vertical, phones). Pick photos with a darker lower third so the name stays readable.
- `src/assets/about/portrait1.jpg`: the About portrait.

## Deploy

Every push to `main` builds and publishes to GitHub Pages through `.github/workflows/deploy.yml`. One-time setup: make the repo public (Pages needs that on the free plan) and set Settings > Pages > Source to "GitHub Actions".
