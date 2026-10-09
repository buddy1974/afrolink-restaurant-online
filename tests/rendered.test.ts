/**
 * Checks on the BUILT site (run `npm run build` first): every localized page exists with the
 * right lang/hreflang, no mixed-language chrome, no rating markup, no third-party iframe before play.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const built = existsSync('dist/client/index.html');
const opt = { skip: !built && 'run `npm run build` first' };

const pages: Record<string, { file: string; lang: string }> = {
  home_de: { file: 'index.html', lang: 'de-DE' },
  home_en: { file: 'en/index.html', lang: 'en' },
  home_fr: { file: 'fr/index.html', lang: 'fr' },
  imprint_de: { file: 'impressum/index.html', lang: 'de-DE' },
  imprint_en: { file: 'en/imprint/index.html', lang: 'en' },
  imprint_fr: { file: 'fr/mentions-legales/index.html', lang: 'fr' },
  privacy_de: { file: 'datenschutz/index.html', lang: 'de-DE' },
  privacy_en: { file: 'en/privacy/index.html', lang: 'en' },
  privacy_fr: { file: 'fr/confidentialite/index.html', lang: 'fr' },
  allergens_de: { file: 'allergene/index.html', lang: 'de-DE' },
  allergens_en: { file: 'en/allergens/index.html', lang: 'en' },
  allergens_fr: { file: 'fr/allergenes/index.html', lang: 'fr' },
};

const read = (f: string) => readFileSync(join('dist', 'client', f), 'utf8');
const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

test('all 12 localized pages exist with correct <html lang> and hreflang alternates', opt, () => {
  for (const [name, p] of Object.entries(pages)) {
    assert.ok(existsSync(join('dist', 'client', p.file)), `${name} missing`);
    const html = read(p.file);
    assert.match(html, new RegExp(`<html lang="${p.lang}"`), `${name} lang`);
    for (const hl of ['de-DE', 'en', 'fr', 'x-default']) assert.ok(html.includes(`hreflang="${hl}"`), `${name} hreflang ${hl}`);
  }
});

test('home pages carry exact contact data, all prices and no rating markup', opt, () => {
  for (const f of ['index.html', 'en/index.html', 'fr/index.html']) {
    const html = read(f);
    for (const must of ['Berzeliusstraße 7', '45144 Essen', '0201 84674196', '+49 1521 7130788', 'tel:+4920184674196', 'tel:+4915217130788', 'https://wa.me/4920184674196']) {
      assert.ok(html.includes(must), `${f} missing ${must}`);
    }
    assert.equal((html.match(/class="line__price[^"]*"/g) ?? []).length, 33, `${f} food price lines`);
    assert.equal((html.match(/class="drow__price[^"]*"/g) ?? []).length, 28, `${f} drink price lines`);
    assert.ok(!/aggregateRating|ratingValue|"review"/i.test(html), `${f} rating markup`);
    assert.ok(!/<iframe/i.test(html), `${f} iframe before play`);
  }
});

test('no mixed-language interface chrome on EN/FR pages', opt, () => {
  const germanUi = ['Speisekarte ansehen', 'Tisch reservieren', 'Öffnungszeiten', 'Bewertungen', 'Anfrage zusammenstellen'];
  const englishUi = ['View the menu', 'Book a table', 'Opening hours', 'Put your enquiry together'];
  const en = visibleText(read('en/index.html'));
  const fr = visibleText(read('fr/index.html'));
  const de = visibleText(read('index.html'));
  for (const s of germanUi) {
    assert.ok(!en.includes(s), `EN page contains German UI "${s}"`);
    assert.ok(!fr.includes(s), `FR page contains German UI "${s}"`);
  }
  for (const s of englishUi) {
    assert.ok(!de.includes(s), `DE page contains English UI "${s}"`);
    assert.ok(!fr.includes(s), `FR page contains English UI "${s}"`);
  }
});

test('EN/FR allergen pages link to the German (legally relevant) version', opt, () => {
  for (const f of ['en/allergens/index.html', 'fr/allergenes/index.html']) assert.ok(read(f).includes('href="/allergene/"'), f);
});

test('legal pages show the incompleteness notice while operator data is missing', opt, () => {
  assert.match(visibleText(read('impressum/index.html')), /Angabe ausstehend/);
  assert.match(visibleText(read('impressum/index.html')), /unvollständig/);
});

test('sitemap lists all localized URLs', opt, () => {
  const xml = read('sitemap.xml');
  // 11 fixed routes + 31 dish pages, each in three languages (details: tests/discovery.test.ts).
  assert.equal((xml.match(/<loc>/g) ?? []).length, 126);
});
