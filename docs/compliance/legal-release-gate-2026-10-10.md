# Legal release gate — Impressum, privacy, storage, forms (2026-10-10)

Branch `discovery-ratings-2026-10`. Nothing in this review was guessed: operator data stays `null` in `src/data/legal.ts` until the owner supplies it, and the pages show "Angabe ausstehend" plus a visible incompleteness notice. **This is not legal advice; a lawyer or the owner's adviser should review the final texts.**

## 1. What the website actually does (verified in code and in the browser)

| Area | Finding |
|---|---|
| Cookies | **None** for visitors while ratings are off (browser test: 0 cookies after browsing 6 page types, opening panels and the lightbox). With ratings on: `afl_rv` (only after a guest submits a rating, 12 months, HttpOnly) and `afl_admin` (staff login, ≤ 8 h). |
| Local storage | `afl-lang` only after a visitor uses the language switcher. With ratings on: `afl-rated:<dish>` after rating. Language auto-detection reads the browser language without storing anything. |
| Third parties before interaction | **None** (browser test across home, menu, dish, gallery, contact, delivery: no requests to other hosts). Fonts and images are self-hosted. No analytics, no ads, no tag managers. |
| Videos | YouTube (youtube-nocookie.com) / Facebook load **only after a click**; notices next to the videos now link to the privacy policy. Verified: YouTube hosts are contacted only after the click. |
| Forms | Enquiry assistant composes text locally; it never submits to any server (submit is blocked; without JS the form cannot be submitted implicitly). Sending happens only if the visitor opens WhatsApp. Rating form (when enabled) posts to our own API only. Management login only for staff. |
| Hosting | Vercel Inc. (Pro plan — commercial use allowed), functions in Frankfurt (fra1), static pages via Vercel's global network. Vercel is certified under the EU-US Data Privacy Framework. |
| Ratings database (when enabled) | Neon, region Frankfurt; Neon is DPF-certified and offers a DPA. |
| Health data | Guests may send allergy / diabetes information in enquiries → special category data (Art. 9 GDPR); now disclosed with legal basis. |

## 2. Corrected in this review

- Privacy policy rewritten to match the implementation (DE binding, EN/FR translations): controller block from operator data; hosting incl. Frankfurt functions and DPF basis; **exact list of storage keys** (the old text said "no cookies", which would have become false with ratings); click-to-load videos with DPF note; contact/reservation processing with legal bases and deletion criteria; **health data (allergies, diabetes) under Art. 9**; ratings section (only in builds with ratings on); no automated decisions; right to object (Art. 21) highlighted; complaint authority with full address (LDI NRW, Kavalleriestraße 2–4, 40213 Düsseldorf); "Stand: Oktober 2026".
- Processor agreements are **only claimed once confirmed** (`legal.processors`).
- Impressum: added **supervisory authority** (restaurants serving alcohol in NRW need a Gaststättenerlaubnis — source: Wirtschafts-Service NRW) and **consumer dispute resolution (§ 36 VSBG)**; items the owner confirms as not applicable are hidden instead of "pending"; "Verantwortlich für den Inhalt" (§ 18 MStV) is optional for a restaurant site and hidden unless supplied; **no EU ODR link** (platform closed 20 July 2025, Reg. (EU) 2024/3228).
- Privacy links next to the video notices (informed click-to-load).
- Tests: storage keys in code must all be disclosed; rating storage not described while ratings are off; unconfirmed processor agreements never claimed; no ODR link.

## 3. Questions for the owner (only what the law needs and only the owner knows)

1. **Operator:** full legal name of the owner (if sole trader) or the exact company name — and the **legal form** (Einzelunternehmen, GbR, UG, GmbH …).
2. **Representative:** if a company, the managing director(s)/partners authorised to represent it (otherwise "not applicable").
3. **Address for service:** is Berzeliusstraße 7, 45144 Essen the operator's address for legal service? If not, which address?
4. **E-mail address** for the Impressum (mandatory; must be monitored).
5. **Commercial register:** registry court and number — or "not registered".
6. **USt-IdNr. or W-IdNr.** — or "none issued". (Do **not** publish the ordinary tax number.)
7. **Gaststättenerlaubnis:** which authority issued it, exactly as written on the permit (e.g. the city's public-order/trade office).
8. **Employees** on 31 Dec 2025: 10 or fewer → nothing to state; more than 10 → confirm the statement "not willing to take part in consumer arbitration" (or name the arbitration board if they want to participate).
9. **Processor agreements:** accept Vercel's Data Processing Addendum in the Vercel account (account holder: Marcel / Maxpromo Digital). Because the hosting account belongs to the agency, an **AV-Vertrag between Afrolink (controller) and Maxpromo Digital (processor)** is recommended. Before ratings go live: Neon DPA as well.
10. **Internal practice (confirm):** allergy/diabetes information from guests is used only to prepare the food; enquiries/reservations are deleted when no longer needed unless retention duties apply (as now stated in the privacy policy).

When answered: fill `src/data/legal.ts`, run `npm run verify` — the incompleteness notices disappear automatically.

## 4. Remaining blockers to lawful publication

| Blocker | Why | Status |
|---|---|---|
| Impressum incomplete (items 1–8) | § 5 DDG; missing data can lead to fines and competitor warnings (Abmahnungen) | **Open — also affects the current live site**, which has the same gaps |
| Controller identity in the privacy policy | Art. 13(1)(a) GDPR | Open (same data as items 1–4) |
| Processor agreement with Vercel (and Maxpromo) | Art. 28 GDPR | Open (item 9) |
| On-site allergen information for dine-in guests | LMIDV § 4 — website alone is not sufficient | Open (kitchen; see allergen-reconciliation-workflow.md) |
| Ratings | Neon DPA + owner review of the ratings privacy text before `RATINGS_ENABLED=true` | Not active; gated |

No cookie banner is needed in the current configuration (only strictly necessary storage set on the visitor's own action; external videos only after an informed click).
