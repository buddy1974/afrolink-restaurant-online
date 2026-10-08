# Legal Requirements Matrix — Afrolink Restaurant & Bar (website + restaurant information duties)

| Field | Value |
|-------|-------|
| Prepared | 2026-10-08 (research + implementation by Claude; **not legal advice**) |
| Owner (DRI) | Marcel — Maxpromo Digital; restaurant operator for business facts |
| Status | **Not compliant yet** — recipe/label verification and operator legal data outstanding |

> Compliance cannot be claimed until the kitchen has verified recipes and supplier labels and the operator has supplied
> the legally required identity data. The website is built so that verified data can be published without code changes.

## A. Food information (allergens, additives) — non-prepacked food & drinks

| # | Requirement | Authoritative source | Required information | Current implementation | Status | Evidence | Owner action |
|---|---|---|---|---|---|---|---|
| A1 | Allergen information must be provided for non-prepacked food (incl. restaurants) | Reg. (EU) 1169/2011 (LMIV) Art. 9(1)(c), Art. 44(1)(a) — https://eur-lex.europa.eu/eli/reg/2011/1169/oj | Every one of the 14 Annex II allergens contained in each dish/drink (also via bought-in components) | Data model with all 14 groups (`src/data/allergens.ts`); one record per dish/drink (59); public page `/allergene/` | **Pending** — 0/59 verified | `tests/safety.test.ts` (14 groups, record per item, no declaration without sign-off) | Kitchen completes `allergen-verification-matrix.csv` from recipes + labels |
| A2 | Form of allergen information in Germany | LMIDV § 4 Abs. 3 — https://www.gesetze-im-internet.de/lmidv/__4.html | Written: menu, sign, notice, or other written/electronic info | Website page per item (becomes the electronic record once verified); menu notice links to it | **Pending** | Page renders "In Prüfung – bitte Personal fragen" for all items | Publish verified records; keep printed menu consistent |
| A3 | Oral information by staff only with written documentation + notice | LMIDV § 4 Abs. 4; LAVES guidance MFB-08-008-00 (2022) p. 6; Verbraucherzentrale NRW ("Eine rein mündliche Auskunft ist ohne eine schriftliche Dokumentation nicht zulässig") | Written record (Kladde) on the premises, accessible on request to guests and authorities; visible notice that information is given orally | Website states verified information is not yet available and asks guests to consult staff. It does **not** claim a written record exists | **Not met** until the record exists | `src/i18n/ui.ts` (menu.noticeAllergens, dietary.allergyText) | Create the written record (Kladde) — the CSV can serve as its basis; put up an in-restaurant notice |
| A4 | Generic "may contain" disclaimers are insufficient | LAVES guidance p. 5 ("Allgemeine Hinweise … ohne konkrete Zuordnung sind nicht ausreichend") | Dish-specific assignment | No generic disclaimer is used as a substitute; per-item records | Implemented (architecture) | Allergen page per item | — |
| A5 | Allergen info in German | LMIV Art. 15 (language easily understood in the member state) | German-language information available | `/allergene/` (German); EN/FR pages link to it prominently | Implemented (architecture) | `tests/rendered.test.ts` (EN/FR link to `/allergene/`) | — |
| A6 | Additive indications for non-prepacked food | LMZDV § 5 Abs. 1 & 2 (in force 9 June 2021) — https://www.gesetze-im-internet.de/lmzdv/__5.html | e.g. "mit Farbstoff", "mit Konservierungsstoff", "mit Antioxidationsmittel", "mit Geschmacksverstärker", "mit Phosphat", "mit Süßungsmittel(n)", "enthält eine Phenylalaninquelle" … | Additive catalogue with legal wording (`ADDITIVES`); per-item fields | **Pending** | Allergen page legend | Kitchen checks labels of bought-in products (stock cubes, seasoning, sauces, drinks) |
| A7 | Caffeine > 150 mg/l in soft drinks | FrSaftErfrischGetrV § 6 — https://www.gesetze-im-internet.de/frsaftv_2004/__6.html; LMIV Annex III 4.1 | "erhöhter Koffeingehalt …" + mg/100 ml; footnotes allowed on menus | Code 12 in catalogue; Red Bull/Cola Light flagged to check | **Pending** | Matrix rows red-bull, cola-light | Read caffeine content from cans/bottles |
| A8 | Sulphites in wine/sparkling wine | LMIV Annex II No. 12 | "enthält Sulfite" where > 10 mg/l | Wine, Sekt, Champagne flagged to check | **Pending** | Matrix rows wine-* / moet-* | Read labels |
| A9 | Footnote/code system on menus | LAVES guidance p. 5; Verbraucherzentrale NRW (footnote solution) | Codes directly assigned to each dish, with legend | Codes A–N (allergens) and 1–13 (additives) ready; shown per item once verified | Ready | `/allergene/` legend | Mirror codes on the printed menu |
| A10 | NRW / Essen specifics | Supervisory authority: City of Essen food control (Lebensmittelüberwachung); NRW addresses via Verbraucherzentrale NRW | — | — | **Open** | No Essen-specific guidance document and no DEHOGA NRW guidance could be located online (2026-10-08) | Ask DEHOGA NRW (member service) / Essen food control for local practice |

## B. Website legal information

| # | Requirement | Source | Required information | Current implementation | Status | Owner action |
|---|---|---|---|---|---|---|
| B1 | Impressum | § 5 DDG — https://www.gesetze-im-internet.de/ddg/__5.html | Operator name (+ legal form, representative), address for service, fast electronic contact **incl. e-mail**, register entry, VAT ID (if any) | `/impressum/` + EN/FR; renders supplied fields only, "Angabe ausstehend" + visible incompleteness notice | **Not met** | Supply data in `src/data/legal.ts` |
| B2 | Privacy information | GDPR Art. 13 — https://eur-lex.europa.eu/eli/reg/2016/679/oj | Controller, purposes, legal bases, recipients/transfers, rights, complaint authority | `/datenschutz/` + EN/FR describing what the site technically does (verified in code); controller via Impressum | **Draft** — controller identity + internal enquiry handling + transfer safeguards pending | Supply data; legal review |
| B3 | Storage on end device | § 25 TDDDG (formerly TTDSG) — https://www.gesetze-im-internet.de/ttdsg/__25.html | Consent unless strictly necessary | Only `localStorage` key `afl-lang` after an explicit language choice (strictly necessary); no cookies | Implemented | — |
| B4 | Third-party embeds | GDPR Art. 6(1)(a); § 25(1) TDDDG | No transfer before consent | Click-to-play for YouTube (nocookie) and Facebook; no iframe on load | Implemented | `tests/rendered.test.ts` (no iframe before play) |
| B5 | Fonts | GDPR (Google Fonts remote loading, LG München I 2022) | No IP transfer to Google for fonts | Self-hosted fonts | Implemented | — |
| B6 | Self-serving review markup | Google structured-data policy | No self-serving rating markup | No `aggregateRating`; rating shown as dated manual snapshot | Implemented | `tests/rendered.test.ts` |
