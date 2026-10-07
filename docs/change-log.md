# Change Log — `afrolink-restaurant-online`

## 2026-10-07 — Afrolink digital menu site (unreleased, local only)
- Replaced the Afropages placeholder (moved to `legacy/afropages-mvp/` with `git mv`) with an Astro 7 static site.
- Structured content data: food menu (33 price lines), drinks (28 lines; Hot Drinks slot empty), business, hours, gallery, SEO.
- Sections: sticky header + mobile nav, hero, sticky category nav with scroll-spy, food menu, drinks, gallery (18 genuine photos, lightbox), about + services, opening hours (today highlighted, Europe/Berlin), contact, footer.
- SEO: title, description, canonical, Open Graph, Twitter card, favicon set, web manifest, robots.txt, sitemap.xml, schema.org Restaurant + Menu JSON-LD generated from data (no ratings).
- Tooling: ESLint (typescript-eslint, eslint-plugin-astro, jsx-a11y-x strict), `astro check`, node:test content tests, `prepare-image` script.
- `vercel.json` (apex → www redirect, caching, security headers). Not deployed.
