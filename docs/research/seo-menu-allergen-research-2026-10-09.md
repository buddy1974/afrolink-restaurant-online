# Afrolink Restaurant & Bar — Desk Research

Research date: 2026-10-09. Method: WebSearch (a US-based index, which returned thin results for German local queries) plus WebFetch of the cited pages. WebFetch condenses each page with a small model, so check the original wording before any legal or marketing text is published. Nothing in this file is legal advice.

---

## 1. Google Search Central guidance

### (a) Sitelinks
- Sitelinks are fully automated. Google offers no way to configure or request them. The only control is negative: you can keep a page out of sitelinks by removing it or adding `noindex`. https://developers.google.com/search/docs/appearance/sitelinks
- What helps, according to Google: informative page titles and headings, logical site structure and navigation, relevant internal-link anchor text, and avoiding repetitive content. Google says sitelinks appear only "when we think they'll be useful to the user." (same URL)

### (b) Breadcrumb structured data
- `BreadcrumbList` contains `itemListElement`, an ordered list of `ListItem`s, each with `position`, `name` and `item` (the URL; optional on the last item). Accepted formats are JSON-LD, RDFa and Microdata. https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Guidelines: the trail should follow how users typically navigate, not necessarily the URL path. Use at least two ListItems. A page with several paths can carry several trails. (same URL)

### (c) Review snippets: self-serving reviews and MenuItem
- Supported review-snippet item types: **Book, Course list, Event, Local business, Movie, Product, Recipe, Software App.** Reviews are also supported on CreativeWorkSeason, CreativeWorkSeries, Episode, Game, MediaObject, MusicPlaylist, MusicRecording and Organization. https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- **MenuItem (or a "dish") is not a supported item type.** `aggregateRating` on `MenuItem` will not produce stars. `Recipe` is supported, but marking a restaurant dish as a Recipe when the page has no recipe would misrepresent the page. That last point is my inference, not Google's wording. (same URL)
- **Self-serving reviews are ineligible.** If the business controls the reviews about itself, its pages using `LocalBusiness`/`Organization` markup cannot get star snippets. This covers `Restaurant`, which is a subtype of LocalBusiness. Google's wording is that such pages "are ineligible for star review feature." (same URL)
- Other rules: reviews must be visible on the marked-up page. Do not aggregate ratings from other websites, such as Google Maps or Tripadvisor stars. (same URL)

### (d) Localised versions, hreflang and x-default
- Google accepts three equivalent methods: HTML `<link rel="alternate" hreflang>`, HTTP headers, or the XML sitemap. https://developers.google.com/search/docs/specialty/international/localized-versions
- Every language version must list itself and all the other versions. Links must be reciprocal or Google may ignore them. Codes are ISO 639-1 (`de`, `en`, `fr`) with an optional ISO 3166-1 region. (same URL)
- `x-default` is the fallback for users whose language matches none of the versions. Google suggests it for language selectors and auto-redirecting home pages. For Afrolink, `x-default` → the German root `/` is a reasonable choice (my inference). (same URL)
- Translated pages are not treated as duplicates. Pages count as duplicates only when the main content is left untranslated. (same URL)

### (e) Helpful content and doorway pages
- Google wants "people-first content" created mainly to help people, not to manipulate rankings. It has no preferred word count. It discourages producing content mainly for search traffic and mass-producing content without expertise. https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Doorway abuse, from the spam policies, includes: multiple domains or pages aimed at specific regions or cities that funnel users to one page; pages generated to funnel visitors into the usable part of a site; and substantially similar pages that sit closer to search results than to a clear, browsable hierarchy. https://developers.google.com/search/docs/essentials/spam-policies
- Scaled content abuse means producing many pages mainly to manipulate rankings, for example content that "makes little or no sense to a reader but contains search keywords." (same URL)
- **For Afrolink:** templated city pages such as "Afrikanisches Restaurant Bochum" or "… Duisburg" for a single location in Essen fit the doorway pattern. A single, substantive catering page that names the delivery area is the safer choice.

### (f) Local ranking (Google Business Profile Help)
- Local ranking rests on three factors. **Relevance:** how well the profile matches the search. **Distance:** how far the business is from the searcher or the searched location. **Prominence:** how well known the business is, including links, articles, and review count and score. https://support.google.com/business/answer/7091
- Google states "there's no way to request or pay for a better local ranking." Its advice: keep the profile complete and verified, keep hours accurate, respond to reviews, and add photos. It also says more reviews and positive ratings can help local ranking. (same URL)

---

## 2. German allergen and additive rules for loose food in restaurants

### Legal framework
- **EU Reg. 1169/2011 (LMIV), Art. 9(1)(c):** any ingredient or processing aid listed in Annex II, or derived from one, must be declared. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169
- **Art. 44:** for non-prepacked food, the Art. 9(1)(c) allergen information is **mandatory**. Member states may set national rules on how it is provided. (same URL)
- **Art. 14 (distance selling):** mandatory information must be available **before purchase is concluded**, and all of it at delivery. This matters if Afrolink offers online ordering. (same URL)
- **Annex II, the 14 groups:** (1) cereals containing gluten, namely wheat, rye, barley, oats, spelt, kamut and hybrids; (2) crustaceans; (3) eggs; (4) fish; (5) peanuts; (6) soybeans; (7) milk, including lactose; (8) nuts, namely almond, hazelnut, walnut, cashew, pecan, Brazil, pistachio, macadamia; (9) celery; (10) mustard; (11) sesame; (12) sulphur dioxide and sulphites above 10 mg/kg or 10 mg/L; (13) lupin; (14) molluscs. Each group includes products made from it. (same URL)

### LMIDV §4: how allergen information may be given for loose food
Source: https://www.gesetze-im-internet.de/lmidv/__4.html
- **§4(3):** the information must be clearly visible, legible and easily accessible. It may be given:
  1. on a sign on or next to the food;
  2. on menus or price lists (Speise- und Getränkekarten, Preisverzeichnisse);
  3. by a notice (Aushang) in the sales area;
  4. by other written or **electronic** information, as long as it is directly and easily accessible to the consumer.
- **§4(4), oral information:** allowed if it is given on request **before purchase**; written documentation of the ingredients is kept and is immediately and easily accessible to the authorities and, on request, to consumers; and a clearly visible notice (sign, menu or Aushang) tells guests they can get the information orally and that the documentation is available.
- The information must be available before the purchase is completed and before the food is handed over. (same URL)

### Additives: now LMZDV §5, not ZZulV
- The **Lebensmittelzusatzstoff-Durchführungsverordnung (LMZDV)** has applied since **9 June 2022**. It replaced the old Zusatzstoff-Zulassungsverordnung (ZZulV), whose §9 governed this before. Many municipal Merkblätter still cite the ZZulV, so treat those as outdated on that point. https://www.stuttgart.de/organigramm/leistungen/allergen-und-zusatzstoffkennzeichnung-bei-loser-ware.php ; https://www.gesetze-im-internet.de/lmzdv/__5.html
- **§5 LMZDV** covers loose food, including restaurant food. Required wordings by additive class include: "mit Farbstoff"; "mit Konservierungsstoff" or "konserviert"; "mit Antioxidationsmittel"; "mit Geschmacksverstärker"; "mit Süßungsmittel(n)"; "enthält eine Phenylalaninquelle" (aspartame and similar); "geschwärzt" (olives); "gewachst"; "mit Phosphat" (meat products); plus specific declarations for nitrite curing salt and nitrate. https://www.gesetze-im-internet.de/lmzdv/__5.html
- **Form:** additive information must use the same means as LMIV Art. 12(2) / LMIDV §4. When both allergens and additives must be declared, use the **same method and the same medium**. https://www.gesetze-im-internet.de/lmzdv/__5.html ; https://www.stuttgart.de/organigramm/leistungen/allergen-und-zusatzstoffkennzeichnung-bei-loser-ware.php
- **Footnotes and codes:** official guidance accepts footnote codes (numbers, letters or both) on the menu, provided the dish carries the reference and the legend gives the full required wording. https://www.stuttgart.de/organigramm/leistungen/allergen-und-zusatzstoffkennzeichnung-bei-loser-ware.php ; Bremen authority leaflet: https://www.lmtvet.bremen.de/sixcms/media.php/13/Info_24_Zusatzstoffe-SpeiseGetraenkekarte.pdf ; DEHOGA Bayern Merkblatt: https://www.dehoga-bayern.de/uploads/media/Merkblatt_Speisekarte_Kennzeichnung.pdf. I did not open the Bremen and DEHOGA PDFs; they were cited from search-result summaries.
- **Uncertain:** whether the Afrolink kitchen uses ingredients that trigger these declarations, such as bouillon cubes with glutamate, coloured drinks or preserved products. This must come from the kitchen's actual recipes and supplier specifications. Do not guess.
- Verbraucherzentrale Hamburg checked 38 restaurants and found **21 (55%)** gave insufficient allergen information. https://www.vzhh.de/presse/ueberwiegend-schlechte-allergenkennzeichnung-gaststaetten (from a search-result summary; page not opened)

### Checklist for the Afrolink website and menu
**Must:**
- [ ] Give allergen information (the 14 Annex II groups) for every dish **in the restaurant**: printed menu with codes and a legend, a notice, or the oral option with written documentation **and** a visible notice.
- [ ] Declare additive classes with the LMZDV §5 wording, using the **same medium** as the allergens.
- [ ] If online ordering or delivery is offered, show allergens and additives **before the order is placed** (LMIV Art. 14) and make them available at delivery.
- [ ] Keep written ingredient documentation for each dish, reflecting the current recipes.

**May:**
- [ ] Use letter or number codes on the menu with one legend, for example A = gluten (wheat) or 1 = mit Geschmacksverstärker.
- [ ] Publish the same information online as an extra service.

**Is online information enough for dine-in guests?** No. The City of Stuttgart's food-control page says online information alone does not meet the requirement, because the information must be accessible at the place of sale. Electronic information under LMIDV §4(3) means media available on site, for example a terminal or tablet, with a notice. https://www.stuttgart.de/organigramm/leistungen/allergen-und-zusatzstoffkennzeichnung-bei-loser-ware.php . The legal text itself requires the information to be "directly and easily accessible", so a QR code on the table pointing to an allergen page is a borderline case. **Uncertain:** confirm with the Essen Lebensmittelüberwachung.

**Allergens likely in this cuisine** (domain knowledge, verify against recipes): crayfish powder (crustaceans, group 2); stockfish and dried or smoked fish (fish, 4); snails (molluscs, 14); periwinkles (molluscs, 14); prawns and crab (crustaceans, 2); groundnut or kuli-kuli in suya spice (peanuts, 5; the yaji spice mix contains ground peanut cake according to https://en.wikipedia.org/wiki/Suya); semolina or wheat swallow (gluten, 1); bouillon cubes (often contain gluten, celery or other allergens; check the labels). Egusi (melon seeds) and ogbono (wild mango seeds) are **not** Annex II allergens, but a "seeds" or "nuts" note helps guests who ask.

---

## 3. Nigerian and West African menu presentation

### How the five reference menus describe dishes (paraphrased)
| Menu | Structure | Dish descriptions | Swallows | Spice / diet notes | Photos |
|---|---|---|---|---|---|
| OLAM (https://www.olamrestaurant.com/menu?category=nigerian-soups) | Category tabs; a "Nigerian soups" category | 1–2 sentences: base ingredient and cooking medium (seeds, palm oil, leaves), then a short taste or texture line; sometimes the ethnic style (e.g. Yoruba-style); seafood soups lead with the protein list | Separate swallow selector | No heat scale | None on that page |
| Halit Kitchen (https://halitkitchen.com/menu/) | 8 themed sections (pot, grains, grill, small plates, plant-based, drinks, desserts, feast) | One short narrative sentence: main ingredient, what it is simmered with, signature spice blend | "Choose your swallow" (eba, amala, pounded yam, semolina, wheat) | Words such as fiery or smoky, no scale; "serves two" labels | Photo for every dish |
| Mareot (https://www.mareot.com/menu) | Standard sections plus "Soups" and "Extra Swallow" | Short: protein, cooking method and sauce | Starch choice listed per dish | **Tags:** Spicy, Gluten-Free, Halal, Contains Shellfish | Photos for most items |
| Kulture Yard (https://kultureyard.com/menu.html) | Many categories, searchable | Name, price, then 1–2 sentences on components and method | Each soup lists its swallow options (eba, pounded yam, semo, wheat, plantain flour, fufu) | "Peppered" or "spicy" in the dish name; separate "add protein" list; half and full portions | None |
| Eli & Lulu (https://www.eliandlulu.com/images/Eli-Lulu-Food-Menu.pdf; 30 MB PDF, text extracted locally) | Fusion café menu with a "Nigerian Soups" block | One ingredient-led sentence per soup (e.g. ground seeds + palm oil + leaves; texture terms such as "draw"); a note that every soup includes a choice of protein | "Extra swallows" listed with one price | Proteins priced separately; vegetarian dishes marked (V) | — |

**Patterns worth copying, in Afrolink's own words:** describe each soup by thickener or base, main leaf, cooking fat and typical protein, plus a texture word (for example "draw" or slimy for okra and ogbono). Show swallows as a separate, explained choice. Add dietary and allergen tags. Price proteins as add-ons. One caution: in the Eli & Lulu PDF, the "Fisherman" description reads like bitterleaf soup, probably a layout error. Menus on other sites are not reliable references.

### Dish characteristics
Notation: **Main** = main ingredient · **Texture** · **Origin** · **Served with**. Items marked (U) are uncertain or rest on weaker sources.

1. **Egusi soup.** Main: ground egusi seeds (cucurbit, melon or gourd seeds), which also thicken it; leafy greens such as bitterleaf; meat or fish; crayfish. Texture: thick. Origin: West African, strongly linked to Yoruba cooking but eaten widely. Served with: fufu or pounded yam. https://en.wikipedia.org/wiki/Egusi
2. **Afang.** Main: afang leaf (Gnetum) and waterleaf, palm oil, crayfish, meats, periwinkle. Texture: thick vegetable soup. Origin: Ibibio (Akwa Ibom), also Efik (Cross River). Served with: fufu or garri. https://en.wikipedia.org/wiki/Afang_soup
3. **Edikang ikong.** Main: fluted pumpkin leaves (ugu) and waterleaf, palm oil, meats, dried fish, periwinkle. Texture: thick vegetable soup. Origin: Efik and Ibibio. Seen as a premium or festive soup. Served with: fufu, wheat, eba or pounded yam. https://en.wikipedia.org/wiki/Edikang_ikong
4. **Ogbono.** Main: ground ogbono (wild mango) seeds as thickener, palm oil, crayfish, leaves. Texture: mucilaginous "draw" soup, similar to okra. Origin: pan-Nigerian; the name is Igbo. Served with: fufu, semo, wheat, pounded yam or eba. https://en.wikipedia.org/wiki/Ogbono_soup
5. **Ofe nsala (white soup).** Main: catfish, yam as thickener, uziza; **no palm oil**; seasoned with ogiri or iru and utazi. Texture: light and creamy. Origin: Igbo. Served with: pounded yam, eba or semolina. https://en.wikipedia.org/wiki/Ofe_Nsala
6. **Okra soup.** Main: okra pods, sometimes with ugu or jute leaf. Texture: slippery or "draw". Origin: eaten across Igbo, Yoruba (ọbẹ ila), Efik and Hausa (miyan kubewa) communities. Served with: swallows. https://en.wikipedia.org/wiki/Okra_soup
7. **Banga soup.** Main: palm-fruit or palm-nut extract, smoked or dried fish, meats, aromatics. Texture: rich and creamy. Origin: Niger Delta (Urhobo, Isoko, Itsekiri, Ijaw). Served with: starch (Delta "starch", eba, fufu) or rice. https://en.wikipedia.org/wiki/Banga_soup (redirects to the "Palm nut soup" page). The Delta-specific spices are not detailed there (U).
8. **Efo riro.** Main: spinach or other greens, red peppers, Scotch bonnet, palm oil, stockfish, crayfish. Texture: stew-like vegetable soup. Origin: Yoruba (south-west). Served with: iyan (pounded yam), amala, eba, fufu, or rice. https://en.wikipedia.org/wiki/Efo_riro
9. **Bitterleaf soup (ofe onugbu).** Main: washed bitterleaf (Vernonia amygdalina), so not necessarily bitter; thickener is cocoyam or achi depending on the variant; ogiri; meat, fish, stockfish. Origin: Igbo, closely tied to Anambra. Served with: akpu (fufu) or garri. https://en.wikipedia.org/wiki/Ofe_onugbu (from a search summary; page not opened)
10. **Fisherman soup.** Main: fresh fish and shellfish (prawns, crab, periwinkles, clams). Sometimes thickened with garri, yam or cocoyam, or okra. Origin: Rivers and Bayelsa (Niger Delta). Traditionally eaten with onunu (pounded yam and plantain). https://www.kitchenbutterfly.com/soups-of-hunters-fishers-gatherers/ ; https://guardian.ng/?p=2463775 . No dedicated Wikipedia article was found (U).
11. **Black soup (omoebe).** Main: blended scent leaf, uziza leaf and bitterleaf, with palm oil, crayfish and meats. Texture: dark, herby, slightly bitter. Origin: Edo (Benin). Served with: swallows such as pounded yam (U). https://en.wikipedia.org/wiki/Edo_black_soup ; https://www.kitchenbutterfly.com/sunday-lunch-omoebe-edo-black-soup/ (both from search summaries)
12. **Oha soup (ofe oha).** Main: oha leaves, uziza, achi or cocoyam as thickener, palm oil, crayfish, meat. Origin: Igbo (south-east); Efik, Annang and Ibibio variants exist. Served with: akpu or garri; pounded yam. https://en.wikipedia.org/wiki/Oha_soup
13. **Nigerian fried rice.** Rice with mixed vegetables (cabbage, carrots, peas) and meat, chicken or prawns. Party staple, often next to jollof. https://en.wikipedia.org/wiki/Nigerian_cuisine (the party pairing is common practice, not stated there (U))
14. **Jollof rice.** Rice cooked in tomato, tomato paste, onion, chilli and oil. Originates in the Wolof/Jolof region of Senegambia. Nigerian style uses parboiled long-grain rice and a meat-stock base, and is part of the Ghana-vs-Nigeria "Jollof wars". https://en.wikipedia.org/wiki/Jollof_rice
15. **Coconut rice.** Rice cooked in coconut milk with spices. https://en.wikipedia.org/wiki/Nigerian_cuisine
16. **Beans & dodo.** Stewed or boiled beans (ewa agoyin: beans with pepper sauce, Yoruba) with dodo, i.e. ripe plantain fried golden; "dodo" is the Yoruba name. https://en.wikipedia.org/wiki/Nigerian_cuisine ; https://en.wikipedia.org/wiki/Fried_plantain
17. **Yam porridge (asaro).** Yam cubes cooked with palm oil, onion, peppers, spices, often crayfish or smoked fish. Thick, reddish-orange pottage. Yoruba. Often served with fish, eggs, meat or dodo. https://en.wikipedia.org/wiki/Asaro_(food)
18. **Fried yam & egg sauce.** Yam, fried or boiled, with scrambled eggs cooked in tomato, onion and pepper sauce. A typical breakfast. https://en.wikipedia.org/wiki/Nigerian_cuisine ; also on Eli & Lulu's breakfast menu (https://www.eliandlulu.com/images/Eli-Lulu-Food-Menu.pdf)
19. **Suya.** Thin-sliced beef, goat, ram or chicken on skewers, coated in **yaji** (chilli, ginger, dried onion, **ground peanut cake / kuli-kuli**) and grilled. Hausa, northern Nigeria (also called tsire). Served with sliced onion and tomato and extra yaji. https://en.wikipedia.org/wiki/Suya
20. **Pepper soup.** A thin, spicy broth of meat or fish with chilli, scent leaf and calabash nutmeg. Southern Nigeria and Cameroon. Eaten as a starter or bar food; goat, chicken, catfish or tilapia versions. https://en.wikipedia.org/wiki/Pepper_soup
21. **Stockfish (okporoko).** Air-dried cod from Norway, used in egusi, edikang ikong, nsala, afang, oha, efo riro and okra. It became popular in Nigeria through food aid in the late-1960s civil war. Wikipedia says the name refers to the sound it makes in the pot. https://en.wikipedia.org/wiki/Stockfish
22. **African giant land snail (igbin; "congo meat").** Snails such as Archachatina, usually served peppered (boiled, then sautéed with peppers and onion) or in snail pepper soup (south-east). A party delicacy. https://en.wikipedia.org/wiki/Snail_pepper_soup ; https://afrifoodnetwork.com/recipes/appetizer-recipes/peppered-snail/ . The nickname "congo meat" is widespread slang, but I found no authoritative source for it (U). **Molluscs = allergen group 14.**
23. **Okpa.** Steamed pudding of Bambara groundnut flour with palm oil and crayfish, wrapped in leaves. Igbo (Enugu, Nsukka). Eaten hot, often for breakfast with pap or a drink. https://en.wikipedia.org/wiki/Okpa
24. **Abacha ("African salad").** Dried shredded cassava, softened, dressed with palm oil emulsified with potash, plus crayfish, pepper and onion; served cold. Igbo. https://en.wikipedia.org/wiki/Abacha_(food)
25. **Nkwobi.** Cow foot in a thick, spicy palm-oil and potash sauce with calabash nutmeg, crayfish and utazi. Igbo. Restaurant or bar dish. https://en.wikipedia.org/wiki/Nkwobi
26. **Isi ewu.** Goat head, including the brain, in the same palm-oil and potash style, with ehu (calabash nutmeg), utazi and ugba. Igbo; served at celebrations, often with palm wine or beer. https://en.wikipedia.org/wiki/Isi_ewu
27. **Tilapia, Nigerian style.** Whole tilapia, scored, marinated in a spicy pepper mix and grilled; also used in pepper soup. Served with plantain or yam. https://www.nigerianfoodtv.com/nigerian-grilled-fish-recipe/ ; https://simshomekitchen.com/nigerian-grilled-fish/ (recipe blogs, weaker sources (U))
28. **Fried fish & plantain.** Whole fried fish (e.g. croaker or tilapia) with dodo. Asaro and similar dishes are commonly served with fried fish and dodo (https://en.wikipedia.org/wiki/Asaro_(food)); for dodo see https://en.wikipedia.org/wiki/Fried_plantain . I found no single authoritative source for this as a named dish (U).
29. **Pounded yam (iyan).** Boiled white yam pounded until smooth, heavier than mashed potato and eaten with the hands. Eaten across Yoruba, Igbo and Hausa communities, with egusi, ogbono, okra or efo riro. https://en.wikipedia.org/wiki/Pounded_yam
30. **Garri / eba.** Garri is roasted granulated cassava flour (the processing removes the toxins). Eba is garri stirred into hot water to make a dough, served with soups. https://en.wikipedia.org/wiki/Garri
31. **How fufu relates to these.** In Nigeria, "fufu" (akpu in Igbo) usually means **fermented cassava** dough. Ghanaian fufu is pounded boiled cassava, plantain or cocoyam. In diaspora usage, fufu is a loose umbrella term, and other flours (semolina, maize, plantain) are used. https://en.wikipedia.org/wiki/Fufu . Pounded yam is made from yam and eba from garri; both are "swallows" eaten the same way as fufu. https://en.wikipedia.org/wiki/Nigerian_cuisine . Labelling eba or pounded yam as "fufu" is common diaspora shorthand but not accurate (my inference). On a menu, name the swallow explicitly.

---

## 4. Local competition and the search landscape

**Caveat:** I have **no keyword-volume or rank-tracking tool**. The search tool is US-based and returned poor German local results. Everything here is qualitative and the list is incomplete. Google Maps results could not be checked.

| Name | City | Source / website | Dish pages or online ordering |
|---|---|---|---|
| Afrolink Restaurant & Bar (this client) | Essen-Frohnhausen | coolibri listing: 7.9/10 from 87 reviews, about €15 per person, links to the Facebook page, "#1 of 1" West African restaurant in Essen on that platform. https://coolibri.de/restaurant/afrolink-essen/ ; 11880: https://www.11880.com/suche/afrikanisches-restaurant/essen | — |
| Mandali Restaurant | Essen (Viehofer Str.) | 11880 Essen (same URL). The Arabic name suggests it may not be West African (U) | unknown |
| Chez Amina Restaurant | Essen-Altendorf | 11880 Essen | unknown |
| Le Toureg – Afrikanische Spezialitäten | Essen-Altendorf | 11880 Essen | unknown |
| Petit Marrakesch | Essen-Holsterhausen | Moroccan; appears in "afrikanisches Restaurant Essen" results. https://www.golocal.de/deutschland/afrikanische-restaurants/ (from a search summary) | unknown |
| Treasure African Restaurant | Düsseldorf (Mettmanner Str. 1) | https://treasureafricanrestaurants.com/menu/ — Nigerian / West African | One menu page with categories (starters, fufu specials, rice specials, vegetarian) and short descriptions. **No individual dish pages and no online ordering seen** |
| Atinka African Bar & Restaurant | Bochum (Johanniterstr. 2) | Wolt listing https://wolt.com/en/deu/bochum/restaurant/atinka-african-bar-restaurant (page content not readable; from a search summary) | Delivery via Wolt |
| KILOMBO African Restaurant & Culture; KMC Kalenda Music Café; Naf-Imbiss | Duisburg | https://www.11880.com/suche/afrikanisches-restaurant/duisburg | unknown |
| Ugo Bar Restaurant | Oberhausen (Marktstr. 11) | from a search summary only (U) | unknown |
| Fata Morgana | Mülheim (Mühlenberg 12) | from a search summary; "African specialties" (U) | unknown |
| Dortmund | — | The 11880 Dortmund search returned **no** African restaurant in Dortmund itself; nearest results were Bochum, Wuppertal and Essen. https://www.11880.com/suche/afrikanisches-restaurant/dortmund . A search summary mentioned Caracalla, Ayman's (Lebanese/African), Habesha and "African Vista" (U, not verified) | — |

No dedicated West African caterer **based in NRW** came up for "afrikanisches Catering NRW". Results were generic wedding-catering directories such as bridebook and UK or French caterers. https://bridebook.com/de/search/wedding-catering/nordrhein-westfalen--de

**What kinds of pages rank (qualitative):**
- "afrikanisches Restaurant Essen" / "African restaurant Essen": aggregators and directories (golocal, freizeitmonster city lists, 11880, Tripadvisor's Ruhr-area African list https://www.tripadvisor.com/Restaurants-g8132658-c1-Ruhr_Area_North_Rhine_Westphalia.html, which returned 403 to my fetch, and coolibri). No restaurant's own website appeared on the first page of my tool's results.
- "nigerianisches Restaurant Essen" / "Jollof Rice Essen" / "Egusi Essen": the tool returned nothing Essen-specific; results were Berlin, London and NYC pages and ingredient shops. TikTok "discover" pages (e.g. "Fufu Restaurant in Essen", https://www.tiktok.com/discover/fufu-restaurant-in-essen) do appear. This suggests little dedicated content competition for dish + city queries. That is an inference from a weak tool; check in Google.de and in the Search Console query report.
- The competitors I could verify have at most one menu page and no dish-level pages. Afrolink's own website does not appear in these results; coolibri links only to its Facebook page.

---

## 5. Vercel + Neon Postgres; Astro on Vercel

### Neon Free plan (official Neon docs; no date shown on the page)
https://neon.com/docs/introduction/plans
- Storage: **1 GB per project**, 20 GB per account.
- Compute: **100 CU-hours per project per month**. Autoscaling up to 2 CU (8 GB RAM). Scales to zero after 5 minutes idle, and this cannot be disabled, so the first query after idle has a cold start.
- Projects: up to 100. Branches: **10 per project**.
- Egress: 5 GB per project per month. Restore window: 6 hours (up to 1 GB-month). One manual snapshot. Community support.
- The Vercel Marketplace page only says "Plans starting at $0" and links to Neon pricing. https://vercel.com/marketplace/neon

### Integration and preview branching
- Two integrations exist: **Vercel-Managed** (Marketplace "Native Integration"; Neon account created and billed through Vercel) and **Neon-Managed** (Marketplace "Connectable Account"; billed through Neon). **Both support preview branching.** https://neon.com/docs/guides/vercel-overview
- Vercel-Managed flow: enable **Required → Preview** and **"Resource must be active before deployment"**. Each preview deployment triggers a webhook, and Neon creates a branch named `preview/<git-branch>`. Connection env vars are injected at deploy time; they override the preview variables and are not visible in project settings. https://neon.com/docs/guides/vercel-managed-integration
- Cleanup: in the Vercel-Managed integration, branches are deleted only when the Vercel deployments are deleted. With the default deployment retention of about 6 months, branches can outlive closed PRs. Neon-Managed cleanup is triggered by Git-branch deletion. https://neon.com/docs/guides/vercel-overview ; https://neon.com/docs/guides/vercel-managed-integration
- The docs do not say what happens when the 10-branch Free limit is reached. On the Free plan, delete stale preview branches yourself (my inference).

### @astrojs/vercel and on-demand routes
- Astro is static by default. Add `export const prerender = false` to individual pages or endpoints to render them on demand. An adapter is required, installed with `npx astro add vercel`. https://docs.astro.build/en/guides/on-demand-rendering/ ; https://docs.astro.build/en/guides/integrations-guide/vercel/
- `output: 'server'` reverses the default: everything renders on demand unless a route sets `prerender = true`. https://docs.astro.build/en/guides/on-demand-rendering/
- Adapter options: `isr` (with `expiration` and `bypassToken`), `imageService`, `webAnalytics`, `middlewareMode: 'edge'`, `maxDuration`, `skewProtection` (Pro/Enterprise), `staticHeaders`. https://docs.astro.build/en/guides/integrations-guide/vercel/
- This fits Afrolink: the menu and info pages stay static, and an `/api/enquiry` endpoint or an admin route uses `prerender = false` with Neon.

---

## Implications for Afrolink
- **No stars from your own reviews:** do not add `aggregateRating` to the Restaurant or LocalBusiness schema or to MenuItems. It is ineligible (self-serving, and MenuItem is not a supported type). Invest in Google Business Profile reviews and replies instead; they feed local "prominence".
- **Sitelinks cannot be set.** Clear navigation, distinct page titles (Menu, Catering, Contact, Reservations), consistent internal anchors and BreadcrumbList on deeper pages are the levers.
- **hreflang:** use reciprocal DE/EN/FR plus `x-default` → `/`, with each page referencing itself, and keep translations complete.
- **No city doorway pages** for Bochum, Duisburg and similar. Use one strong catering page that names the service area, and dish pages only where each has unique, useful content (origin, texture, swallow pairing, allergens, photo).
- **Dish content gap:** competitors I could verify have no dish-level pages, and dish + "Essen" queries looked uncontested in my (weak) tool. Short, accurate explainers for the signature dishes (Egusi, Jollof, Afang, Ogbono, Pounded yam/Eba/Fufu, Suya, Pepper soup) are a credible opportunity. Verify the queries in Search Console first.
- **Menu UX:** follow the patterns from section 3: ingredient-led one-liners, a texture word for draw soups, an explicit swallow choice with an explanation, protein add-ons, and tags (spicy, contains fish, contains crustaceans or molluscs, contains peanut).
- **Allergens and additives:** the in-restaurant menu or notice is the legal basis; the website is a supplement. Use one code system for both allergens and LMZDV additive classes (cite the **LMZDV**, not the ZZulV). Watch for crayfish (crustaceans), stockfish and dried fish (fish), snails and periwinkles (molluscs), suya yaji (peanut), semolina and wheat swallows (gluten) and bouillon cubes. Data must come from the kitchen's recipes; confirm the QR-only question with the Essen Lebensmittelüberwachung.
- **If online ordering is added,** allergens and additives must appear before the order is placed (LMIV Art. 14).
- **Backend:** Neon Free (1 GB, 100 CU-h, 10 branches) is ample for enquiries and reservations. Expect cold starts after 5 minutes idle. Use `prerender = false` only for API/admin routes. Clean up preview branches on the Free plan.
