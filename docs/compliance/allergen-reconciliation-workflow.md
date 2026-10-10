# Allergen reconciliation workflow (kitchen)

_Created 2026-10-09 following the owner's correction: the codes on Afrolink's previous menu are the first-party baseline._

## Public presentation (owner instruction 2026-10-10)

Guests see Afrolink's declarations as Afrolink's own menu information — plain "Allergene / Zusatzstoffe" lists, no source or verification labels. Dishes without a declaration invite guests to ask the team. The status columns below are **internal only**.

## Where things stand (internal)

| Status (website) | Meaning | Dishes |
|---|---|---|
| **Previously declared** (shown with "declared on Afrolink's previous menu") | Codes printed on the old Afrolink menu, preserved exactly; reconciliation with the current recipe pending | Edikaikong, Ofe Nsala, Efo Riro, Bitterleaf Soup, Jollof Rice, White Rice, Beans & Plantain, Isiewu, Nkwobi, Pepper Soup, Stockfish, Fried Rice (12) |
| **Not previously declared** (shown with "no written information yet — ask staff") | Either on the old menu without codes, or new since then. Absence of codes is **not** "allergen-free" | the other 19 current items |
| **Confirmed for current recipe** | Kitchen signed off the current recipe and supplier labels | none yet |

Full register: `historical-allergen-register.md` (generated). Data: `src/data/allergens.ts`.

## Legal frame (summary, sources in docs/research)

- EU 1169/2011 Art. 9(1)(c), Art. 44, Annex II: the 14 allergen groups must be indicated for non-prepacked food.
- LMIDV § 4: in writing (menu, notice, electronic) **or** orally by staff if a written record exists, is accessible on request, and a visible notice says information is available. Online information alone is not sufficient for dine-in guests — the restaurant needs the written record / notice on site.
- LMZDV § 5 (since 9 June 2022): additive classes such as "mit Geschmacksverstärker", "mit Farbstoff" — same medium as the allergen information; footnote codes are allowed.

## Steps per dish (repeat for all 31 items)

1. Write down the **current** recipe incl. sides, stocks, seasoning cubes, marinades, oils, crayfish/dried fish, spice mixes (suya yaji: peanut!), flours for swallows.
2. Keep the **labels** of all bought products (bouillon cubes, spice mixes, pounded-yam flour, garri, drinks). Note brand.
3. Compare with the historical codes (register section 2 + 4). Resolve the listed discrepancies (e.g. Afang text with crayfish but no code; Fried Yam & Egg Sauce without egg code; Tilapia/Ogbono/Okra fish without code; Snail = molluscs).
4. Decide allergens (14 groups) and additive classes; note cross-contact (shared pots, fryers).
5. Sign: name of the responsible person + date.
6. Developer: add a `VERIFIED` record in `src/data/allergens.ts` (`status: 'verified'`, `allergens`, `additives`, `verifiedBy`, `verifiedOn`), run tests, regenerate `historical-allergen-register.md` and `allergen-verification-matrix`, deploy. The website then shows "Confirmed by the kitchen for the current recipe".
7. Update the printed menu / in-restaurant notice at the same time (legal requirement for dine-in).

Never add allergens from photos, dish names or internet recipes. The cultural "allergy hints" on dish pages (e.g. peanuts in traditional suya spice) are reasons to ask, not declarations.
