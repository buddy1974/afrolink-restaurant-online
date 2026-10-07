/**
 * DRINKS MENU — current source of truth (Marcel's brief, 2026-10-07).
 * Prices in euro cents. Serving sizes kept exactly as the source states them.
 */

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
  name: string;
  price: number; // cents
  size?: ServingSize;
  available?: boolean;
}

export interface DrinkCategory {
  id: string;
  title: string;
  /** Optional line under the category title, e.g. "Rotwein / Weißwein". */
  subtitle?: string;
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
    title: 'Beer',
    items: [
      { name: 'Guinness', price: 350, size: ok('0,33 L') },
      { name: 'Krombacher', price: 200, size: ok('0,5 L') },
      { name: 'Warsteiner', price: 200, size: ok('0,5 L') },
      { name: 'Becks', price: 300, size: ok('0,5 L') },
      { name: 'Diebels', price: 200, size: ok('0,5 L') },
      { name: 'Desperados', price: 350, size: ok('0,5 L') },
      { name: 'Malzbier', price: 200, size: ok('0,5 L') },
      { name: 'Heineken', price: 350, size: ok('0,33 L') },
    ],
  },
  {
    id: 'soft-drinks',
    title: 'Soft Drinks',
    items: [
      { name: 'Cola Light', price: 200, size: ok('0,2 L') },
      { name: 'Sprite', price: 200, size: ok('0,2 L') },
      { name: 'Fanta', price: 200, size: ok('0,2 L') },
      { name: 'Red Bull', price: 300, size: ok('0,2 L') },
      { name: 'Water', price: 100, size: ok('0,33 L') },
    ],
  },
  {
    id: 'wine',
    title: 'Wine',
    subtitle: 'Rotwein / Weißwein',
    items: [
      { name: 'Glass', price: 350, size: ok('0,2 L') },
      { name: 'Wine / Sekt, Bottle', price: 2000 },
    ],
  },
  {
    id: 'spirits',
    title: 'Spirits',
    subtitle: 'By the glass',
    items: [
      { name: "Jack Daniel's", price: 500, size: SPIRIT_GLASS },
      { name: 'Hennessy', price: 500, size: SPIRIT_GLASS },
      { name: 'Vodka', price: 500, size: SPIRIT_GLASS },
      { name: 'Baileys Cream', price: 500, size: SPIRIT_GLASS },
      { name: 'Liqueur', price: 500, size: SPIRIT_GLASS },
      { name: 'Chivas Regal', price: 500, size: SPIRIT_GLASS },
      { name: 'Chantre', price: 300, size: SPIRIT_GLASS },
    ],
  },
  {
    id: 'bottles',
    title: 'Bottles',
    items: [
      { name: 'Hennessy', price: 8000 },
      { name: "Jack Daniel's", price: 5000 },
      { name: 'Chantre', price: 2500 },
      { name: 'Champagne Moët Impérial', price: 8000 },
      { name: 'Rosé Moët', price: 8000 },
      { name: 'Ciroc', price: 6000 },
    ],
  },
  {
    // Architecture slot: no hot drinks supplied yet. Empty categories are not rendered.
    id: 'hot-drinks',
    title: 'Hot Drinks',
    items: [],
  },
];
