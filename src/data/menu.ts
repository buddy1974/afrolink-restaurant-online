/**
 * FOOD MENU — current source of truth (Marcel's brief, 2026-10-07).
 *
 * Rules:
 * - Do not restore dishes from older printed menus.
 * - Do not invent dishes or descriptions.
 * - Prices are stored in euro cents to avoid rounding drift.
 * - `available: false` hides a dish without deleting its data.
 */

export interface MenuVariant {
  label: string;
  price: number; // cents
}

export interface MenuItem {
  name: string;
  /** Price in cents. Omit when the item uses `variants`. */
  price?: number;
  variants?: MenuVariant[];
  /** Short supporting line, only when supplied by the restaurant. */
  note?: string;
  /** Small status tag, e.g. "On request only". */
  label?: string;
  available?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export const foodMenu: MenuCategory[] = [
  {
    id: 'soups',
    title: 'Soups',
    items: [
      { name: 'Egusi Soup', price: 1500 },
      { name: 'Afang Soup', price: 1700 },
      { name: 'Edikaikong', price: 1700 },
      { name: 'Ogbono Soup', price: 1500 },
      { name: 'Ofe Nsala', price: 1700 },
      { name: 'Okra Soup', price: 1500 },
      { name: 'Banga Soup', price: 1700 },
      { name: 'Efo Riro', price: 1700 },
      { name: 'Bitterleaf Soup', price: 1500 },
      { name: "Fisherman's Soup", price: 2000, label: 'On request only' },
      { name: 'Black Soup', price: 1700 },
      { name: 'Oha Soup', price: 1500 },
    ],
  },
  {
    id: 'rice',
    title: 'Rice',
    items: [
      { name: 'Fried Rice', price: 1700 },
      { name: 'Jollof Rice', price: 1500 },
      { name: 'White Rice', price: 1500 },
      { name: 'Coconut Rice', price: 1700 },
    ],
  },
  {
    id: 'beans-yam-plantain',
    title: 'Beans, Yam & Plantain',
    items: [
      { name: 'Beans & Plantain', price: 1700 },
      { name: 'Porridge Yam', price: 1700 },
      { name: 'Fried Yam & Egg Sauce', price: 1500 },
      { name: 'Assorted Plate with Yam or Plantain', price: 1700, note: 'Served with mixed meat.' },
    ],
  },
  {
    id: 'specialities',
    title: 'Specialities',
    items: [
      { name: 'Suya', price: 1700 },
      { name: 'Pepper Soup', price: 1500, note: 'Served with rice or yam.' },
      { name: 'Stockfish', price: 1700 },
      { name: 'Snail', price: 2000 },
      { name: 'Okpa', price: 2000 },
      { name: 'Abacha', price: 1700 },
      { name: 'Nkwobi', price: 1700 },
      {
        name: 'Isiewu',
        variants: [
          { label: 'Small Plate', price: 1800 },
          { label: 'Big Plate', price: 3500 },
        ],
      },
    ],
  },
  {
    id: 'fish',
    title: 'Fish',
    items: [
      {
        name: 'Tilapia',
        variants: [
          { label: 'Medium', price: 2500 },
          { label: 'Large', price: 3000 },
        ],
      },
      { name: 'Fried Fish & Plantain', price: 1800 },
    ],
  },
  {
    id: 'extras',
    title: 'Extras',
    items: [{ name: 'Extra Pounded Yam', price: 400 }],
  },
];
