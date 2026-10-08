/**
 * DRINKS MENU — current source of truth (Marcel's brief, 2026-10-07).
 * Prices in euro cents. Serving sizes kept exactly as the source states them.
 * `name` is the canonical name from the brief (brand names are never translated);
 * `display` localizes generic names such as "Glass".
 * Allergen / additive status per drink lives in src/data/allergens.ts.
 */
import type { L10n } from '../i18n/config';

export interface ServingSize {
  /** Display string exactly as supplied, e.g. "0,33 L". */
  value: string;
  /**
   * false = the source value is doubtful and awaits confirmation by the restaurant.
   * It is still shown as supplied; it is never silently "corrected".
   */
  verified: boolean;
}

export interface DrinkItem {
  /** Stable id used by allergen/additive records. */
  id: string;
  name: string;
  display?: L10n;
  price: number; // cents
  size?: ServingSize;
  available?: boolean;
}

export interface DrinkCategory {
  id: string;
  title: L10n;
  subtitle?: L10n;
  items: DrinkItem[];
}

const ok = (value: string): ServingSize => ({ value, verified: true });

/**
 * SPIRITS: the old source states 0,2 L per glass. This is probably wrong
 * (typical spirit measures are 2 cl / 4 cl) but must NOT be changed until the
 * restaurant confirms. To correct later, edit this one constant and set verified: true.
 */
const SPIRIT_GLASS: ServingSize = { value: '0,2 L', verified: false };

export const drinksMenu: DrinkCategory[] = [
  {
    id: 'beer',
    title: { de: 'Bier', en: 'Beer', fr: 'Bière' },
    items: [
      { id: 'guinness', name: 'Guinness', price: 350, size: ok('0,33 L') },
      { id: 'krombacher', name: 'Krombacher', price: 200, size: ok('0,5 L') },
      { id: 'warsteiner', name: 'Warsteiner', price: 200, size: ok('0,5 L') },
      { id: 'becks', name: 'Becks', price: 300, size: ok('0,5 L') },
      { id: 'diebels', name: 'Diebels', price: 200, size: ok('0,5 L') },
      { id: 'desperados', name: 'Desperados', price: 350, size: ok('0,5 L') },
      { id: 'malzbier', name: 'Malzbier', price: 200, size: ok('0,5 L') },
      { id: 'heineken', name: 'Heineken', price: 350, size: ok('0,33 L') },
    ],
  },
  {
    id: 'soft-drinks',
    title: { de: 'Softdrinks', en: 'Soft Drinks', fr: 'Boissons fraîches' },
    items: [
      { id: 'cola-light', name: 'Cola Light', price: 200, size: ok('0,2 L') },
      { id: 'sprite', name: 'Sprite', price: 200, size: ok('0,2 L') },
      { id: 'fanta', name: 'Fanta', price: 200, size: ok('0,2 L') },
      { id: 'red-bull', name: 'Red Bull', price: 300, size: ok('0,2 L') },
      { id: 'water', name: 'Water', display: { de: 'Wasser', en: 'Water', fr: 'Eau' }, price: 100, size: ok('0,33 L') },
    ],
  },
  {
    id: 'wine',
    title: { de: 'Wein', en: 'Wine', fr: 'Vin' },
    subtitle: { de: 'Rotwein / Weißwein', en: 'Red / white wine', fr: 'Vin rouge / blanc' },
    items: [
      { id: 'wine-glass', name: 'Glass', display: { de: 'Glas', en: 'Glass', fr: 'Verre' }, price: 350, size: ok('0,2 L') },
      {
        id: 'wine-sekt-bottle',
        name: 'Wine / Sekt, Bottle',
        display: { de: 'Wein / Sekt, Flasche', en: 'Wine / Sekt, bottle', fr: 'Vin / Sekt, bouteille' },
        price: 2000,
      },
    ],
  },
  {
    id: 'spirits',
    title: { de: 'Spirituosen', en: 'Spirits', fr: 'Spiritueux' },
    subtitle: { de: 'Im Glas', en: 'By the glass', fr: 'Au verre' },
    items: [
      { id: 'jack-daniels-glass', name: "Jack Daniel's", price: 500, size: SPIRIT_GLASS },
      { id: 'hennessy-glass', name: 'Hennessy', price: 500, size: SPIRIT_GLASS },
      { id: 'vodka-glass', name: 'Vodka', display: { de: 'Wodka', en: 'Vodka', fr: 'Vodka' }, price: 500, size: SPIRIT_GLASS },
      { id: 'baileys-glass', name: 'Baileys Cream', price: 500, size: SPIRIT_GLASS },
      { id: 'liqueur-glass', name: 'Liqueur', display: { de: 'Likör', en: 'Liqueur', fr: 'Liqueur' }, price: 500, size: SPIRIT_GLASS },
      { id: 'chivas-glass', name: 'Chivas Regal', price: 500, size: SPIRIT_GLASS },
      { id: 'chantre-glass', name: 'Chantre', price: 300, size: SPIRIT_GLASS },
    ],
  },
  {
    id: 'bottles',
    title: { de: 'Flaschen', en: 'Bottles', fr: 'Bouteilles' },
    items: [
      { id: 'hennessy-bottle', name: 'Hennessy', price: 8000 },
      { id: 'jack-daniels-bottle', name: "Jack Daniel's", price: 5000 },
      { id: 'chantre-bottle', name: 'Chantre', price: 2500 },
      { id: 'moet-imperial-bottle', name: 'Champagne Moët Impérial', price: 8000 },
      { id: 'moet-rose-bottle', name: 'Rosé Moët', price: 8000 },
      { id: 'ciroc-bottle', name: 'Ciroc', price: 6000 },
    ],
  },
  {
    // Architecture slot: no hot drinks supplied yet. Empty categories are not rendered.
    id: 'hot-drinks',
    title: { de: 'Heißgetränke', en: 'Hot Drinks', fr: 'Boissons chaudes' },
    items: [],
  },
];

export function allDrinkItems() {
  return drinksMenu.flatMap((c) => c.items.map((item) => ({ category: c, item })));
}
