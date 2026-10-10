/**
 * Safety-critical and content-integrity rules: translations, allergens, claims, reviews, legal.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ui } from '../src/i18n/ui.ts';
import { locales } from '../src/i18n/config.ts';
import { allergenRecords, ALLERGENS } from '../src/data/allergens.ts';
import { foodMenu } from '../src/data/menu.ts';
import { drinksMenu } from '../src/data/drinks.ts';
import { claims, publishableClaims } from '../src/data/claims.ts';
import { reviewExcerpts } from '../src/data/reviews.ts';
import { legal } from '../src/data/legal.ts';
import { gallery } from '../src/data/gallery.ts';

function keys(obj: unknown, prefix = ''): string[] {
  if (typeof obj === 'string') return [prefix];
  if (Array.isArray(obj)) return [`${prefix}[${obj.length}]`];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

test('every language provides every interface string (no gaps, no empty strings)', () => {
  const ref = keys(ui.de).sort();
  for (const lang of locales) {
    assert.deepEqual(keys(ui[lang]).sort(), ref, `${lang} keys differ`);
    const empty = keys(ui[lang]).filter((k) => {
      const v = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown>)?.[p.replace(/\[\d+\]$/, '')], ui[lang]);
      return typeof v === 'string' && !v.trim();
    });
    assert.deepEqual(empty, [], `${lang} has empty strings`);
  }
});

test('localized data has all three languages (categories, gallery alts)', () => {
  for (const c of [...foodMenu, ...drinksMenu]) for (const l of locales) assert.ok(c.title[l], `${c.id} title ${l}`);
  for (const g of gallery) for (const l of locales) assert.ok(g.alt[l], `${g.file} alt ${l}`);
});

test('14 regulated allergen groups (LMIV Annex II) are defined', () => {
  assert.equal(ALLERGENS.length, 14);
  assert.deepEqual(
    ALLERGENS.map((a) => a.code),
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
  );
});

test('every menu item and drink has exactly one allergen record', () => {
  const ids = [...foodMenu.flatMap((c) => c.items.map((i) => i.id)), ...drinksMenu.flatMap((c) => c.items.map((i) => i.id))];
  assert.deepEqual(allergenRecords.map((r) => r.itemId).sort(), [...ids].sort());
});

test('no allergen/additive is declared without a verified kitchen sign-off', () => {
  for (const r of allergenRecords) {
    if (r.status === 'verified') {
      assert.ok(r.verifiedBy && r.verifiedOn, `${r.itemId} verified without sign-off`);
      assert.ok(Array.isArray(r.allergens) && Array.isArray(r.additives), `${r.itemId} verified without explicit lists`);
    } else {
      assert.equal(r.allergens, undefined, `${r.itemId} declares allergens while pending`);
      assert.equal(r.additives, undefined, `${r.itemId} declares additives while pending`);
    }
    for (const inv of r.investigate) assert.ok(inv.basis.trim().length > 3, `${r.itemId} investigation without basis`);
  }
});

test('only verified / owner-provided / attributed claims can be published', () => {
  for (const c of publishableClaims()) {
    assert.ok(c.enabled);
    assert.notEqual(c.status, 'awaiting');
    if (c.status === 'customer-opinion') assert.ok(c.attribution?.href, `${c.id} opinion without review link`);
  }
  for (const id of ['regulars-500', 'team-20-years', 'number-one']) {
    assert.ok(!publishableClaims().some((c) => c.id === id), `${id} must not be published yet`);
  }
  assert.ok(claims.every((c) => c.evidence.trim().length > 10), 'every claim needs evidence notes');
});

test('review excerpts, if any, are attributed and linked', () => {
  for (const r of reviewExcerpts) {
    assert.ok(r.author && r.href.startsWith('https://') && r.excerpt.length > 0);
    assert.ok(!/kardio|cardio|praxis/i.test(r.excerpt), 'cardiology-practice review must never be used');
  }
});

test('legal operator data is never guessed (null until supplied)', () => {
  for (const [k, v] of Object.entries(legal)) {
    if (typeof v === 'string') assert.ok(v.trim().length > 2, `${k} looks like a placeholder`);
  }
});

test('Impressum: no EU ODR link (platform closed 20 July 2025), no guessed operator data', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync('src/components/ImprintPage.astro', 'utf8') + readFileSync('src/i18n/legal-content.ts', 'utf8');
  assert.ok(!/ec\.europa\.eu\/consumers\/odr|ec\.europa\.eu\/odr/.test(src));
  assert.equal(legal.supervisoryAuthority === false && legal.operatorName === null, false, 'authority cannot be waived before the operator is known');
});
