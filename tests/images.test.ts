/**
 * Dish image mapping (approved design 2026-10-09): owner-named images per dish, placeholders otherwise.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dishImages, heroImage, vegetableSoupFeature } from '../src/data/dish-images.ts';
import { foodMenu } from '../src/data/menu.ts';
import { ui } from '../src/i18n/ui.ts';

const ids = new Set(foodMenu.flatMap((c) => c.items.map((i) => i.id)));

test('every mapped image belongs to a real menu item and exists on disk', () => {
  for (const [id, img] of Object.entries(dishImages)) {
    assert.ok(ids.has(id), `${id} is not a menu item`);
    assert.ok(existsSync(`src/assets/${img.file}`), `${img.file} missing`);
    for (const l of ['de', 'en', 'fr'] as const) assert.ok(img.alt[l], `${id} alt ${l}`);
  }
  assert.ok(existsSync(`src/assets/${vegetableSoupFeature.file}`));
});

test('owner-requested image assignments', () => {
  assert.equal(heroImage.file, 'menu/egusi-soup.jpg');
  assert.equal(dishImages['egusi-soup'].file, 'menu/egusi-soup.jpg');
  assert.equal(dishImages['jollof-rice'].file, 'menu/jollof.jpg');
  assert.equal(dishImages['tilapia'].file, 'menu/tilapia.jpg');
  assert.equal(dishImages['assorted-plate'].file, 'menu/assorted.jpg');
  assert.equal(vegetableSoupFeature.file, 'menu/vegetable-soup.jpg');
});

test('every soup and rice dish uses the image named for it (or none)', () => {
  const expected: Record<string, string> = {
    'egusi-soup': 'menu/egusi-soup.jpg',
    'afang-soup': 'menu/afang-soup.jpg',
    edikaikong: 'menu/edikaikong.jpg',
    'ogbono-soup': 'menu/ogbono-soup.jpg',
    'ofe-nsala': 'menu/ofe-nsala.jpg',
    'okra-soup': 'menu/okra-soup.jpg',
    'banga-soup': 'menu/banga-soup.jpg',
    'efo-riro': 'menu/efo-riro.jpg',
    'bitterleaf-soup': 'menu/bitterleaf-soup.jpg',
    'fishermans-soup': 'menu/fishermans-soup.jpg',
    'black-soup': 'menu/black-soup.jpg',
    'oha-soup': 'menu/oha-soup.jpg',
    'fried-rice': 'menu/fried-rice.jpg',
    'jollof-rice': 'menu/jollof.jpg',
    'white-rice': 'menu/white-rice-stew.jpg',
  };
  for (const c of foodMenu.filter((c) => c.id === 'soups' || c.id === 'rice')) {
    for (const i of c.items) {
      if (expected[i.id]) assert.equal(dishImages[i.id]?.file, expected[i.id], i.id);
      else assert.equal(dishImages[i.id], undefined, `${i.id} has an image but no named source file`);
    }
  }
});

test('soups are stated to be served with pounded yam or garri (all languages)', () => {
  const soups = foodMenu.find((c) => c.id === 'soups')!;
  assert.match(soups.note!.de, /Pounded Yam oder Garri/);
  assert.match(soups.note!.en, /pounded yam or garri/);
  assert.match(soups.note!.fr, /pounded yam ou du garri/);
});

test('diabetes enquiry makes no medical or nutritional promise', () => {
  for (const l of ['de', 'en', 'fr'] as const) {
    const txt = ui[l].dietary.diabetesText;
    assert.match(txt, /(keine medizinischen|no medical|aucune garantie médicale)/i, `${l} lacks the no-guarantee statement`);
    assert.ok(!/(diabetikergeeignet|diabetic-friendly|sugar-free|zuckerfrei|sans sucre|garant(iert|eed))/i.test(txt.replace(/aucune garantie/i, '')), `${l} contains a promise`);
    assert.ok(ui[l].enquiry.types.diabetes);
  }
});

test('rendered menu: placeholders exactly for dishes without an image', { skip: !existsSync('dist/index.html') && 'build first' }, () => {
  const total = foodMenu.reduce((n, c) => n + c.items.filter((i) => i.available !== false).length, 0);
  const withImage = Object.keys(dishImages).length;
  for (const f of ['index.html', 'en/index.html', 'fr/index.html']) {
    const html = readFileSync(`dist/${f}`, 'utf8');
    assert.equal((html.match(/class="dish__soon"/g) ?? []).length, total - withImage, `${f} placeholders`);
    assert.equal((html.match(/<li class="dish"/g) ?? []).length, total, `${f} dish cards`);
  }
});
