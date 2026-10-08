#!/usr/bin/env node
/**
 * Exports the internal allergen/additive verification matrix from src/data/allergens.ts
 * (the same data the website uses) to:
 *   docs/compliance/allergen-verification-matrix.md   — readable matrix
 *   docs/compliance/allergen-verification-matrix.csv  — worksheet for the kitchen
 * Usage: npm run allergen-matrix
 */
import { writeFileSync } from 'node:fs';
import { allergenRecords, ALLERGENS, ADDITIVES, STANDARD_KITCHEN_QUESTIONS } from '../src/data/allergens.ts';
import { foodMenu } from '../src/data/menu.ts';
import { drinksMenu } from '../src/data/drinks.ts';

const items = [
  ...foodMenu.flatMap((c) => c.items.map((i) => ({ id: i.id, name: i.name, category: c.title.de, desc: i.description?.de ?? '' }))),
  ...drinksMenu.flatMap((c) => c.items.map((i) => ({ id: i.id, name: i.display?.de ?? i.name, category: c.title.de, desc: '' }))),
];
const byId = Object.fromEntries(items.map((i) => [i.id, i]));
const today = new Date().toISOString().slice(0, 10);

const tier = (r) => (r.status === 'verified' ? '1 – Verifiziert' : r.investigate.length ? '3 – Mögliche Allergene/Zusatzstoffe prüfen' : '2 – Küchenbestätigung erforderlich');

let md = `# Allergen- & Zusatzstoff-Verifizierungsmatrix (intern)

> **Intern – keine Kennzeichnung.** Generiert aus \`src/data/allergens.ts\` am ${today} (\`npm run allergen-matrix\`).
> Nichts in Spalte „Mögliche …“ ist eine Deklaration. Veröffentlicht wird erst, wenn ein Eintrag \`status: 'verified'\`
> mit \`verifiedBy\` und \`verifiedOn\` hat (Rezept + Lieferantenetiketten geprüft).

**Stufen:** 1 = verifiziert (Küche hat Rezept/Etiketten geprüft) · 2 = Küchenbestätigung erforderlich (keine Hinweise vorhanden) · 3 = mögliche Allergene/Zusatzstoffe untersuchen (Hinweis aus Afrolink-Karte, Gerichts- oder Produktname).

**Stand:** ${allergenRecords.filter((r) => r.status === 'verified').length} von ${allergenRecords.length} Positionen verifiziert.

## Standardfragen an die Küche (für jedes Gericht)

${STANDARD_KITCHEN_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Matrix

| Position | Kategorie | Beschreibung (Afrolink-Karte) | Stufe | Mögliche Allergene/Zusatzstoffe → Grundlage | Spezifische Küchenfragen | Deklariert (nur wenn verifiziert) |
|---|---|---|---|---|---|---|
`;
for (const r of allergenRecords) {
  const i = byId[r.itemId];
  const inv = r.investigate.map((x) => `${x.code}: ${x.basis}`).join('<br>') || '–';
  const q = r.kitchenQuestions.join('<br>') || '–';
  const decl = r.status === 'verified' ? `${[...(r.allergens ?? []), ...(r.additives ?? [])].join(', ') || 'keine'} (${r.verifiedBy}, ${r.verifiedOn})` : '–';
  md += `| ${i.name} | ${i.category} | ${i.desc || '–'} | ${tier(r)} | ${inv} | ${q} | ${decl} |\n`;
}
md += `
## Legende

**Allergene (LMIV Anhang II):** ${ALLERGENS.map((a) => `${a.code} = ${a.name.de}`).join(' · ')}

**Zusatzstoffe/Angaben:** ${ADDITIVES.map((a) => `${a.code} = „${a.de}“ (${a.basis})`).join(' · ')}
`;
writeFileSync('docs/compliance/allergen-verification-matrix.md', md);

const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
const head = ['id', 'Position', 'Kategorie', 'Status', 'Mögliche (Grundlage)', 'Küchenfragen', ...ALLERGENS.map((a) => `Allergen ${a.code}`), ...ADDITIVES.map((a) => `Zusatz ${a.code}`), 'Kreuzkontakt-Hinweis', 'Geprüft von', 'Geprüft am', 'Lieferanten-Etiketten abgelegt (ja/nein)'];
const rows = allergenRecords.map((r) => {
  const i = byId[r.itemId];
  return [
    r.itemId,
    i.name,
    i.category,
    r.status,
    r.investigate.map((x) => `${x.code}: ${x.basis}`).join(' | '),
    r.kitchenQuestions.join(' | '),
    ...ALLERGENS.map((a) => (r.status === 'verified' && r.allergens?.includes(a.code) ? 'x' : '')),
    ...ADDITIVES.map((a) => (r.status === 'verified' && r.additives?.includes(a.code) ? 'x' : '')),
    '',
    r.verifiedBy ?? '',
    r.verifiedOn ?? '',
    '',
  ];
});
writeFileSync('docs/compliance/allergen-verification-matrix.csv', '﻿' + [head, ...rows].map((r) => r.map(esc).join(';')).join('\n') + '\n');
console.log(`Wrote matrix for ${allergenRecords.length} items.`);
