/**
 * Writes docs/compliance/historical-allergen-register.md from src/data/allergens.ts
 * (run: node scripts/export-historical-register.ts). Do not edit the generated file by hand.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { HISTORICAL_CODES, HISTORICAL_MENU_SOURCE, historicalRegister, publicAllergenInfo } from '../src/data/allergens.ts';
import { allFoodItems } from '../src/data/menu.ts';

const sup: Record<string, string> = { '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '7': '⁷', '8': '⁸' };
const extract = readFileSync('docs/compliance/historical-menu-extract.txt', 'utf8');
const items = allFoodItems().filter(({ item }) => item.available !== false);

const lines: string[] = [];
lines.push('# Historical Afrolink allergen & additive register');
lines.push('');
lines.push('_Generated from `src/data/allergens.ts` by `scripts/export-historical-register.ts` — do not edit by hand._');
lines.push('');
lines.push(`**Source:** ${HISTORICAL_MENU_SOURCE.file} (${HISTORICAL_MENU_SOURCE.location}), extracted ${HISTORICAL_MENU_SOURCE.extractedOn}. The full text extraction is kept in \`docs/compliance/historical-menu-extract.txt\`.`);
lines.push('');
lines.push(`**Original legend (verbatim):** ${HISTORICAL_MENU_SOURCE.legend}`);
lines.push('');
lines.push('These codes are **restaurant-sourced (first-party) declarations**, not assumptions. They are published on the website as "declared on Afrolink\'s previous menu" until the kitchen confirms them for the current recipe. Old prices, availability labels and discontinued dishes are **not** restored.');
lines.push('');
lines.push('## 1. Code mapping (historical → current legal categories)');
lines.push('');
lines.push('| Code | Original wording | Type | Annex II / LMZDV class | Note |');
lines.push('|---|---|---|---|---|');
for (const [code, d] of Object.entries(HISTORICAL_CODES)) {
  const cls = d.kind === 'allergen' ? `Allergen ${'allergen' in d ? d.allergen : ''}` : `Additive class "${d.label.de}"`;
  lines.push(`| ${sup[code]} (${code}) | ${d.original} | ${d.kind} | ${cls} | ${d.possible ? 'Original says "possible" — kept as possible' : ''} |`);
}
lines.push('');
lines.push('Code 6 does not appear in the original legend.');
lines.push('');
lines.push('## 2. Every historical dish (29) and its current mapping');
lines.push('');
lines.push('| No. | Original name | Codes | Current dish | Mapping | Reconciliation note |');
lines.push('|---|---|---|---|---|---|');
for (const h of historicalRegister) {
  const cur = h.currentId ? items.find(({ item }) => item.id === h.currentId)?.item.name ?? h.currentId : '— (not on current menu, never published)';
  lines.push(`| ${h.menuNo ?? '–'} | ${h.originalName} | ${h.codes.map((c) => sup[c]).join('') || '— (none printed)'} | ${cur} | ${h.mapping} | ${h.note ?? ''} |`);
}
lines.push('');
lines.push(`Coded dishes: ${historicalRegister.filter((h) => h.codes.length).length}. Discontinued: ${historicalRegister.filter((h) => h.mapping === 'discontinued').map((h) => h.originalName).join(', ')}.`);
lines.push('');
lines.push(`## 3. Current menu (${items.length} items) — what the website shows`);
lines.push('');
lines.push('| Current dish | Website status | Allergens | Additives | On old menu without codes? |');
lines.push('|---|---|---|---|---|');
for (const { item } of items) {
  const info = publicAllergenInfo(item.id);
  const status = { confirmed: '2 · Confirmed by Afrolink (current recipe)', 'previous-menu': '1/3 · Previously declared — reconciliation pending', 'owner-declared': 'Declared by the owner for a new item (2026-10-10)', 'not-declared': '4 · Not previously declared — ask staff' }[info.status];
  lines.push(
    `| ${item.name} | ${status} | ${info.allergens.map((a) => `${a.label.de}${a.historicalCode ? sup[a.historicalCode] : ''}`).join(', ') || '—'} | ${info.additives.map((a) => `${a.label.de}${a.historicalCode ? sup[a.historicalCode] : ''}`).join(', ') || '—'} | ${info.listedWithoutCodes ? 'yes — absence of codes is NOT "allergen-free"' : info.status === 'not-declared' ? 'not on old menu' : ''} |`,
  );
}
lines.push('');
lines.push('Status numbers follow the owner\'s four classifications (2026-10-09): 1 previously declared · 2 currently confirmed · 3 requires reconciliation · 4 not previously declared. All previously declared entries are currently also "requires reconciliation" because the kitchen has not yet confirmed the current recipes.');
lines.push('');
lines.push('## 4. Discrepancies found in the historical menu (for the kitchen)');
lines.push('');
for (const h of historicalRegister.filter((x) => x.note)) lines.push(`- **${h.originalName}**: ${h.note}`);
lines.push('');
lines.push('## 5. Raw extraction');
lines.push('');
lines.push('```text');
lines.push(extract.trim());
lines.push('```');
writeFileSync('docs/compliance/historical-allergen-register.md', lines.join('\n') + '\n');
console.log('written docs/compliance/historical-allergen-register.md');
