# Keyword-to-page map — Afrolink Restaurant & Bar

_Compiled 2026-10-10 (Google phase of the Search Console finalization). Branch `discovery-ratings-2026-10`._

## Method and limits
- **Search intent evidence:** Google autocomplete (`hl=de`, `gl=de`), queried on 2026-10-10. Autocomplete shows what people type, **not** how often. No volume or ranking tool was available, so volumes are unknown.
- **Measurement:** use the Search Console *Performance → Queries* report once data appears (the property is new: "Processing data").
- **Rules:**
  - One primary intent per page.
  - No keyword stuffing.
  - No location doorway pages (Afrolink has one location: Berzeliusstraße 7, 45144 Essen-Frohnhausen).
  - No claims about dishes or services Afrolink does not offer.
  - No meta-keywords tag.
- **District:** "Frohnhausen" is confirmed by OpenStreetMap (address → suburb Frohnhausen, Stadtbezirk III) and the coolibri listing (docs/research/seo-menu-allergen-research-2026-10-09.md).

## Observed search intent (autocomplete, 2026-10-10)
| Seed | Relevant suggestions seen |
|---|---|
| afrikanisches restaurant essen | …essen **rüttenscheid**, …essen **frohnhausen**, afrikanisches restaurant **fufu** essen, …wo man fufu essen kann |
| african restaurant essen | …essen frohnhausen, …essen germany, pan african restaurant essen |
| restaurant africain | **restaurant africain essen** (first suggestion) |
| afrolink | **afrolink essen**, afrolink restaurant & bar **karte**, afrolink restaurant & bar **menü** |
| nigerianisches restaurant / nigerian restaurant | city variants (Düsseldorf, Duisburg, Köln, Berlin …), "in der nähe" / "near me" |
| afrikanisches essen / afrikanisch essen | city variants, "in der nähe", afrikanisches essen fufu |
| afrikanisches essen bestellen | …online bestellen, city variants |
| afrikanisches catering | city variants (Dortmund, Köln …), afrikanisches essen catering |
| egusi / egusi suppe / egusi soup | mostly recipes; "egusi fufu", "egusi soup geschmack" |
| jollof / jollof rice | mostly recipes; "jollof rice köln" (city intent exists) |
| suya | suya gewürz, suya nigeria (much noise from unrelated brands) |
| pepper soup / goat meat pepper soup | recipes; "goat meat pepper soup near me" |
| pounded yam | pounded yam and egusi (soup), pounded yam fufu (unterschied) |
| fufu | fufu essen, fufu essen in der nähe, fufu düsseldorf / köln |

**Takeaways**
1. Local restaurant searches are city-based ("… essen", "… in der nähe"). "In der Nähe" / "near me" is served mainly by the **Google Business Profile** (Maps), not by website copy.
2. Brand searches ("afrolink essen", "afrolink … karte/menü") need the home and menu pages to say *Afrolink*, *Essen* and *Speisekarte/Menü*. They do.
3. Dish searches are mostly **informational** (recipes). Dish pages answer what a dish is and that Afrolink serves it in Essen. No recipe content, which would attract non-customers.
4. **Fufu:** a strong intent, but Afrolink's menu has **pounded yam and garri, not fufu**. The pounded yam page explains the relationship honestly ("Looking for fufu? … we serve pounded yam or garri"). Do not claim fufu.
5. **Rüttenscheid:** Afrolink is not in Rüttenscheid. Do not target it.

## Map (primary page per intent)
| Priority keyword(s) | Lang | Intent | Page | How the page covers it | Status |
|---|---|---|---|---|---|
| Afrikanisches Restaurant Essen; Nigerianisches Restaurant Essen; Westafrikanisches Restaurant Essen; Afrolink Essen | DE | Local restaurant / brand | `/` | Title "Afrolink Essen – Afrikanisches & nigerianisches Restaurant"; description names Essen-Frohnhausen, Egusi, Jollof, Suya; Restaurant JSON-LD (servesCuisine West African/African) | Title/description **changed 2026-10-10 (preview only)** |
| Nigerian restaurant Essen; African restaurant Essen | EN | Local restaurant | `/en/` | Title "Afrolink Essen – African & Nigerian Restaurant" | **changed (preview only)** |
| restaurant africain Essen | FR | Local restaurant | `/fr/` | Title "Afrolink Essen – Restaurant africain et nigérian" | **changed (preview only)** |
| Afrolink Speisekarte / Menü; afrikanisches Essen Essen; Nigerianisches Essen Essen | DE | Brand menu / browse | `/speisekarte/` | Title "Speisekarte – Afrikanisches Restaurant in Essen \| Afrolink"; full menu with prices; Menu JSON-LD | Unchanged (already fits) |
| Afrolink menu; Nigerian food Essen | EN | Brand menu | `/en/menu/` | "Menu – African Restaurant in Essen \| Afrolink" | Unchanged |
| carte Afrolink; cuisine africaine Essen | FR | Brand menu | `/fr/carte/` | "Carte – Restaurant africain à Essen \| Afrolink" | Unchanged |
| Egusi Soup Essen; Egusi Suppe Essen | DE/EN/FR | Dish + city | `/speisekarte/egusi-soup/` (+ `/en/menu/…`, `/fr/carte/…`) | "Egusi Soup in Essen – …"; also the soups hub `/speisekarte/suppen/` | Unchanged |
| Jollof Rice Essen | DE/EN/FR | Dish + city | `/speisekarte/jollof-rice/` | "Jollof Rice in Essen – Westafrikanischer Tomatenreis" | Unchanged |
| Suya Essen | DE/EN/FR | Dish + city | `/speisekarte/suya/` | "Suya in Essen – Gegrillte Fleischspieße"; peanut note | Unchanged |
| Pepper Soup Essen; goat meat pepper soup | DE/EN/FR | Dish + city | `/speisekarte/pepper-soup/` | "Pepper Soup in Essen – Scharfe Ziegenfleisch-Suppe" | Unchanged |
| Fufu Essen (related) | DE/EN/FR | Swallow side | `/speisekarte/extra-pounded-yam/` and soup pages | Honest pounded yam / garri explanation; **no fufu claim** | Unchanged |
| Afrikanische Suppen Essen (Afang, Ogbono, Banga …) | DE/EN/FR | Category | `/speisekarte/suppen/` + dish pages | Soups hub + 12 soup pages | Unchanged |
| Tilapia / Fisch Essen | DE/EN/FR | Dish | `/speisekarte/tilapia/`, `/speisekarte/fried-fish-plantain/` (Mackerel on preview) | Dish pages | Unchanged |
| African catering Essen; afrikanisches Catering Essen | DE/EN/FR | Service | `/catering/`, `/en/catering/`, `/fr/traiteur/` | "Afrikanisches Catering in Essen – Feiern & Firmen"; Service JSON-LD; "by arrangement" | Unchanged |
| Nigerian food delivery Essen; afrikanisches Essen bestellen / liefern | DE/EN/FR | Service | `/lieferung/`, `/en/delivery/`, `/fr/livraison/` | DE "Afrikanisches Essen liefern lassen in Essen"; EN now "African & Nigerian Food Delivery in Essen". Delivery is **by arrangement** (no delivery area, fee or time is claimed) | EN title **changed (preview only)** |
| afrikanisches Restaurant Essen Frohnhausen; Afrolink Anfahrt | DE/EN/FR | Directions | `/kontakt/` (+ EN/FR) | Description now "45144 Essen-Frohnhausen"; address in JSON-LD | **changed (preview only)** |
| Tisch reservieren afrikanisches Restaurant Essen | DE/EN/FR | Reservation | `/reservierung/` | Unchanged | Unchanged |

## Not targeted (deliberately)
- Other cities (Düsseldorf, Köln, Bochum, Dortmund, Duisburg …): no city doorway pages. Afrolink has one location, and delivery/catering areas are only "by arrangement".
- "Rüttenscheid": wrong district.
- "Fufu" as a dish Afrolink sells: not on the menu.
- Recipe queries ("egusi suppe rezept"): not a customer intent for the restaurant.

## Owner follow-ups that matter more than on-page changes
1. Google Business Profile (not changed; needs explicit authorization):
   - website, menu (`/speisekarte/`) and reservation links;
   - categories (West African restaurant plus African / Nigerian restaurant, Caterer);
   - photos; review replies.
2. Directory listings (coolibri, 11880, golocal, Tripadvisor) should link to the website instead of only Facebook.
