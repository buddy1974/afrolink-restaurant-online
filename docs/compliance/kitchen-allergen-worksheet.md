# Küchen-Arbeitsblatt: Allergene & Zusatzstoffe (Prozess)

**Ziel:** Für jedes Gericht und Getränk eine geprüfte, schriftliche Aufstellung der 14 Hauptallergene und der kennzeichnungspflichtigen Zusatzstoffe – als Grundlage für Speisekarte, Website und mündliche Auskunft.

## 1. Erstaufnahme (einmalig)

1. `docs/compliance/allergen-verification-matrix.csv` öffnen (Excel/LibreOffice, Trennzeichen „;“).
2. Pro Zeile mit der Küchenleitung durchgehen:
   - die **Standardfragen** (siehe `allergen-verification-matrix.md`) und die **spezifischen Küchenfragen** beantworten,
   - **Etiketten** aller zugekauften Produkte (Brühwürfel, Gewürzmischungen, Saucen, Fertigmehle, Getränke) fotografieren und ablegen,
   - in den Spalten „Allergen A … N“ und „Zusatz 1 … 13“ ein **x** setzen, wo zutreffend,
   - Kreuzkontakt-Hinweis notieren (z. B. gemeinsame Fritteuse),
   - „Geprüft von“ (Name) und „Geprüft am“ (Datum) eintragen.
3. Die ausgefüllte Datei ist zugleich die **schriftliche Dokumentation (Kladde)** für Gäste und Lebensmittelüberwachung – im Restaurant griffbereit halten.
4. Die Daten an Maxpromo Digital geben → Einträge in `src/data/allergens.ts` (Abschnitt `VERIFIED`) mit `status: 'verified'`, `allergens`, `additives`, `verifiedBy`, `verifiedOn` → Tests laufen → Website zeigt die Kennzeichnung je Gericht.

## 2. Bei jeder Änderung (Rezept, Lieferant, Produkt)

- Neues Rezept oder anderes Produkt/anderer Lieferant ⇒ Zeile neu prüfen, Datum aktualisieren, Etikett ablegen.
- Website-Eintrag aktualisieren (oder vorübergehend auf `pending` setzen – dann zeigt die Website wieder „bitte Personal fragen“).
- Gedruckte Speisekarte im gleichen Zug anpassen (gleiche Codes A–N / 1–13).

## 3. Regelmäßig

- Vierteljährlich: Stichprobe – stimmen Etiketten im Lager mit der Matrix überein?
- Neue Mitarbeitende: Einweisung, wo die Dokumentation liegt und wie Auskunft gegeben wird.

## 4. Nicht tun

- Keine Allergene aus Gerichtsnamen, Fotos oder Internet-Rezepten übernehmen – nur aus dem eigenen Rezept und den Etiketten.
- Keine pauschalen Hinweise („alle Speisen können Spuren enthalten“) statt gerichtsbezogener Angaben.
- Keine Zusage „allergenfrei“, „vegan“ oder „mild“, wenn die Küche das nicht sicher gewährleisten kann.
