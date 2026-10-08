# Allergen- & Zusatzstoff-Verifizierungsmatrix (intern)

> **Intern – keine Kennzeichnung.** Generiert aus `src/data/allergens.ts` am 2026-10-08 (`npm run allergen-matrix`).
> Nichts in Spalte „Mögliche …“ ist eine Deklaration. Veröffentlicht wird erst, wenn ein Eintrag `status: 'verified'`
> mit `verifiedBy` und `verifiedOn` hat (Rezept + Lieferantenetiketten geprüft).

**Stufen:** 1 = verifiziert (Küche hat Rezept/Etiketten geprüft) · 2 = Küchenbestätigung erforderlich (keine Hinweise vorhanden) · 3 = mögliche Allergene/Zusatzstoffe untersuchen (Hinweis aus Afrolink-Karte, Gerichts- oder Produktname).

**Stand:** 0 von 59 Positionen verifiziert.

## Standardfragen an die Küche (für jedes Gericht)

1. Vollständiges aktuelles Rezept inkl. aller Zutaten und Mengenangaben
2. Brühwürfel, Bouillon, Würzmischungen: Marke + Zutatenliste vom Etikett (Sellerie, Gluten, Soja, Geschmacksverstärker?)
3. Saucen, Marinaden, Pasten: selbst gemacht oder zugekauft? Zutatenliste
4. Fisch, Krebstiere (auch Crayfish-Pulver, getrocknete Garnelen), Weichtiere – auch in Würzmitteln
5. Erdnüsse, Schalenfrüchte, Sesam – auch in Gewürzmischungen und Ölen
6. Glutenhaltige Zutaten (Mehl zum Binden, Semolina, Weizen-„Swallow“)
7. Milch, Ei, Soja, Senf, Sellerie, Lupine
8. Zugekaufte Produkte: Lieferant + Etikett aufbewahren (Zusatzstoffe: Farbstoff, Konservierungsstoff, Geschmacksverstärker, Süßungsmittel, Phosphat …)
9. Rezeptvarianten (z. B. Fleisch-/Fischauswahl, Beilagen)
10. Kreuzkontakt: gemeinsame Töpfe, Fritteusen, Bretter, Utensilien

## Matrix

| Position | Kategorie | Beschreibung (Afrolink-Karte) | Stufe | Mögliche Allergene/Zusatzstoffe → Grundlage | Spezifische Küchenfragen | Deklariert (nur wenn verifiziert) |
|---|---|---|---|---|---|---|
| Egusi Soup | Suppen | Suppe aus gemahlenen Melonenkernen mit Fleisch und Gewürzen | 2 – Küchenbestätigung erforderlich | – | Welche Fisch-/Krebstier-Zutaten (z. B. Crayfish, Stockfish) kommen hinein? | – |
| Afang Soup | Suppen | Afang- und Wasserblattsuppe mit Fleisch und Fisch | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: PM: „mit Fleisch und Fisch“ | – | – |
| Edikaikong | Suppen | Gemüse aus Kürbis- und Wasserblättern mit Fleisch und Fisch | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: PM: „mit Fleisch und Fisch“ | – | – |
| Ogbono Soup | Suppen | Suppe aus Ogbono-Samen mit Fleisch und Fisch | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: PM: „mit Fleisch und Fisch“ | – | – |
| Ofe Nsala | Suppen | Weiße Suppe mit Wels, Krebstieren und Gewürzen | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: PM: „mit Wels“<br>B: PM: „Krebstieren“ | – | – |
| Okra Soup | Suppen | Okrasuppe mit Fleisch und Fisch | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: PM: „mit Fleisch und Fisch“ | – | – |
| Banga Soup | Suppen | – | 2 – Küchenbestätigung erforderlich | – | Keine Beschreibung vorhanden – vollständiges Rezept erfassen. | – |
| Efo Riro | Suppen | Spinatgemüse mit Fleisch, Paprika und Gewürzen | 2 – Küchenbestätigung erforderlich | – | – | – |
| Bitterleaf Soup | Suppen | Bitterblattsuppe mit Fleisch, Krebstieren und Fisch | 3 – Mögliche Allergene/Zusatzstoffe prüfen | B: PM: „Krebstieren“<br>D: PM: „und Fisch“ | – | – |
| Fisherman's Soup | Suppen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: Name: „Fisherman’s Soup“<br>B: Name: „Fisherman’s Soup“ – Meeresfrüchte prüfen<br>N: Name: „Fisherman’s Soup“ – Meeresfrüchte prüfen | – | – |
| Black Soup | Suppen | – | 2 – Küchenbestätigung erforderlich | – | Keine Beschreibung vorhanden – vollständiges Rezept erfassen. | – |
| Oha Soup | Suppen | – | 2 – Küchenbestätigung erforderlich | – | Keine Beschreibung vorhanden – vollständiges Rezept erfassen. | – |
| Fried Rice | Reis | Gebratener Reis mit Fleisch und Gemüse | 2 – Küchenbestätigung erforderlich | – | – | – |
| Jollof Rice | Reis | Tomatenreis mit Fleisch | 2 – Küchenbestätigung erforderlich | – | – | – |
| White Rice | Reis | Weißer Reis mit Eintopf oder Pfeffersuppe | 2 – Küchenbestätigung erforderlich | – | „Eintopf oder Pfeffersuppe“ – Zutaten beider Varianten erfassen. | – |
| Coconut Rice | Reis | – | 2 – Küchenbestätigung erforderlich | – | Keine Beschreibung vorhanden – vollständiges Rezept erfassen. | – |
| Beans & Plantain | Bohnen, Yam & Kochbananen | Bohnen in Palmöl mit Kochbananen | 2 – Küchenbestätigung erforderlich | – | – | – |
| Porridge Yam | Bohnen, Yam & Kochbananen | Yamswurzel mit Palmöl und Gewürzen | 2 – Küchenbestätigung erforderlich | – | – | – |
| Fried Yam & Egg Sauce | Bohnen, Yam & Kochbananen | Gebratene Yamswurzel mit Tomaten-Ei-Sauce | 3 – Mögliche Allergene/Zusatzstoffe prüfen | C: PM / Name: „Tomaten-Ei-Sauce“ | – | – |
| Assorted Plate with Yam or Plantain | Bohnen, Yam & Kochbananen | – | 2 – Küchenbestätigung erforderlich | – | – | – |
| Suya | Spezialitäten | Gegrillte Fleischspieße | 2 – Küchenbestätigung erforderlich | – | Enthält die Suya-Gewürzmischung Erdnüsse? Marke/Rezept der Mischung? | – |
| Pepper Soup | Spezialitäten | Scharfe Ziegensuppe mit Kräutern | 2 – Küchenbestätigung erforderlich | – | Welche Gewürzmischung? Mit Reis oder Yam – Beilagen erfassen. | – |
| Stockfish | Spezialitäten | Getrockneter Kabeljau | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: PM: „Getrockneter Kabeljau“ | – | – |
| Snail | Spezialitäten | Gegrillte Riesenschnecke | 3 – Mögliche Allergene/Zusatzstoffe prüfen | N: PM: „Riesenschnecke“ (Weichtier) | – | – |
| Okpa | Spezialitäten | – | 2 – Küchenbestätigung erforderlich | – | Keine Beschreibung vorhanden – vollständiges Rezept erfassen. | – |
| Abacha | Spezialitäten | Afrikanischer Cassavasalat | 2 – Küchenbestätigung erforderlich | – | Welche Zutaten (z. B. Ugba/Ölbohnen, Crayfish, Fisch) gehören dazu? | – |
| Nkwobi | Spezialitäten | Rinderfuß in scharfer Senfsauce | 3 – Mögliche Allergene/Zusatzstoffe prüfen | J: PM: „scharfer Senfsauce“ | – | – |
| Isiewu | Spezialitäten | Ziegenkopf in würziger Senfsauce | 3 – Mögliche Allergene/Zusatzstoffe prüfen | J: PM: „würziger Senfsauce“ | – | – |
| Tilapia | Fisch | Gebratener oder gekochter Fisch mit Beilage | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: Name / PM: Fisch | „Mit Beilage“ – welche Beilagen (Pommes, Reis, Salat)? Frittieröl gemeinsam genutzt? | – |
| Fried Fish & Plantain | Fisch | Gebratener Fisch mit Kochbananen | 3 – Mögliche Allergene/Zusatzstoffe prüfen | D: Name / PM: „Gebratener Fisch“ | – | – |
| Extra Pounded Yam | Extras | – | 2 – Küchenbestätigung erforderlich | – | Reines Yam-Produkt oder Fertigmehl? Etikett des Pounded-Yam-Mehls aufbewahren. | – |
| Guinness | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Bier (Gerstenmalz) – Etikett prüfen | – | – |
| Krombacher | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Bier (Gerstenmalz) – Etikett prüfen | – | – |
| Warsteiner | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Bier (Gerstenmalz) – Etikett prüfen | – | – |
| Becks | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Bier (Gerstenmalz) – Etikett prüfen | – | – |
| Diebels | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Bier (Gerstenmalz) – Etikett prüfen | – | – |
| Desperados | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Biermischgetränk – Etikett prüfen | – | – |
| Malzbier | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Malzgetränk (Gerstenmalz) – Etikett prüfen<br>1: Malzbier – Farbstoff (Zuckerkulör)? Etikett prüfen | – | – |
| Heineken | Bier | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | A: Bier (Gerstenmalz) – Etikett prüfen | – | – |
| Cola Light | Softdrinks | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Cola-Getränk – Farbstoff? Etikett prüfen<br>9: „Light“ – Süßungsmittel? Etikett prüfen<br>10: Aspartam enthalten? Etikett prüfen<br>12: Koffeingehalt > 150 mg/l? Etikett prüfen | – | – |
| Sprite | Softdrinks | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 9: Süßungsmittel? Etikett prüfen | – | – |
| Fanta | Softdrinks | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Farbstoff? Etikett prüfen<br>9: Süßungsmittel? Etikett prüfen | – | – |
| Red Bull | Softdrinks | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 12: Energy Drink – Koffeingehalt laut Dose prüfen (Angabe mg/100 ml) | – | – |
| Wasser | Softdrinks | – | 2 – Küchenbestätigung erforderlich | – | Welches Wasser (Marke)? Etikett prüfen. | – |
| Glas | Wein | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | L: Wein – „enthält Sulfite“ laut Etikett prüfen | – | – |
| Wein / Sekt, Flasche | Wein | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | L: Wein/Sekt – „enthält Sulfite“ laut Etikett prüfen | – | – |
| Jack Daniel's | Spirituosen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Spirituose – Farbstoff (E150a)? Etikett prüfen | – | – |
| Hennessy | Spirituosen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Cognac – Farbstoff (E150a)? Etikett prüfen | – | – |
| Wodka | Spirituosen | – | 2 – Küchenbestätigung erforderlich | – | Welche Marke? Etikett prüfen. | – |
| Baileys Cream | Spirituosen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | G: Sahnelikör – „enthält Milch“ laut Etikett prüfen | – | – |
| Likör | Spirituosen | – | 2 – Küchenbestätigung erforderlich | – | Welcher Likör genau? Produkt benennen und Etikett prüfen. | – |
| Chivas Regal | Spirituosen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Whisky – Farbstoff (E150a)? Etikett prüfen | – | – |
| Chantre | Spirituosen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Weinbrand – Farbstoff? Etikett prüfen | – | – |
| Hennessy | Flaschen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Cognac – Farbstoff (E150a)? Etikett prüfen | – | – |
| Jack Daniel's | Flaschen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Spirituose – Farbstoff (E150a)? Etikett prüfen | – | – |
| Chantre | Flaschen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | 1: Weinbrand – Farbstoff? Etikett prüfen | – | – |
| Champagne Moët Impérial | Flaschen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | L: Champagner – „enthält Sulfite“ laut Etikett prüfen | – | – |
| Rosé Moët | Flaschen | – | 3 – Mögliche Allergene/Zusatzstoffe prüfen | L: Champagner – „enthält Sulfite“ laut Etikett prüfen | – | – |
| Ciroc | Flaschen | – | 2 – Küchenbestätigung erforderlich | – | – | – |

## Legende

**Allergene (LMIV Anhang II):** A = Glutenhaltiges Getreide (Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut) · B = Krebstiere · C = Eier · D = Fisch · E = Erdnüsse · F = Soja · G = Milch (einschließlich Laktose) · H = Schalenfrüchte (Mandeln, Haselnüsse, Walnüsse, Cashew, Pekan, Para, Pistazien, Macadamia) · I = Sellerie · J = Senf · K = Sesamsamen · L = Schwefeldioxid und Sulfite (> 10 mg/kg bzw. mg/l) · M = Lupinen · N = Weichtiere

**Zusatzstoffe/Angaben:** 1 = „mit Farbstoff“ (LMZDV § 5 Abs. 1 Nr. 1) · 2 = „mit Konservierungsstoff / konserviert“ (LMZDV § 5 Abs. 1 Nr. 2) · 3 = „mit Antioxidationsmittel“ (LMZDV § 5 Abs. 1 Nr. 3) · 4 = „mit Nitritpökelsalz / mit Nitrat“ (LMZDV § 5 Abs. 1 Nr. 4) · 5 = „mit Geschmacksverstärker“ (LMZDV § 5 Abs. 1 Nr. 5) · 6 = „geschwärzt“ (LMZDV § 5 Abs. 1 Nr. 6) · 7 = „gewachst“ (LMZDV § 5 Abs. 1 Nr. 7) · 8 = „mit Phosphat“ (LMZDV § 5 Abs. 1 Nr. 8) · 9 = „mit Süßungsmittel(n)“ (LMZDV § 5 Abs. 1 Nr. 9) · 10 = „enthält eine Phenylalaninquelle“ (LMZDV § 5 Abs. 1 Nr. 11) · 11 = „kann bei übermäßigem Verzehr abführend wirken“ (LMZDV § 5 Abs. 1 Nr. 12) · 12 = „erhöhter Koffeingehalt (> 150 mg/l) – mit Angabe mg/100 ml“ (FrSaftErfrischGetrV § 6; LMIV Anh. III Nr. 4.1) · 13 = „chininhaltig“ (Erfrischungsgetränke mit Chinin (siehe LAVES-Merkblatt Nr. 9))
