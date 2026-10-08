/**
 * ALLERGEN & ADDITIVE RECORDS — safety-critical.
 *
 * Legal basis (see docs/compliance/legal-requirements-matrix.md):
 * - Reg. (EU) 1169/2011 (LMIV) Art. 9(1)(c), Art. 44, Annex II — 14 allergen groups.
 * - LMIDV § 4 — non-prepacked food: written info (menu, notice, electronic) or oral info
 *   by staff ONLY if a written record exists, is accessible on request, and a notice says so.
 * - LMZDV § 5 (in force 9 June 2021) — additive indications for non-prepacked food.
 * - FrSaftErfrischGetrV § 6 — caffeine > 150 mg/l in soft drinks; footnotes allowed on menus.
 *
 * RULES
 * 1. Nothing is declared publicly until a record is `status: 'verified'` with
 *    `verifiedBy` + `verifiedOn` (kitchen sign-off based on recipes and supplier labels).
 * 2. `investigate` is INTERNAL: possible allergens/additives to check, each with the basis.
 *    Basis may only be Afrolink's own menu text, the dish/product name, or the product type.
 *    It is never shown to customers as a declaration.
 * 3. Never assign allergens from photos or generic internet recipes.
 */
import type { L10n } from '../i18n/config';
import { allFoodItems } from './menu.ts';
import { allDrinkItems } from './drinks.ts';

export const ALLERGENS = [
  { code: 'A', name: { de: 'Glutenhaltiges Getreide (Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut)', en: 'Cereals containing gluten (wheat, rye, barley, oats, spelt, kamut)', fr: 'Céréales contenant du gluten (blé, seigle, orge, avoine, épeautre, kamut)' } },
  { code: 'B', name: { de: 'Krebstiere', en: 'Crustaceans', fr: 'Crustacés' } },
  { code: 'C', name: { de: 'Eier', en: 'Eggs', fr: 'Œufs' } },
  { code: 'D', name: { de: 'Fisch', en: 'Fish', fr: 'Poisson' } },
  { code: 'E', name: { de: 'Erdnüsse', en: 'Peanuts', fr: 'Arachides' } },
  { code: 'F', name: { de: 'Soja', en: 'Soybeans', fr: 'Soja' } },
  { code: 'G', name: { de: 'Milch (einschließlich Laktose)', en: 'Milk (including lactose)', fr: 'Lait (y compris lactose)' } },
  { code: 'H', name: { de: 'Schalenfrüchte (Mandeln, Haselnüsse, Walnüsse, Cashew, Pekan, Para, Pistazien, Macadamia)', en: 'Tree nuts (almond, hazelnut, walnut, cashew, pecan, Brazil, pistachio, macadamia)', fr: 'Fruits à coque (amande, noisette, noix, cajou, pécan, du Brésil, pistache, macadamia)' } },
  { code: 'I', name: { de: 'Sellerie', en: 'Celery', fr: 'Céleri' } },
  { code: 'J', name: { de: 'Senf', en: 'Mustard', fr: 'Moutarde' } },
  { code: 'K', name: { de: 'Sesamsamen', en: 'Sesame seeds', fr: 'Graines de sésame' } },
  { code: 'L', name: { de: 'Schwefeldioxid und Sulfite (> 10 mg/kg bzw. mg/l)', en: 'Sulphur dioxide and sulphites (> 10 mg/kg or mg/l)', fr: 'Anhydride sulfureux et sulfites (> 10 mg/kg ou mg/l)' } },
  { code: 'M', name: { de: 'Lupinen', en: 'Lupin', fr: 'Lupin' } },
  { code: 'N', name: { de: 'Weichtiere', en: 'Molluscs', fr: 'Mollusques' } },
] as const satisfies readonly { code: string; name: L10n }[];

export type AllergenCode = (typeof ALLERGENS)[number]['code'];

/** Additive indications (LMZDV § 5(1)) plus caffeine / quinine for drinks. Wording is the legal German text. */
export const ADDITIVES = [
  { code: '1', de: 'mit Farbstoff', basis: 'LMZDV § 5 Abs. 1 Nr. 1' },
  { code: '2', de: 'mit Konservierungsstoff / konserviert', basis: 'LMZDV § 5 Abs. 1 Nr. 2' },
  { code: '3', de: 'mit Antioxidationsmittel', basis: 'LMZDV § 5 Abs. 1 Nr. 3' },
  { code: '4', de: 'mit Nitritpökelsalz / mit Nitrat', basis: 'LMZDV § 5 Abs. 1 Nr. 4' },
  { code: '5', de: 'mit Geschmacksverstärker', basis: 'LMZDV § 5 Abs. 1 Nr. 5' },
  { code: '6', de: 'geschwärzt', basis: 'LMZDV § 5 Abs. 1 Nr. 6' },
  { code: '7', de: 'gewachst', basis: 'LMZDV § 5 Abs. 1 Nr. 7' },
  { code: '8', de: 'mit Phosphat', basis: 'LMZDV § 5 Abs. 1 Nr. 8' },
  { code: '9', de: 'mit Süßungsmittel(n)', basis: 'LMZDV § 5 Abs. 1 Nr. 9' },
  { code: '10', de: 'enthält eine Phenylalaninquelle', basis: 'LMZDV § 5 Abs. 1 Nr. 11' },
  { code: '11', de: 'kann bei übermäßigem Verzehr abführend wirken', basis: 'LMZDV § 5 Abs. 1 Nr. 12' },
  { code: '12', de: 'erhöhter Koffeingehalt (> 150 mg/l) – mit Angabe mg/100 ml', basis: 'FrSaftErfrischGetrV § 6; LMIV Anh. III Nr. 4.1' },
  { code: '13', de: 'chininhaltig', basis: 'Erfrischungsgetränke mit Chinin (siehe LAVES-Merkblatt Nr. 9)' },
] as const;

export type AdditiveCode = (typeof ADDITIVES)[number]['code'];

export interface Investigation {
  code: AllergenCode | AdditiveCode;
  /** Why this is on the list — must cite Afrolink's own text, the name, or the product type. */
  basis: string;
}

export interface AllergenRecord {
  itemId: string;
  kind: 'food' | 'drink';
  status: 'pending' | 'verified';
  /** Declared allergens — ONLY when status is 'verified'. */
  allergens?: AllergenCode[];
  /** Declared additive codes — ONLY when status is 'verified'. */
  additives?: AdditiveCode[];
  /** Who confirmed the recipe/labels (kitchen lead) and when (YYYY-MM-DD). */
  verifiedBy?: string;
  verifiedOn?: string;
  /** Optional cross-contact note shown with a verified record. */
  crossContact?: L10n;
  /** INTERNAL — never rendered as a declaration. */
  investigate: Investigation[];
  /** INTERNAL — dish-specific questions for the kitchen (in addition to the standard checklist). */
  kitchenQuestions: string[];
}

/** Standard questions asked for EVERY dish (docs/compliance/kitchen-allergen-worksheet.md). */
export const STANDARD_KITCHEN_QUESTIONS = [
  'Vollständiges aktuelles Rezept inkl. aller Zutaten und Mengenangaben',
  'Brühwürfel, Bouillon, Würzmischungen: Marke + Zutatenliste vom Etikett (Sellerie, Gluten, Soja, Geschmacksverstärker?)',
  'Saucen, Marinaden, Pasten: selbst gemacht oder zugekauft? Zutatenliste',
  'Fisch, Krebstiere (auch Crayfish-Pulver, getrocknete Garnelen), Weichtiere – auch in Würzmitteln',
  'Erdnüsse, Schalenfrüchte, Sesam – auch in Gewürzmischungen und Ölen',
  'Glutenhaltige Zutaten (Mehl zum Binden, Semolina, Weizen-„Swallow“)',
  'Milch, Ei, Soja, Senf, Sellerie, Lupine',
  'Zugekaufte Produkte: Lieferant + Etikett aufbewahren (Zusatzstoffe: Farbstoff, Konservierungsstoff, Geschmacksverstärker, Süßungsmittel, Phosphat …)',
  'Rezeptvarianten (z. B. Fleisch-/Fischauswahl, Beilagen)',
  'Kreuzkontakt: gemeinsame Töpfe, Fritteusen, Bretter, Utensilien',
];

/** Investigations derived from Afrolink's own printed-menu descriptions or the dish/product name. */
const INVESTIGATE: Record<string, Investigation[]> = {
  // Food — basis: Afrolink printed menu 2026 description (PM) or dish name
  'afang-soup': [{ code: 'D', basis: 'PM: „mit Fleisch und Fisch“' }],
  edikaikong: [{ code: 'D', basis: 'PM: „mit Fleisch und Fisch“' }],
  'ogbono-soup': [{ code: 'D', basis: 'PM: „mit Fleisch und Fisch“' }],
  'ofe-nsala': [
    { code: 'D', basis: 'PM: „mit Wels“' },
    { code: 'B', basis: 'PM: „Krebstieren“' },
  ],
  'okra-soup': [{ code: 'D', basis: 'PM: „mit Fleisch und Fisch“' }],
  'bitterleaf-soup': [
    { code: 'B', basis: 'PM: „Krebstieren“' },
    { code: 'D', basis: 'PM: „und Fisch“' },
  ],
  'fishermans-soup': [
    { code: 'D', basis: 'Name: „Fisherman’s Soup“' },
    { code: 'B', basis: 'Name: „Fisherman’s Soup“ – Meeresfrüchte prüfen' },
    { code: 'N', basis: 'Name: „Fisherman’s Soup“ – Meeresfrüchte prüfen' },
  ],
  'fried-yam-egg-sauce': [{ code: 'C', basis: 'PM / Name: „Tomaten-Ei-Sauce“' }],
  nkwobi: [{ code: 'J', basis: 'PM: „scharfer Senfsauce“' }],
  isiewu: [{ code: 'J', basis: 'PM: „würziger Senfsauce“' }],
  stockfish: [{ code: 'D', basis: 'PM: „Getrockneter Kabeljau“' }],
  snail: [{ code: 'N', basis: 'PM: „Riesenschnecke“ (Weichtier)' }],
  tilapia: [{ code: 'D', basis: 'Name / PM: Fisch' }],
  'fried-fish-plantain': [{ code: 'D', basis: 'Name / PM: „Gebratener Fisch“' }],
  // Drinks — basis: product type; confirm from the actual bottle/can label
  guinness: [{ code: 'A', basis: 'Bier (Gerstenmalz) – Etikett prüfen' }],
  krombacher: [{ code: 'A', basis: 'Bier (Gerstenmalz) – Etikett prüfen' }],
  warsteiner: [{ code: 'A', basis: 'Bier (Gerstenmalz) – Etikett prüfen' }],
  becks: [{ code: 'A', basis: 'Bier (Gerstenmalz) – Etikett prüfen' }],
  diebels: [{ code: 'A', basis: 'Bier (Gerstenmalz) – Etikett prüfen' }],
  desperados: [{ code: 'A', basis: 'Biermischgetränk – Etikett prüfen' }],
  malzbier: [
    { code: 'A', basis: 'Malzgetränk (Gerstenmalz) – Etikett prüfen' },
    { code: '1', basis: 'Malzbier – Farbstoff (Zuckerkulör)? Etikett prüfen' },
  ],
  heineken: [{ code: 'A', basis: 'Bier (Gerstenmalz) – Etikett prüfen' }],
  'cola-light': [
    { code: '1', basis: 'Cola-Getränk – Farbstoff? Etikett prüfen' },
    { code: '9', basis: '„Light“ – Süßungsmittel? Etikett prüfen' },
    { code: '10', basis: 'Aspartam enthalten? Etikett prüfen' },
    { code: '12', basis: 'Koffeingehalt > 150 mg/l? Etikett prüfen' },
  ],
  sprite: [{ code: '9', basis: 'Süßungsmittel? Etikett prüfen' }],
  fanta: [
    { code: '1', basis: 'Farbstoff? Etikett prüfen' },
    { code: '9', basis: 'Süßungsmittel? Etikett prüfen' },
  ],
  'red-bull': [{ code: '12', basis: 'Energy Drink – Koffeingehalt laut Dose prüfen (Angabe mg/100 ml)' }],
  'wine-glass': [{ code: 'L', basis: 'Wein – „enthält Sulfite“ laut Etikett prüfen' }],
  'wine-sekt-bottle': [{ code: 'L', basis: 'Wein/Sekt – „enthält Sulfite“ laut Etikett prüfen' }],
  'moet-imperial-bottle': [{ code: 'L', basis: 'Champagner – „enthält Sulfite“ laut Etikett prüfen' }],
  'moet-rose-bottle': [{ code: 'L', basis: 'Champagner – „enthält Sulfite“ laut Etikett prüfen' }],
  'baileys-glass': [{ code: 'G', basis: 'Sahnelikör – „enthält Milch“ laut Etikett prüfen' }],
  'jack-daniels-glass': [{ code: '1', basis: 'Spirituose – Farbstoff (E150a)? Etikett prüfen' }],
  'jack-daniels-bottle': [{ code: '1', basis: 'Spirituose – Farbstoff (E150a)? Etikett prüfen' }],
  'hennessy-glass': [{ code: '1', basis: 'Cognac – Farbstoff (E150a)? Etikett prüfen' }],
  'hennessy-bottle': [{ code: '1', basis: 'Cognac – Farbstoff (E150a)? Etikett prüfen' }],
  'chivas-glass': [{ code: '1', basis: 'Whisky – Farbstoff (E150a)? Etikett prüfen' }],
  'chantre-glass': [{ code: '1', basis: 'Weinbrand – Farbstoff? Etikett prüfen' }],
  'chantre-bottle': [{ code: '1', basis: 'Weinbrand – Farbstoff? Etikett prüfen' }],
};

/** Dish/product-specific questions (questions only — never declarations). */
const QUESTIONS: Record<string, string[]> = {
  'egusi-soup': ['Welche Fisch-/Krebstier-Zutaten (z. B. Crayfish, Stockfish) kommen hinein?'],
  'banga-soup': ['Keine Beschreibung vorhanden – vollständiges Rezept erfassen.'],
  'black-soup': ['Keine Beschreibung vorhanden – vollständiges Rezept erfassen.'],
  'oha-soup': ['Keine Beschreibung vorhanden – vollständiges Rezept erfassen.'],
  'coconut-rice': ['Keine Beschreibung vorhanden – vollständiges Rezept erfassen.'],
  okpa: ['Keine Beschreibung vorhanden – vollständiges Rezept erfassen.'],
  suya: ['Enthält die Suya-Gewürzmischung Erdnüsse? Marke/Rezept der Mischung?'],
  abacha: ['Welche Zutaten (z. B. Ugba/Ölbohnen, Crayfish, Fisch) gehören dazu?'],
  'pepper-soup': ['Welche Gewürzmischung? Mit Reis oder Yam – Beilagen erfassen.'],
  'white-rice': ['„Eintopf oder Pfeffersuppe“ – Zutaten beider Varianten erfassen.'],
  tilapia: ['„Mit Beilage“ – welche Beilagen (Pommes, Reis, Salat)? Frittieröl gemeinsam genutzt?'],
  'extra-pounded-yam': ['Reines Yam-Produkt oder Fertigmehl? Etikett des Pounded-Yam-Mehls aufbewahren.'],
  'liqueur-glass': ['Welcher Likör genau? Produkt benennen und Etikett prüfen.'],
  'vodka-glass': ['Welche Marke? Etikett prüfen.'],
  water: ['Welches Wasser (Marke)? Etikett prüfen.'],
};

function record(itemId: string, kind: AllergenRecord['kind']): AllergenRecord {
  return {
    itemId,
    kind,
    status: 'pending',
    investigate: INVESTIGATE[itemId] ?? [],
    kitchenQuestions: QUESTIONS[itemId] ?? [],
  };
}

/**
 * One record per menu item. To publish a declaration, replace the generated record for an id
 * in VERIFIED below with status 'verified', allergens, additives, verifiedBy and verifiedOn.
 */
const VERIFIED: Record<string, AllergenRecord> = {
  // Example (do not uncomment until the kitchen has confirmed recipe + labels):
  // 'jollof-rice': { itemId: 'jollof-rice', kind: 'food', status: 'verified', allergens: ['I'], additives: ['5'],
  //   verifiedBy: 'Küchenleitung (Name)', verifiedOn: '2026-11-01', investigate: [], kitchenQuestions: [] },
};

export const allergenRecords: AllergenRecord[] = [
  ...allFoodItems().map(({ item }) => VERIFIED[item.id] ?? record(item.id, 'food')),
  ...allDrinkItems().map(({ item }) => VERIFIED[item.id] ?? record(item.id, 'drink')),
];

export function recordFor(itemId: string): AllergenRecord | undefined {
  return allergenRecords.find((r) => r.itemId === itemId);
}

/** True when no item has a verified declaration yet. */
export function nothingVerified(): boolean {
  return allergenRecords.every((r) => r.status !== 'verified');
}
