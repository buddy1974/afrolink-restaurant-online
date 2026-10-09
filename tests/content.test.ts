/**
 * Content integrity: the data files must match the owner's briefs exactly.
 * Menu/prices: brief 2026-10-07. Hours, social, delivery: brief 2026-10-08.
 * If the restaurant changes a price, update BOTH the data file and this expectation.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { foodMenu } from '../src/data/menu.ts';
import { drinksMenu } from '../src/data/drinks.ts';
import { openingHours, groupHours } from '../src/data/hours.ts';
import { business, phones, whatsapp, services, social, google } from '../src/data/business.ts';
import { featuredVideo, videos } from '../src/data/videos.ts';
import { formatPrice } from '../src/data/format.ts';
import { ui } from '../src/i18n/ui.ts';

test('food menu matches the brief exactly (names, categories, prices)', () => {
  const flat = foodMenu.flatMap((c) =>
    c.items.flatMap((i) =>
      i.variants
        ? i.variants.map((v) => `${c.title.en}|${i.name}, ${v.labelEn}|${formatPrice(v.price)}`)
        : [`${c.title.en}|${i.name}|${formatPrice(i.price!)}`],
    ),
  );
  assert.deepEqual(flat, [
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
    'Extras|Extra Garri|€4',
    'Extras|Extra Rice|€4',
    'Extras|Extra Yam|€4',
  ]);
});

test('notes and labels from the brief are preserved (English)', () => {
  const all = foodMenu.flatMap((c) => c.items);
  const by = (n: string) => all.find((i) => i.name === n)!;
  assert.equal(by("Fisherman's Soup").label?.en, 'On request only');
  assert.equal(by('Assorted Plate with Yam or Plantain').note?.en, 'Served with mixed meat.');
  assert.equal(by('Pepper Soup').note?.en, 'Served with rice or yam.');
});

test('descriptions only from the printed menu; spice only where the menu says "scharf"', () => {
  const all = foodMenu.flatMap((c) => c.items);
  for (const i of all) {
    if (i.description) assert.equal(i.descriptionSource, 'printed-menu-2026', `${i.name} description without source`);
    if (i.spice) assert.match(i.description?.de ?? '', /scharf/i, `${i.name} marked hot without menu basis`);
  }
  assert.deepEqual(
    all.filter((i) => i.spice).map((i) => i.name),
    ['Pepper Soup', 'Nkwobi'],
  );
});

test('menu item ids are unique and stable', () => {
  const ids = [...foodMenu.flatMap((c) => c.items.map((i) => i.id)), ...drinksMenu.flatMap((c) => c.items.map((i) => i.id))];
  assert.equal(new Set(ids).size, ids.length);
});

test('drinks menu matches the brief exactly', () => {
  const flat = drinksMenu.flatMap((c) =>
    c.items.map((d) => `${c.title.en}|${d.name}|${formatPrice(d.price, 'always')}|${d.size?.value ?? ''}`),
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

test('spirit serving sizes stay as supplied and flagged unverified', () => {
  const spirits = drinksMenu.find((c) => c.id === 'spirits')!;
  for (const s of spirits.items) assert.deepEqual(s.size, { value: '0,2 L', verified: false });
});

test('hot drinks slot exists but contains no invented products', () => {
  assert.equal(drinksMenu.find((c) => c.id === 'hot-drinks')?.items.length, 0);
});

test('opening hours match the 2026-10-08 brief and group Tue–Thu / Fri–Sat / Sun–Mon', () => {
  assert.deepEqual(
    openingHours.map((h) => `${h.day} ${h.opens}-${h.closes}`),
    [
      'Monday 16:00-00:00',
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
    ['Tuesday – Thursday 15:00-00:00', 'Friday – Saturday 15:00-01:00', 'Sunday – Monday 16:00-00:00'],
  );
});

test('contact data is exact', () => {
  assert.equal(business.address.street, 'Berzeliusstraße 7');
  assert.equal(`${business.address.postalCode} ${business.address.city}`, '45144 Essen');
  assert.equal(phones.landline.display, '0201 84674196');
  assert.equal(phones.landline.href, 'tel:+4920184674196');
  assert.equal(phones.mobile.display, '+49 1521 7130788');
  assert.equal(phones.mobile.href, 'tel:+4915217130788');
  assert.equal(whatsapp.href, 'https://wa.me/4920184674196');
});

test('social profiles and Google link match the 2026-10-08 brief; Instagram flagged unverified', () => {
  assert.deepEqual(
    social.map((s) => s.href),
    [
      'https://www.facebook.com/afrolink24',
      'https://www.instagram.com/afrolinkrestaurant',
      'https://www.tiktok.com/@afrolink_restaurant',
      'https://www.youtube.com/@afrolink45144',
    ],
  );
  assert.equal(social.find((s) => s.name === 'Instagram')?.verified, false);
  assert.equal(google.profileHref, 'https://share.google/4DyZ4gz5CwbrWi8qv');
});

test('Google rating is a dated manual snapshot from the owner screenshot', () => {
  assert.equal(google.rating, 4.6);
  assert.equal(google.reviewCount, 145);
  assert.match(google.asOf, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(google.source.length > 10);
});

test('delivery and catering are offered by arrangement (2026-10-08)', () => {
  assert.ok(services.includes('delivery'));
  assert.ok(services.includes('catering'));
});

test('videos: featured David On The Go, unique ids, official sources only', () => {
  assert.equal(featuredVideo.id, '51D8Zxd5_84');
  const all = [featuredVideo, ...videos];
  assert.equal(new Set(all.map((v) => v.id)).size, all.length);
  for (const v of videos.filter((v) => v.platform === 'facebook')) {
    assert.ok(v.url.startsWith('https://www.facebook.com/afrolink24/videos/'), v.url);
  }
});

test('every extra costs exactly €4', () => {
  const extras = foodMenu.find((c) => c.id === 'extras')!;
  assert.ok(extras.items.length > 0);
  for (const i of extras.items) {
    assert.equal(i.price, 400, i.id);
    assert.equal(i.variants, undefined, i.id);
  }
});

test('water stays €1.00 / 0,33 L and the notice says it is charged separately (DE/EN/FR)', () => {
  const water = drinksMenu.flatMap((c) => c.items).find((i) => i.id === 'water')!;
  assert.equal(water.price, 100);
  assert.equal(water.size?.value, '0,33 L');
  assert.match(ui.de.drinks.waterNote, /separat berechnet/);
  assert.match(ui.en.drinks.waterNote, /charged separately/);
  assert.match(ui.fr.drinks.waterNote, /facturée séparément/);
  for (const l of ['de', 'en', 'fr'] as const) {
    assert.ok(!/(muss|must|obligatoire|pflicht|required)/i.test(ui[l].drinks.waterNote), `${l} implies an obligation`);
  }
});
