/**
 * Search-discovery architecture, dish content and allergen baseline.
 * Data checks always run; checks on the built HTML need `npm run build`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { foodMenu, allFoodItems } from '../src/data/menu.ts';
import { dishContent } from '../src/data/dish-content.ts';
import { HISTORICAL_CODES, historicalRegister, publicAllergenInfo } from '../src/data/allergens.ts';
import { dishPaths, locales, routes, type Lang } from '../src/i18n/config.ts';
import { pagesUi } from '../src/i18n/pages.ts';
import { dishImages } from '../src/data/dish-images.ts';
import { formatPrice } from '../src/data/format.ts';

const SITE = 'https://www.afrolink-restaurant.online';
const items = allFoodItems().filter(({ item }) => item.available !== false);
const built = existsSync('dist/client/index.html');
const opt = { skip: !built && 'run `npm run build` first' };
const read = (path: string) => readFileSync(join('dist', 'client', path, 'index.html'), 'utf8');

/* ───────────── Content ───────────── */

test('every current food item has original content in DE, EN and FR', () => {
  assert.equal(items.length, 35);
  for (const { item } of items) {
    const c = dishContent[item.id];
    assert.ok(c, `${item.id} has no content`);
    for (const l of locales) {
      for (const k of ['kind', 'summary', 'typical'] as const) {
        assert.ok(c[k][l]?.trim().length > (k === 'kind' ? 5 : 40), `${item.id}.${k}.${l}`);
      }
      assert.ok(c.summary[l].length <= 260, `${item.id} summary too long for a card (${l})`);
    }
  }
  assert.deepEqual(Object.keys(dishContent).sort(), items.map(({ item }) => item.id).sort(), 'no content for unknown dishes');
});

test('dish content makes no allergen-free, halal, vegan or medical claims', () => {
  const banned = /(allergenfrei|allergen-free|sans allerg|halal-zertifiziert|certified halal|garantiert|guaranteed|vegan|glutenfrei|gluten-free|diabetiker|healthy|gesund)/i;
  for (const [id, c] of Object.entries(dishContent)) {
    for (const l of locales) {
      for (const text of [c.kind[l], c.summary[l], c.typical[l], c.allergyHint?.[l] ?? '']) assert.ok(!banned.test(text), `${id} (${l}): ${text.match(banned)?.[0]}`);
    }
  }
});

test('pages copy has identical keys in all three languages', () => {
  const keys = (o: unknown, p = ''): string[] =>
    typeof o === 'object' && o && !Array.isArray(o) ? Object.entries(o).flatMap(([k, v]) => keys(v, `${p}${k}.`)) : [p];
  const de = keys(pagesUi.de).sort();
  for (const l of ['en', 'fr'] as const) assert.deepEqual(keys(pagesUi[l]).sort(), de, l);
  for (const l of locales) assert.equal(pagesUi[l].delivery.faq.length, pagesUi.de.delivery.faq.length);
});

/* ───────────── Allergen baseline (owner instruction 2026-10-09) ───────────── */

test('historical register: 29 descriptions, 14 coded dishes, 7 codes — preserved exactly', () => {
  assert.equal(historicalRegister.length, 29);
  assert.equal(historicalRegister.filter((h) => h.codes.length).length, 14);
  assert.deepEqual(Object.keys(HISTORICAL_CODES).sort(), ['1', '2', '3', '4', '5', '7', '8']);
  const expected: Record<string, string[]> = {
    edikaikong: ['1', '2'],
    'ofe-nsala': ['1', '2', '4'],
    'efo-riro': ['2', '3', '4'],
    'bitterleaf-soup': ['1', '2', '3'],
    'jollof-rice': ['4', '7', '8'],
    'white-rice': ['1', '2', '4'],
    'beans-plantain': ['4', '7'],
    isiewu: ['2', '3', '4'],
    nkwobi: ['2', '3', '4'],
    'pepper-soup': ['1', '2', '4', '8'],
    stockfish: ['2'],
    'fried-rice': ['4', '5'],
  };
  for (const [id, codes] of Object.entries(expected)) {
    assert.deepEqual(historicalRegister.find((h) => h.currentId === id)?.codes, codes, id);
  }
  const discontinuedCoded = historicalRegister.filter((h) => h.currentId === null && h.codes.length).map((h) => h.originalName);
  assert.deepEqual(discontinuedCoded.sort(), ['OFE AKWU', 'PORRIDGE COCOYAM']);
  for (const h of historicalRegister) if (h.currentId) assert.ok(items.some(({ item }) => item.id === h.currentId), h.currentId);
});

test('public allergen info: allergens and additives separated, "possible" kept, absence ≠ allergen-free', () => {
  const jollof = publicAllergenInfo('jollof-rice');
  assert.equal(jollof.status, 'previous-menu');
  assert.deepEqual(jollof.allergens.map((a) => [a.code, a.possible]), [['I', true]]);
  assert.deepEqual(jollof.additives.map((a) => a.label.de), ['Geschmacksverstärker', 'Farbstoffe']);
  assert.deepEqual(jollof.allergens.map((a) => a.label.de), ['Sellerie (möglich)']);
  const pepper = publicAllergenInfo('pepper-soup');
  assert.deepEqual(pepper.allergens.map((a) => a.code), ['B', 'D']);
  assert.deepEqual(pepper.additives.map((a) => a.historicalCode), ['4', '8']);
  assert.deepEqual(publicAllergenInfo('fried-rice').allergens.map((a) => a.code), ['C']);
  const egusi = publicAllergenInfo('egusi-soup');
  assert.equal(egusi.status, 'not-declared');
  assert.equal(egusi.listedWithoutCodes, true);
  assert.equal(egusi.allergens.length + egusi.additives.length, 0);
  assert.equal(publicAllergenInfo('banga-soup').listedWithoutCodes, false);
  // Discontinued Ofe Akwu is never transferred to Banga; Porridge Cocoyam never to Porridge Yam.
  assert.equal(publicAllergenInfo('banga-soup').status, 'not-declared');
  assert.equal(publicAllergenInfo('porridge-yam').status, 'not-declared');
  const statuses = items.map(({ item }) => publicAllergenInfo(item.id).status);
  assert.equal(statuses.filter((s) => s === 'previous-menu').length, 12);
  assert.equal(statuses.filter((s) => s === 'confirmed').length, 0, 'nothing kitchen-confirmed yet');
});

/* ───────────── Built pages ───────────── */

const fixed = ['menu', 'soups', 'delivery', 'catering', 'reservations', 'gallery', 'contact'] as const;
const allPages = (): { path: string; lang: Lang; paths: Record<Lang, string> }[] => [
  ...(Object.keys(routes) as (keyof typeof routes)[]).flatMap((r) => locales.map((lang) => ({ path: routes[r][lang], lang, paths: routes[r] }))),
  ...items.flatMap(({ item }) => locales.map((lang) => ({ path: dishPaths(item.id)[lang], lang, paths: dishPaths(item.id) }))),
];

test('every page exists with self-canonical, 4 hreflang alternates and indexable robots', opt, () => {
  const pages = allPages();
  assert.equal(pages.length, 141);
  for (const p of pages) {
    const html = read(p.path);
    assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}${p.path}"`), `${p.path} canonical`);
    for (const l of locales) assert.ok(html.includes(`hreflang="${l === 'de' ? 'de-DE' : l}" href="${SITE}${p.paths[l]}"`), `${p.path} hreflang ${l}`);
    assert.ok(html.includes(`hreflang="x-default" href="${SITE}${p.paths.de}"`), `${p.path} x-default`);
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.ok(!/noindex/.test(html), `${p.path} noindex`);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${p.path} must have exactly one h1`);
  }
});

test('titles and meta descriptions are unique across all 141 pages', opt, () => {
  const titles = new Map<string, string>();
  const descs = new Map<string, string>();
  for (const p of allPages()) {
    const html = read(p.path);
    const title = html.match(/<title>([^<]+)<\/title>/)![1];
    const desc = html.match(/<meta name="description" content="([^"]+)"/)![1];
    assert.ok(!titles.has(title), `duplicate title "${title}" on ${p.path} and ${titles.get(title)}`);
    assert.ok(!descs.has(desc), `duplicate description on ${p.path} and ${descs.get(desc)}`);
    titles.set(title, p.path);
    descs.set(desc, p.path);
    assert.ok(title.length <= 80, `${p.path} title too long (${title.length})`);
  }
});

test('dish pages: exact prices, breadcrumbs, MenuItem schema without ratings, allergen state', opt, () => {
  for (const { item, category } of items) {
    for (const lang of locales) {
      const html = read(dishPaths(item.id)[lang]);
      const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1]));
      const crumbs = lds.find((x) => x['@type'] === 'BreadcrumbList');
      assert.ok(crumbs, `${item.id} breadcrumbs`);
      assert.equal(crumbs.itemListElement.at(-1).item, `${SITE}${dishPaths(item.id)[lang]}`);
      assert.equal(crumbs.itemListElement.length, category.id === 'soups' ? 4 : 3);
      const mi = lds.find((x) => x['@type'] === 'MenuItem');
      assert.equal(mi.name, item.display?.[lang] ?? item.name);
      const prices = (Array.isArray(mi.offers) ? mi.offers : [mi.offers]).map((o: { price: string }) => o.price);
      const expected = item.variants ? item.variants.map((v) => (v.price / 100).toFixed(2)) : [(item.price! / 100).toFixed(2)];
      assert.deepEqual(prices, expected, `${item.id} schema prices`);
      for (const v of item.variants ?? [{ price: item.price! }]) assert.ok(html.includes(formatPrice(v.price)), `${item.id} visible price`);
      assert.ok(!/aggregateRating|"Review"/.test(html), `${item.id} rating markup`);
      // Declarations shown plainly in Afrolink's voice; otherwise an invitation to ask.
      const info = publicAllergenInfo(item.id);
      const panel = html.slice(html.indexOf('data-allergen='), html.indexOf('data-allergen=') + 3000);
      if (info.allergens.length + info.additives.length > 0) {
        assert.ok(panel.startsWith('data-allergen="listed"'), `${item.id} state`);
        for (const x of [...info.allergens, ...info.additives]) assert.ok(panel.includes(x.label[lang]), `${item.id} lacks ${x.label[lang]} (${lang})`);
      } else {
        assert.ok(panel.startsWith('data-allergen="ask"'), `${item.id} state`);
        assert.ok(html.includes(pagesUi[lang].allergen.noInfo), `${item.id} missing invitation to ask (${lang})`);
      }
      assert.ok(html.includes(pagesUi[lang].allergen.help), `${item.id} missing help line (${lang})`);
    }
  }
});

test('internal links: header links to dedicated pages; menu page links every dish; dish pages link back', opt, () => {
  for (const lang of locales) {
    const home = read(routes.home[lang]);
    for (const k of ['menu', 'delivery', 'catering', 'reservations', 'gallery', 'contact'] as const) {
      assert.ok(home.includes(`href="${routes[k][lang]}"`), `home ${lang} → ${k}`);
    }
    const menu = read(routes.menu[lang]);
    for (const { item } of items) assert.ok(menu.includes(`href="${dishPaths(item.id)[lang]}"`), `menu ${lang} → ${item.id}`);
    const soups = read(routes.soups[lang]);
    for (const i of foodMenu.find((c) => c.id === 'soups')!.items) assert.ok(soups.includes(`href="${dishPaths(i.id)[lang]}"`), `soups → ${i.id}`);
    for (const { item } of items) assert.ok(read(dishPaths(item.id)[lang]).includes(`href="${routes.menu[lang]}"`), `${item.id} → menu`);
  }
});

test('every photographed dish opens a large image in the lightbox', opt, () => {
  for (const lang of locales) {
    const menu = read(routes.menu[lang]);
    const zoom = menu.match(/data-lb data-lb-group="menu"/g) ?? [];
    assert.equal(zoom.length, 35, `menu ${lang} zoomable images`);
    assert.ok(read(routes.gallery[lang]).includes('data-lb-group="gallery"'));
  }
});

test('service pages state only arranged terms (no fees, times, radius or online payment offers)', opt, () => {
  for (const lang of locales) {
    for (const k of ['delivery', 'catering', 'reservations'] as const) {
      const text = read(routes[k][lang]).replace(/<[^>]+>/g, ' ');
      assert.ok(!/\d+\s?(km|min)\b|€\s?\d+[,.]?\d*\s*(Liefer|delivery|livraison)|Mindestbestellwert|minimum order/i.test(text), `${k} ${lang}`);
    }
  }
});

test('sitemap contains every page once, robots excludes management and API', opt, () => {
  const xml = readFileSync('dist/client/sitemap.xml', 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, 141);
  assert.equal(new Set(locs).size, 141);
  for (const p of allPages()) assert.ok(locs.includes(`${SITE}${p.path}`), p.path);
  const robots = readFileSync('dist/client/robots.txt', 'utf8');
  assert.match(robots, /Disallow: \/admin\//);
  assert.match(robots, /Disallow: \/api\//);
  assert.ok(!fixed.some((k) => robots.includes(routes[k].de)), 'discovery pages are not disallowed');
});

test('extras: exactly the approved items, each €4.00 with its own image and content', () => {
  const extras = foodMenu.find((c) => c.id === 'extras')!;
  assert.deepEqual(extras.items.map((i) => i.id), ['extra-pounded-yam', 'extra-garri', 'extra-rice', 'extra-yam']);
  const files = new Set<string>();
  for (const i of extras.items) {
    assert.equal(i.price, 400, i.id);
    assert.ok(dishImages[i.id], `${i.id} image`);
    assert.ok(!files.has(dishImages[i.id].file), `${i.id} duplicate image`);
    files.add(dishImages[i.id].file);
    assert.ok(dishContent[i.id], `${i.id} content`);
  }
});

test('every category shows the real number of dishes (all languages)', opt, () => {
  for (const lang of locales) {
    const html = read(routes.menu[lang]);
    for (const c of foodMenu) {
      const start = html.indexOf(`id="${c.id}"`);
      const next = foodMenu[foodMenu.indexOf(c) + 1];
      const end = next ? html.indexOf(`id="${next.id}"`, start) : html.indexOf('id="drinks"', start);
      const section = html.slice(start, end);
      const cards = (section.match(/<li class="dish"/g) ?? []).length;
      assert.equal(cards, c.items.length, `${lang} ${c.id} cards`);
      const count = section.match(/class="mcat__count"[^>]*>([^<]+)</)![1];
      assert.match(count, new RegExp(`^${c.items.length} `), `${lang} ${c.id} count label "${count}"`);
    }
  }
});

/* ───────────── Brand voice (owner instruction 2026-10-10) ───────────── */

const BANNED = [
  /bisherigen Afrolink-Speisekarte/i, /früheren Speisekarte/i, /Abgleich mit der aktuellen Rezeptur/i,
  /previous menu/i, /historical declaration/i, /source status/i, /unverified historical/i, /independently verified/i,
  /ancienne carte/i, /ancien menu/i, /déclaration issue/i,
  /Laut unserer (Speise)?karte/i, /according to our menu/i, /selon notre carte/i,
  /noch keine geprüfte/i, /not yet available on this website/i, /in Prüfung/i, /being verified/i, /en cours de vérification/i,
  /keine Live-Anzeige/i, /not a live display/i, /Beschreibungen laut/i, /Descriptions from the Afrolink menu/i,
  /previous-menu/, /not-declared/,
];

test('no internal-audit or provenance wording anywhere in the public site', opt, () => {
  const pages: string[] = [];
  const w = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) w(p); else if (f === 'index.html') pages.push(p); } };
  w('dist/client');
  assert.ok(pages.length >= 141);
  for (const p of pages) {
    if (p.includes('admin')) continue;
    const h = readFileSync(p, 'utf8');
    for (const re of BANNED) assert.ok(!re.test(h), `${p} contains ${re}`);
  }
});

test('internal records keep the original Afrolink codes and sources', () => {
  assert.equal(historicalRegister.length, 29);
  assert.ok(HISTORICAL_CODES['7'].original.includes('möglich'));
  assert.equal(historicalRegister.find((h) => h.currentId === 'pepper-soup')?.menuNo, '22');
});

/* ───────────── Mackerel Fish Slices (owner brief 2026-10-10) ───────────── */

test('Mackerel Fish Slices: €5 per slice in Fish, nothing included, sides optional, fish allergen', () => {
  const fish = foodMenu.find((c) => c.id === 'fish')!;
  const m = fish.items.find((i) => i.id === 'mackerel-fish-slices')!;
  assert.ok(m, 'in the Fish category');
  assert.equal(m.price, 500);
  assert.equal(m.variants, undefined);
  assert.deepEqual(m.display, { de: 'Makrelenstücke', en: 'Mackerel Fish Slices', fr: 'Tranches de maquereau' });
  assert.deepEqual(m.priceUnit, { de: 'pro Stück', en: 'per slice', fr: 'la tranche' });
  for (const l of locales) {
    assert.match(m.description![l], /(ohne Beilage|without sides|sans accompagnement)/);
    assert.match(m.note![l], /(Wunsch|request|demande)/);
    assert.ok(!/€|EUR/.test(m.note![l]), `${l}: no accompaniment price may be shown`);
    assert.match(dishContent[m.id].summary[l], /5/);
  }
  assert.equal(dishImages[m.id].file, 'menu/mackerel-fish-slices.jpg');
  const info = publicAllergenInfo(m.id);
  assert.deepEqual(info.allergens.map((a) => a.code), ['D']);
  // existing fish items untouched
  assert.deepEqual(fish.items.map((i) => [i.id, i.price ?? i.variants?.map((v) => v.price)]), [
    ['tilapia', [2500, 3000]],
    ['fried-fish-plantain', 1800],
    ['mackerel-fish-slices', 500],
  ]);
});

test('Mackerel pages: localized names, per-slice price, UnitPriceSpecification', opt, () => {
  const names = { de: 'Makrelenstücke', en: 'Mackerel Fish Slices', fr: 'Tranches de maquereau' } as const;
  const units = { de: 'pro Stück', en: 'per slice', fr: 'la tranche' } as const;
  for (const lang of locales) {
    const html = read(dishPaths('mackerel-fish-slices')[lang]);
    assert.match(html.replaceAll(String.fromCharCode(0xad), ''), new RegExp(`<h1 class="dp__title"[^>]*>${names[lang]}</h1>`));
    assert.ok(html.includes(units[lang]), `${lang} unit`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((x) => JSON.parse(x[1]));
    const mi = ld.find((x) => x['@type'] === 'MenuItem');
    assert.equal(mi.name, names[lang]);
    assert.equal(mi.offers.price, '5.00');
    assert.equal(mi.offers.priceSpecification.referenceQuantity.value, 1);
    const menu = read(routes.menu[lang]);
    const card = menu.slice(menu.indexOf('id="dish-mackerel-fish-slices"'), menu.indexOf('id="dish-mackerel-fish-slices"') + 4000);
    assert.ok(card.replaceAll(String.fromCharCode(0xad), '').includes(names[lang]) && card.includes('€5') && card.includes(units[lang]), `${lang} card`);
  }
});
