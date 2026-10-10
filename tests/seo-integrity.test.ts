/**
 * Whole-site SEO integrity on the BUILT site (run `npm run build` first): every page against the
 * sitemap, reciprocal hreflang, social images (real pixel sizes), structured data vs. the
 * business data, menu prices, alt text and internal links.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { pageFacts } from '../scripts/seo/page-facts.mjs';
import { parseSitemap } from '../scripts/seo/indexnow.mjs';
import { business, phones, siteUrl } from '../src/data/business.ts';
import { openingHours } from '../src/data/hours.ts';
import { foodMenu } from '../src/data/menu.ts';
import { drinksMenu } from '../src/data/drinks.ts';
import { schemaPrice } from '../src/data/format.ts';

const ROOT = join('dist', 'client');
const built = existsSync(join(ROOT, 'index.html'));
const opt = { skip: !built && 'run `npm run build` first' };

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const htmlFiles = () => walk(ROOT).filter((f) => f.endsWith('.html'));
const urlOf = (file: string) => `${siteUrl}/${file.slice(ROOT.length + 1).split(sep).join('/').replace(/index\.html$/, '')}`;
const fileOf = (url: string) => join(ROOT, ...url.slice(siteUrl.length).split('/').filter(Boolean), 'index.html');
const facts = (url: string) => pageFacts(readFileSync(fileOf(url), 'utf8'));
const sitemapUrls = () => parseSitemap(readFileSync(join(ROOT, 'sitemap.xml'), 'utf8')).urls;

/** Pixel size of a PNG, JPEG or WebP file. */
function imageSize(file: string): { width: number; height: number } {
  const b = readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  throw new Error(`unknown image format: ${file}`);
}

test('every built page is in the sitemap and every sitemap URL is built — no extras, no gaps', opt, () => {
  const pages = htmlFiles().map(urlOf).sort();
  const sm = sitemapUrls().sort();
  assert.deepEqual(pages, sm);
  assert.equal(new Set(sm).size, sm.length);
});

test('hreflang: valid codes, self reference, x-default = German, fully reciprocal, equal to sitemap alternates', opt, () => {
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  const smAlts = new Map(
    [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => [
      m[1].match(/<loc>([^<]+)<\/loc>/)![1],
      [...m[1].matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((x) => [x[1], x[2]]).sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1])),
    ]),
  );
  const all = new Map(sitemapUrls().map((u) => [u, facts(u)]));
  for (const [url, f] of all) {
    const codes = f.hreflang.map(([c]: string[]) => c).sort();
    assert.deepEqual(codes, ['de-DE', 'en', 'fr', 'x-default'], url);
    const self = f.hreflang.find(([, h]: string[]) => h === url);
    assert.ok(self, `${url}: self reference`);
    assert.equal(self[0], f.lang, `${url}: <html lang> equals its own hreflang`);
    const de = f.hreflang.find(([c]: string[]) => c === 'de-DE')![1];
    assert.equal(f.hreflang.find(([c]: string[]) => c === 'x-default')![1], de, `${url}: x-default is the German page`);
    for (const [code, href] of f.hreflang) {
      if (code === 'x-default') continue;
      const other = all.get(href);
      assert.ok(other, `${url} → ${href} is a built, listed page`);
      assert.deepEqual(other.hreflang, f.hreflang, `${url} ↔ ${href} reciprocal`);
    }
    assert.deepEqual(smAlts.get(url), f.hreflang, `${url}: sitemap alternates = HTML`);
  }
});

test('social images: absolute canonical-host URLs, stable (no deploy parameter), real size = declared size', opt, () => {
  const checked = new Set<string>();
  for (const url of sitemapUrls()) {
    const f = facts(url);
    const og = f.og['og:image'];
    assert.equal(f.twitter['twitter:image'], og, url);
    assert.ok(og.startsWith(`${siteUrl}/`), url);
    assert.doesNotMatch(og, /[?&]dpl=/, `${url}: og:image must not change per deployment`);
    assert.ok(f.og['og:image:alt'], `${url}: og:image:alt`);
    if (checked.has(og)) continue;
    checked.add(og);
    const file = join(ROOT, ...new URL(og).pathname.split('/').filter(Boolean));
    assert.ok(existsSync(file), `${og} is built`);
    const { width, height } = imageSize(file);
    assert.deepEqual([width, height], [Number(f.og['og:image:width']), Number(f.og['og:image:height'])], `${og} declared size`);
    assert.ok(Math.abs(width / height - 1200 / 630) < 0.01, `${og}: 1.91:1 like 1200×630 (${width}×${height})`);
    assert.ok(width >= 600 && width <= 1200, `${og}: large-card size (${width}×${height})`);
  }
  assert.ok(checked.size >= 30, 'dish pages carry their own photos');
});

test('icons and manifest: every referenced file exists with its declared size', opt, () => {
  const home = readFileSync(join(ROOT, 'index.html'), 'utf8');
  for (const m of home.matchAll(/<link[^>]+rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g)) {
    const href = m[0].match(/href="([^"]+)"/)![1];
    assert.ok(existsSync(join(ROOT, href)), href);
  }
  const manifest = JSON.parse(readFileSync(join(ROOT, 'site.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) {
    const [w, h] = icon.sizes.split('x').map(Number);
    assert.deepEqual(imageSize(join(ROOT, icon.src)), { width: w, height: h }, icon.src);
  }
  assert.deepEqual(imageSize(join(ROOT, 'apple-touch-icon.png')), { width: 180, height: 180 });
});

test('structured data parses everywhere; no ratings, reviews or invented offers', opt, () => {
  const forbidden = /"@type":"(AggregateRating|Review|Rating|Certification)"/;
  for (const url of sitemapUrls()) {
    const f = facts(url);
    assert.deepEqual(f.jsonLdErrors, [], url);
    assert.doesNotMatch(JSON.stringify(f.jsonLd), forbidden, url);
    assert.doesNotMatch(JSON.stringify(f.jsonLd), /"(aggregateRating|review|award|hasCertification)"/, url);
  }
});

test('Restaurant JSON-LD equals the business data (name, address, phone, hours, cuisine, menu)', opt, () => {
  for (const home of ['', 'en/', 'fr/']) {
    const r = facts(`${siteUrl}/${home}`).jsonLd.find((n: { '@type': string }) => n['@type'] === 'Restaurant');
    assert.ok(r, home);
    assert.equal(r.name, business.name);
    assert.equal(r['@id'], `${siteUrl}/#restaurant`);
    assert.deepEqual(r.address, {
      '@type': 'PostalAddress',
      streetAddress: 'Berzeliusstraße 7',
      postalCode: '45144',
      addressLocality: 'Essen',
      addressCountry: 'DE',
    });
    assert.equal(r.telephone, '+49 201 84674196');
    assert.equal(r.telephone, phones.landline.international);
    assert.deepEqual(r.servesCuisine, [...business.cuisine]);
    assert.deepEqual(
      r.openingHoursSpecification.map((h: { dayOfWeek: string; opens: string; closes: string }) => [h.dayOfWeek.replace('https://schema.org/', ''), h.opens, h.closes]),
      openingHours.map((h) => [h.day, h.opens, h.closes]),
    );
    assert.equal(r.acceptsReservations, true);
    assert.ok(r.hasMenu.url.startsWith(siteUrl));
  }
});

test('menu structured data carries exactly the approved prices (food and drinks)', opt, () => {
  const expected = [
    ...foodMenu.flatMap((c) => c.items.filter((i) => i.available !== false).flatMap((i) => (i.variants ? i.variants.map((v) => v.price) : [i.price!]))),
    ...drinksMenu.flatMap((c) => c.items.filter((i) => i.available !== false).map((i) => i.price)),
  ]
    .map(schemaPrice)
    .sort();
  for (const menu of ['speisekarte/', 'en/menu/', 'fr/carte/']) {
    // pageFacts sorts JSON-LD keys, so every Offer serializes as {"@type":"Offer","price":…}.
    const nodes = JSON.stringify(facts(`${siteUrl}/${menu}`).jsonLd);
    const prices = [...nodes.matchAll(/"@type":"Offer","price":"([\d.]+)"/g)].map((m) => m[1]).sort();
    assert.deepEqual(prices, expected, menu);
  }
  const mackerel = facts(`${siteUrl}/speisekarte/mackerel-fish-slices/`).jsonLd.find((n: { '@type': string }) => n['@type'] === 'MenuItem');
  assert.equal(mackerel.offers.price, '5.00');
  assert.equal(mackerel.offers.priceSpecification.referenceQuantity.unitText, 'pro Stück');
});

test('every image has an alt attribute (empty only for decorative images) and every internal link resolves', opt, () => {
  for (const url of sitemapUrls()) {
    const html = readFileSync(fileOf(url), 'utf8');
    const f = pageFacts(html);
    for (const img of f.images) assert.notEqual(img.alt, null, `${url}: ${img.src}`);
    for (const m of html.matchAll(/\shref="(\/[^"#?]*)/g)) {
      const p = m[1];
      if (p.startsWith('/api/') || p.startsWith('/admin/')) continue;
      const target = join(ROOT, ...p.split('/').filter(Boolean));
      const ok = (existsSync(target) && statSync(target).isFile()) || existsSync(join(target, 'index.html'));
      assert.ok(ok, `${url} links to missing ${p}`);
    }
  }
});

test('headings: exactly one h1 per page and no skipped levels', opt, () => {
  for (const url of sitemapUrls()) {
    const levels: number[] = facts(url).headings.map((h) => Number(h[0]));
    assert.equal(levels.filter((l) => l === 1).length, 1, url);
    let prev = 1;
    for (const lvl of levels) {
      assert.ok(lvl <= prev + 1, `${url}: h${prev} → h${lvl}`);
      prev = lvl;
    }
  }
});
