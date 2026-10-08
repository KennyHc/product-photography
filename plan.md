# Next steps

Status: first build done, not yet committed or deployed. 20 pages build cleanly (EN + ES), `astro check` clean, checked in Playwright at 1280×800 and 390×844. Direction "Studio": cool near-white, ink-blue accent, Fraunces + Inter. Pages: Home, Work (filters), project pages (gallery with zoom, before/after slider), Services, About, Contact, 404, in EN + ES. Will live at https://kennyhc.github.io/product-photography/ (deploys on every push to `main`).

## 1. Before deploy (you)

- [ ] **Real photos.** Replace the generated placeholders in `src/assets/projects/<slug>/` and `src/assets/home/`, then delete the placeholders (every placeholder has its size written on it).
- [ ] **Shrink photos before committing.** Back up originals outside the repo, then `sips -Z 2500 -s formatOptions 85 *.jpg` in each folder.
- [ ] **Hero photos.** `src/assets/home/hero.jpg` (landscape) and `hero-portrait.jpg` (vertical, for phones). Pick shots with a darker lower third so the white name stays readable.
- [ ] **Make the repo public** (you said OK). I'll scan the history for secrets and large files first, then enable Pages.

## 2. Content (you)

Everything in `[square brackets]` on the site is a placeholder waiting for a fact.

- [ ] **Projects.** You have no product projects yet. Shoot 3 or 4 sets first (your own products, friends' brands, or a small shop) so there is real work to show. For each: brand or product type (or anonymous), month and year, and what was shot (white background, lifestyle, flat lay, detail). The four `sample-*` projects are placeholders: rename or delete them.
- [ ] **Packages (proposed by me, please confirm or change).** Starter: up to 5 products. Collection: up to 15 products. Custom: larger or ongoing work. No prices on the site.
- [ ] **Included in every package:** confirm the number of edited images per product, turnaround in working days, file formats and sizes, and usage rights.
- [ ] **Extras:** confirm which you offer: props and styling, coloured backgrounds, rush delivery.
- [ ] **FAQ:** how clients get products to you (shipping, pickup, or you shoot at their place).
- [ ] **Before/after pairs.** Name them `before-01.jpg` / `after-01.jpg` in a project folder and the retouch slider appears automatically.
- [ ] **Testimonials:** only real quotes, added to a project's `testimonial:` field.

## 3. UI polish (agent)

- [ ] **Card hover on touch.** Phones only see the cover. Consider a small "2 shots" indicator or a tap-and-hold preview once real alt shots exist.
- [ ] **Image placeholders.** Dominant colour behind each photo while it loads (computed at build time with sharp).
- [ ] **Lightbox zoom on touch.** Add pinch-to-zoom; double-tap and drag work today.
- [ ] **Header.** Hide on scroll down, show on scroll up.
- [ ] **Re-check with real photos.** Hero readability, cover crops, and the justified gallery with real ratios.

## 4. Code health

- [ ] Add a sitemap (`@astrojs/sitemap`).
- [ ] `src/scripts/site.ts` is about 740 lines. Split the lightbox into its own module.

## 5. Later

- [ ] Custom domain covering both sites, e.g. `kennyhe.photo/product` and `/events`.
- [ ] Link the product site from the event site's footer.
