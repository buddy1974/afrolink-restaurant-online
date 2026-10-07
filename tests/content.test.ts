/**
 * Content integrity: the data files must match Marcel's brief (2026-10-07) exactly.
 * If the restaurant changes a price, update BOTH the data file and this expectation.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { foodMenu } from '../src/data/menu.ts';
import { drinksMenu } from '../src/data/drinks.ts';
import { openingHours, groupHours } from '../src/data/hours.ts';
import { business, phones, whatsapp, services } from '../src/data/business.ts';
import { formatPrice } from '../src/data/format.ts';

const flatFood = () =>
  foodMenu.flatMap((c) =>
    c.items.flatMap((i) =>
      i.variants
        ? i.variants.map((v) => `${c.title}|${i.name}, ${v.label}|${formatPrice(v.price)}`)
        : [`${c.title}|${i.name}|${formatPrice(i.price!)}`],
    ),
  );

test('food menu matches the brief exactly', () => {
  assert.deepEqual(flatFood(), [
    'Soups|Egusi Soup|€15',
    'Soups|Afang Soup|€17',
    'Soups|Edikaikong|€17',
    'Soups|Ogbono Soup|€15',
    'Soups|Ofe Nsala|€17',
    'Soups|Okra Soup|€15',
    'Soups|Banga Soup|€17',
    'Soups|Efo Riro|€17',
    'Soups|Bitterleaf Soup|€15',
    "Soups|Fisherman's Soup|€20",
    'Soups|Black Soup|€17',
    'Soups|Oha Soup|€15',
    'Rice|Fried Rice|€17',
    'Rice|Jollof Rice|€15',
    'Rice|White Rice|€15',
    'Rice|Coconut Rice|€17',
    'Beans, Yam & Plantain|Beans & Plantain|€17',
    'Beans, Yam & Plantain|Porridge Yam|€17',
    'Beans, Yam & Plantain|Fried Yam & Egg Sauce|€15',
    'Beans, Yam & Plantain|Assorted Plate with Yam or Plantain|€17',
    'Specialities|Suya|€17',
    'Specialities|Pepper Soup|€15',
    'Specialities|Stockfish|€17',
    'Specialities|Snail|€20',
    'Specialities|Okpa|€20',
    'Specialities|Abacha|€17',
    'Specialities|Nkwobi|€17',
    'Specialities|Isiewu, Small Plate|€18',
    'Specialities|Isiewu, Big Plate|€35',
    'Fish|Tilapia, Medium|€25',
    'Fish|Tilapia, Large|€30',
    'Fish|Fried Fish & Plantain|€18',
    'Extras|Extra Pounded Yam|€4',
  ]);
});

test('food notes and labels match the brief', () => {
  const all = foodMenu.flatMap((c) => c.items);
  const by = (n: string) => all.find((i) => i.name === n)!;
  assert.equal(by("Fisherman's Soup").label, 'On request only');
  assert.equal(by('Assorted Plate with Yam or Plantain').note, 'Served with mixed meat.');
  assert.equal(by('Pepper Soup').note, 'Served with rice or yam.');
  assert.equal(all.filter((i) => i.note).length, 2);
  assert.equal(all.filter((i) => i.label).length, 1);
});

test('drinks menu matches the brief exactly', () => {
  const flat = drinksMenu.flatMap((c) =>
    c.items.map((d) => `${c.title}|${d.name}|${formatPrice(d.price, 'always')}|${d.size?.value ?? ''}`),
  );
  assert.deepEqual(flat, [
    'Beer|Guinness|€3.50|0,33 L',
    'Beer|Krombacher|€2.00|0,5 L',
    'Beer|Warsteiner|€2.00|0,5 L',
    'Beer|Becks|€3.00|0,5 L',
    'Beer|Diebels|€2.00|0,5 L',
    'Beer|Desperados|€3.50|0,5 L',
    'Beer|Malzbier|€2.00|0,5 L',
    'Beer|Heineken|€3.50|0,33 L',
    'Soft Drinks|Cola Light|€2.00|0,2 L',
    'Soft Drinks|Sprite|€2.00|0,2 L',
    'Soft Drinks|Fanta|€2.00|0,2 L',
    'Soft Drinks|Red Bull|€3.00|0,2 L',
    'Soft Drinks|Water|€1.00|0,33 L',
    'Wine|Glass|€3.50|0,2 L',
    'Wine|Wine / Sekt, Bottle|€20.00|',
    "Spirits|Jack Daniel's|€5.00|0,2 L",
    'Spirits|Hennessy|€5.00|0,2 L',
    'Spirits|Vodka|€5.00|0,2 L',
    'Spirits|Baileys Cream|€5.00|0,2 L',
    'Spirits|Liqueur|€5.00|0,2 L',
    'Spirits|Chivas Regal|€5.00|0,2 L',
    'Spirits|Chantre|€3.00|0,2 L',
    'Bottles|Hennessy|€80.00|',
    "Bottles|Jack Daniel's|€50.00|",
    'Bottles|Chantre|€25.00|',
    'Bottles|Champagne Moët Impérial|€80.00|',
    'Bottles|Rosé Moët|€80.00|',
    'Bottles|Ciroc|€60.00|',
  ]);
});

test('spirit serving sizes are flagged unverified, not silently corrected', () => {
  const spirits = drinksMenu.find((c) => c.id === 'spirits')!;
  for (const s of spirits.items) assert.deepEqual(s.size, { value: '0,2 L', verified: false });
});

test('hot drinks slot exists but contains no invented products', () => {
  const hot = drinksMenu.find((c) => c.id === 'hot-drinks');
  assert.ok(hot);
  assert.equal(hot.items.length, 0);
});

test('opening hours are exact and grouped correctly', () => {
  assert.deepEqual(
    openingHours.map((h) => `${h.day} ${h.opens}-${h.closes}`),
    [
      'Monday 15:00-00:00',
      'Tuesday 15:00-00:00',
      'Wednesday 15:00-00:00',
      'Thursday 15:00-00:00',
      'Friday 15:00-01:00',
      'Saturday 15:00-01:00',
      'Sunday 16:00-00:00',
    ],
  );
  assert.deepEqual(
    groupHours().map((g) => `${g.label} ${g.opens}-${g.closes}`),
    ['Monday – Thursday 15:00-00:00', 'Friday – Saturday 15:00-01:00', 'Sunday 16:00-00:00'],
  );
});

test('contact data is exact', () => {
  assert.equal(business.address.street, 'Berzeliusstraße 7');
  assert.equal(`${business.address.postalCode} ${business.address.city}`, '45144 Essen');
  assert.equal(phones.landline.display, '0201 84674196');
  assert.equal(phones.landline.international, '+49 201 84674196');
  assert.equal(phones.landline.href, 'tel:+4920184674196');
  assert.equal(phones.mobile.display, '+49 1521 7130788');
  assert.equal(phones.mobile.href, 'tel:+4915217130788');
  assert.equal(whatsapp.href, 'https://wa.me/4920184674196');
});

test('services never advertise delivery', () => {
  assert.ok(!services.some((s) => /deliver|liefer/i.test(s)));
});

test('rendered page claims no delivery, ratings or reviews', { skip: !existsSync('dist/index.html') && 'run `npm run build` first' }, () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/g, (m) => (m.includes('application/ld+json') ? m : '')).toLowerCase();
  assert.ok(!/deliver|lieferung|lieferdienst/.test(text), 'page mentions delivery');
  assert.ok(!/aggregaterating|ratingvalue|"review"/.test(text), 'page contains rating/review markup');
  for (const must of ['berzeliusstraße 7', '45144 essen', '0201 84674196', '+49 1521 7130788', 'tel:+4920184674196', 'tel:+4915217130788', 'https://wa.me/4920184674196', 'https://www.afrolink-restaurant.online/']) {
    assert.ok(text.includes(must), `page is missing ${must}`);
  }
});
