# Change Log — `afrolink-restaurant-online`

## 2026-10-08 — Redesign & correction (branch `redesign-2026-10`, preview only)
- Imagery: 17 enhanced, watermarked Afrolink photos replace the weaker originals; watermark-aware cropping; kitchen photo in About.
- Menu: real dish photo per category (portrait photos matted, uncropped); prices/dishes unchanged.
- Video: "David On The Go" featured under the hero; new "Afrolink on video" section with 2 YouTube Shorts + 4 Facebook videos; click-to-play, one at a time, no third-party request before play.
- Social & reviews: Facebook, Instagram, TikTok (@afrolink_restaurant), YouTube; Google reviews CTA (no ratings shown).
- Reservation band (call / WhatsApp / mobile).
- Hours: Monday 16:00 (brief 2026-10-08); grouping Tue–Thu / Fri–Sat / Sun–Mon.
- Header nav: + Videos. Tests extended (social, videos, no iframe/autoplay on load).

## 2026-10-07 — Production deployment
- GitHub repo renamed `afropages-online` → `afrolink-restaurant-online`.
- Vercel project `afrolink-restaurant-online` created and connected to GitHub; production deployed (https://afrolink-restaurant-online.vercel.app).
- Domains `www.afrolink-restaurant.online` and `afrolink-restaurant.online` added; apex → www 308 redirect set in Vercel.
- DNS change in Cloudflare still required (R-008).

## 2026-10-07 — Afrolink digital menu site (unreleased, local only)
- Replaced the Afropages placeholder (moved to `legacy/afropages-mvp/` with `git mv`) with an Astro 7 static site.
- Structured content data: food menu (33 price lines), drinks (28 lines; Hot Drinks slot empty), business, hours, gallery, SEO.
- Sections: sticky header + mobile nav, hero, sticky category nav with scroll-spy, food menu, drinks, gallery (18 genuine photos, lightbox), about + services, opening hours (today highlighted, Europe/Berlin), contact, footer.
- SEO: title, description, canonical, Open Graph, Twitter card, favicon set, web manifest, robots.txt, sitemap.xml, schema.org Restaurant + Menu JSON-LD generated from data (no ratings).
- Tooling: ESLint (typescript-eslint, eslint-plugin-astro, jsx-a11y-x strict), `astro check`, node:test content tests, `prepare-image` script.
- `vercel.json` (apex → www redirect, caching, security headers). Not deployed.
