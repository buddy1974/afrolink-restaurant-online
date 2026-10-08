/**
 * FOOD MENU — current source of truth (Marcel's brief, 2026-10-07).
 *
 * Rules:
 * - Do not restore dishes from older printed menus. Do not invent dishes, ingredients,
 *   spice levels, cooking times or availability.
 * - Dish `name` is the authentic name and is never translated.
 * - Prices are euro cents. `available: false` hides a dish without deleting it.
 * - `description` comes ONLY from Afrolink's own printed menu (2026, German); EN/FR are
 *   translations of that text. Source and status are recorded in `descriptionSource`.
 *   Descriptions are not allergen declarations — see src/data/allergens.ts.
 * - `spice: 'hot'` only where Afrolink's own menu says "scharf".
 */
import type { L10n } from '../i18n/config';

export interface MenuVariant {
  label: L10n;
  /** Canonical English label (kept for content tests / schema.org). */
  labelEn: string;
  price: number; // cents
}

export interface MenuItem {
  /** Stable id used by allergen records and anchors. Never change once published. */
  id: string;
  name: string;
  price?: number;
  variants?: MenuVariant[];
  /** Short supporting line supplied in the 2026-10-07 brief. */
  note?: L10n;
  /** Small status tag, e.g. "On request only". */
  label?: L10n;
  description?: L10n;
  descriptionSource?: 'printed-menu-2026';
  spice?: 'hot';
  available?: boolean;
}

export interface MenuCategory {
  id: string;
  title: L10n;
  /**
   * Genuine Afrolink photo (file in src/assets/gallery) of a dish in this category.
   * `watermarked: true` keeps the bottom-right Afrolink watermark in frame when cropped.
   */
  image?: { file: string; alt: L10n; watermarked?: boolean };
  items: MenuItem[];
}

const PM = 'printed-menu-2026' as const;

export const foodMenu: MenuCategory[] = [
  {
    id: 'soups',
    title: { de: 'Suppen', en: 'Soups', fr: 'Soupes' },
    image: {
      file: 'egusi-yam.jpg',
      alt: { de: 'Egusi-Suppe mit gekochtem Yam', en: 'Egusi soup served with boiled yam', fr: 'Soupe egusi servie avec de l’igname bouillie' },
      watermarked: true,
    },
    items: [
      {
        id: 'egusi-soup',
        name: 'Egusi Soup',
        price: 1500,
        description: {
          de: 'Suppe aus gemahlenen Melonenkernen mit Fleisch und Gewürzen',
          en: 'Soup of ground melon seeds with meat and spices',
          fr: 'Soupe de graines de melon moulues, avec viande et épices',
        },
        descriptionSource: PM,
      },
      {
        id: 'afang-soup',
        name: 'Afang Soup',
        price: 1700,
        description: {
          de: 'Afang- und Wasserblattsuppe mit Fleisch und Fisch',
          en: 'Afang and waterleaf soup with meat and fish',
          fr: 'Soupe de feuilles d’afang et de waterleaf, avec viande et poisson',
        },
        descriptionSource: PM,
      },
      {
        id: 'edikaikong',
        name: 'Edikaikong',
        price: 1700,
        description: {
          de: 'Gemüse aus Kürbis- und Wasserblättern mit Fleisch und Fisch',
          en: 'Pumpkin leaves and waterleaf with meat and fish',
          fr: 'Feuilles de citrouille et de waterleaf, avec viande et poisson',
        },
        descriptionSource: PM,
      },
      {
        id: 'ogbono-soup',
        name: 'Ogbono Soup',
        price: 1500,
        description: {
          de: 'Suppe aus Ogbono-Samen mit Fleisch und Fisch',
          en: 'Soup of ogbono seeds with meat and fish',
          fr: 'Soupe de graines d’ogbono, avec viande et poisson',
        },
        descriptionSource: PM,
      },
      {
        id: 'ofe-nsala',
        name: 'Ofe Nsala',
        price: 1700,
        description: {
          de: 'Weiße Suppe mit Wels, Krebstieren und Gewürzen',
          en: 'White soup with catfish, crustaceans and spices',
          fr: 'Soupe blanche au poisson-chat, crustacés et épices',
        },
        descriptionSource: PM,
      },
      {
        id: 'okra-soup',
        name: 'Okra Soup',
        price: 1500,
        description: { de: 'Okrasuppe mit Fleisch und Fisch', en: 'Okra soup with meat and fish', fr: 'Soupe de gombo, avec viande et poisson' },
        descriptionSource: PM,
      },
      { id: 'banga-soup', name: 'Banga Soup', price: 1700 },
      {
        id: 'efo-riro',
        name: 'Efo Riro',
        price: 1700,
        description: {
          de: 'Spinatgemüse mit Fleisch, Paprika und Gewürzen',
          en: 'Spinach stew with meat, peppers and spices',
          fr: 'Ragoût d’épinards avec viande, poivrons et épices',
        },
        descriptionSource: PM,
      },
      {
        id: 'bitterleaf-soup',
        name: 'Bitterleaf Soup',
        price: 1500,
        description: {
          de: 'Bitterblattsuppe mit Fleisch, Krebstieren und Fisch',
          en: 'Bitterleaf soup with meat, crustaceans and fish',
          fr: 'Soupe de feuilles amères avec viande, crustacés et poisson',
        },
        descriptionSource: PM,
      },
      {
        id: 'fishermans-soup',
        name: "Fisherman's Soup",
        price: 2000,
        label: { de: 'Nur auf Vorbestellung', en: 'On request only', fr: 'Sur commande uniquement' },
      },
      { id: 'black-soup', name: 'Black Soup', price: 1700 },
      { id: 'oha-soup', name: 'Oha Soup', price: 1500 },
    ],
  },
  {
    id: 'rice',
    title: { de: 'Reis', en: 'Rice', fr: 'Riz' },
    image: {
      file: 'jollof-rice.jpg',
      alt: { de: 'Jollof-Reis mit gebratenem Fleisch', en: 'Jollof rice with fried meat', fr: 'Riz jollof avec viande frite' },
    },
    items: [
      {
        id: 'fried-rice',
        name: 'Fried Rice',
        price: 1700,
        description: { de: 'Gebratener Reis mit Fleisch und Gemüse', en: 'Fried rice with meat and vegetables', fr: 'Riz sauté avec viande et légumes' },
        descriptionSource: PM,
      },
      {
        id: 'jollof-rice',
        name: 'Jollof Rice',
        price: 1500,
        description: { de: 'Tomatenreis mit Fleisch', en: 'Tomato rice with meat', fr: 'Riz à la tomate avec viande' },
        descriptionSource: PM,
      },
      {
        id: 'white-rice',
        name: 'White Rice',
        price: 1500,
        description: {
          de: 'Weißer Reis mit Eintopf oder Pfeffersuppe',
          en: 'White rice with stew or pepper soup',
          fr: 'Riz blanc avec ragoût ou pepper soup',
        },
        descriptionSource: PM,
      },
      { id: 'coconut-rice', name: 'Coconut Rice', price: 1700 },
    ],
  },
  {
    id: 'beans-yam-plantain',
    title: { de: 'Bohnen, Yam & Kochbananen', en: 'Beans, Yam & Plantain', fr: 'Haricots, igname & banane plantain' },
    image: {
      file: 'porridge-yam.jpg',
      alt: {
        de: 'Porridge Yam in roter Palmölsauce',
        en: 'Porridge yam in a red palm-oil sauce',
        fr: 'Porridge d’igname dans une sauce rouge à l’huile de palme',
      },
    },
    items: [
      {
        id: 'beans-plantain',
        name: 'Beans & Plantain',
        price: 1700,
        description: { de: 'Bohnen in Palmöl mit Kochbananen', en: 'Beans in palm oil with plantain', fr: 'Haricots à l’huile de palme et banane plantain' },
        descriptionSource: PM,
      },
      {
        id: 'porridge-yam',
        name: 'Porridge Yam',
        price: 1700,
        description: { de: 'Yamswurzel mit Palmöl und Gewürzen', en: 'Yam with palm oil and spices', fr: 'Igname à l’huile de palme et aux épices' },
        descriptionSource: PM,
      },
      {
        id: 'fried-yam-egg-sauce',
        name: 'Fried Yam & Egg Sauce',
        price: 1500,
        description: {
          de: 'Gebratene Yamswurzel mit Tomaten-Ei-Sauce',
          en: 'Fried yam with tomato and egg sauce',
          fr: 'Igname frite avec sauce tomate aux œufs',
        },
        descriptionSource: PM,
      },
      {
        id: 'assorted-plate',
        name: 'Assorted Plate with Yam or Plantain',
        price: 1700,
        note: { de: 'Mit gemischtem Fleisch.', en: 'Served with mixed meat.', fr: 'Servi avec un assortiment de viandes.' },
      },
    ],
  },
  {
    id: 'specialities',
    title: { de: 'Spezialitäten', en: 'Specialities', fr: 'Spécialités' },
    image: {
      file: 'nkwobi.jpg',
      alt: {
        de: 'Nkwobi mit Zwiebelringen und roter Paprika in einer Holzschale',
        en: 'Nkwobi garnished with onion rings and red pepper in a wooden bowl',
        fr: 'Nkwobi garni de rondelles d’oignon et de poivron rouge, dans un bol en bois',
      },
      watermarked: true,
    },
    items: [
      {
        id: 'suya',
        name: 'Suya',
        price: 1700,
        description: { de: 'Gegrillte Fleischspieße', en: 'Grilled meat skewers', fr: 'Brochettes de viande grillées' },
        descriptionSource: PM,
      },
      {
        id: 'pepper-soup',
        name: 'Pepper Soup',
        price: 1500,
        note: { de: 'Mit Reis oder Yam.', en: 'Served with rice or yam.', fr: 'Servie avec riz ou igname.' },
        description: { de: 'Scharfe Ziegensuppe mit Kräutern', en: 'Hot goat soup with herbs', fr: 'Soupe de chèvre épicée aux herbes' },
        descriptionSource: PM,
        spice: 'hot',
      },
      {
        id: 'stockfish',
        name: 'Stockfish',
        price: 1700,
        description: { de: 'Getrockneter Kabeljau', en: 'Dried cod', fr: 'Cabillaud séché' },
        descriptionSource: PM,
      },
      {
        id: 'snail',
        name: 'Snail',
        price: 2000,
        description: { de: 'Gegrillte Riesenschnecke', en: 'Grilled giant snail', fr: 'Escargot géant grillé' },
        descriptionSource: PM,
      },
      { id: 'okpa', name: 'Okpa', price: 2000 },
      {
        id: 'abacha',
        name: 'Abacha',
        price: 1700,
        description: { de: 'Afrikanischer Cassavasalat', en: 'African cassava salad', fr: 'Salade africaine de manioc' },
        descriptionSource: PM,
      },
      {
        id: 'nkwobi',
        name: 'Nkwobi',
        price: 1700,
        description: { de: 'Rinderfuß in scharfer Senfsauce', en: 'Cow foot in a hot mustard sauce', fr: 'Pied de bœuf en sauce moutarde épicée' },
        descriptionSource: PM,
        spice: 'hot',
      },
      {
        id: 'isiewu',
        name: 'Isiewu',
        description: { de: 'Ziegenkopf in würziger Senfsauce', en: 'Goat head in a spiced mustard sauce', fr: 'Tête de chèvre en sauce moutarde épicée' },
        descriptionSource: PM,
        variants: [
          { label: { de: 'Kleiner Teller', en: 'Small Plate', fr: 'Petite assiette' }, labelEn: 'Small Plate', price: 1800 },
          { label: { de: 'Großer Teller', en: 'Big Plate', fr: 'Grande assiette' }, labelEn: 'Big Plate', price: 3500 },
        ],
      },
    ],
  },
  {
    id: 'fish',
    title: { de: 'Fisch', en: 'Fish', fr: 'Poisson' },
    image: {
      file: 'grilled-fish-plantain.jpg',
      alt: {
        de: 'Ganzer gegrillter Fisch mit Paprika, Zwiebeln und Kochbananen',
        en: 'Whole grilled fish topped with peppers and onions, with plantain',
        fr: 'Poisson entier grillé garni de poivrons et d’oignons, avec banane plantain',
      },
    },
    items: [
      {
        id: 'tilapia',
        name: 'Tilapia',
        description: {
          de: 'Gebratener oder gekochter Fisch mit Beilage',
          en: 'Fried or boiled fish with a side',
          fr: 'Poisson frit ou bouilli avec accompagnement',
        },
        descriptionSource: PM,
        variants: [
          { label: { de: 'Mittel', en: 'Medium', fr: 'Moyen' }, labelEn: 'Medium', price: 2500 },
          { label: { de: 'Groß', en: 'Large', fr: 'Grand' }, labelEn: 'Large', price: 3000 },
        ],
      },
      {
        id: 'fried-fish-plantain',
        name: 'Fried Fish & Plantain',
        price: 1800,
        description: { de: 'Gebratener Fisch mit Kochbananen', en: 'Fried fish with plantain', fr: 'Poisson frit et banane plantain' },
        descriptionSource: PM,
      },
    ],
  },
  {
    id: 'extras',
    title: { de: 'Extras', en: 'Extras', fr: 'Suppléments' },
    items: [{ id: 'extra-pounded-yam', name: 'Extra Pounded Yam', price: 400 }],
  },
];

/** All items flattened with their category (convenience for search, allergens, tests). */
export function allFoodItems() {
  return foodMenu.flatMap((c) => c.items.map((item) => ({ category: c, item })));
}
