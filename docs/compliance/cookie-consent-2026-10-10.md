# Cookies, storage and consent — assessment and evidence (2026-10-10)

Branch `discovery-ratings-2026-10`. Not legal advice; documents the technical behaviour and the reasoning so the owner or an adviser can review it.

## 1. What needs consent — and what does not

| Technology | Category | Consent? | Reasoning |
|---|---|---|---|
| `afl-consent` (local storage, 12 months) — stores the visitor's own privacy choice, no identifiers, never sent to a server | necessary | No | Remembering a consent decision is required to respect it (§ 25 Abs. 2 Nr. 2 TDDDG). Written only after the visitor makes a choice. |
| `afl_admin` (cookie, ≤ 8 h, management area, ratings builds only) | necessary | No | Authentication cookie for a service the user explicitly requests (WP29 Opinion 04/2012: authentication cookies exempt). |
| Language redirect on `/` from the `Accept-Language` header (vercel.json) | — | No device access | The header is sent by the browser with every request; nothing is read from or written to the device. The former client-side script (reading `navigator.languages` and `localStorage`) was **removed**, because reading device information via JavaScript falls under § 25 TDDDG / Art. 5(3) ePrivacy (EDPB Guidelines 2/2023). |
| `afl_lang` (cookie, 12 months) — remember language across visits | prefs | **Yes** | WP29 04/2012: UI-customisation cookies are exempt only for the session or when the user explicitly asks for persistence; a 12-month cookie therefore requires consent. Off by default. |
| YouTube (youtube-nocookie.com) and Facebook video embeds | media | **Yes** | Loading transmits the IP address to Google/Meta (incl. USA) and the players store information in the browser. A two-click step with provider/data information before loading is the approach recommended by German supervisory authorities; youtube-nocookie alone is not sufficient. |
| `afl_rv` (HttpOnly cookie, 12 months) + `afl-rated:<id>` (local storage) — remember own ratings (ratings builds only) | ratings | **Yes** | Serves the restaurant's data quality and the guest's convenience, not strictly necessary for submitting a rating. Opt-in tick box at the rating form ("Remember on this device"), unticked by default. Without it: no device storage; the server counts one rating per network, dish and day (daily-rotating, irreversible network key). |
| Fonts, images, CSS, JS | — | No | Self-hosted; no third-party requests. |
| Analytics, advertising, tracking, social plugins | — | — | **Not used.** |

**No banner on arrival.** Nothing optional runs before a decision, so a pop-up would add friction without protecting anything. Consent is collected **in context** (video step, rating tick box) and in the **privacy settings dialog**: Allow all / Necessary only / Save selection, granular toggles, no preselection, equal-weight buttons. The dialog is reachable from "Cookie-Einstellungen" in every footer and from the cookie policy. Withdrawal takes effect immediately: a playing video is removed, the `afl_lang` cookie is deleted, and stored ratings are removed (the HttpOnly cookie is expired via `DELETE /api/ratings`).

**Consent records.** Kept locally (`afl-consent`: version, timestamp, choices), expire after 12 months (the visitor is asked again on the next optional action), and contain no personal data. There is no server-side consent log, because it would require identifiers. The mechanism is documented here and versioned in code (`CONSENT_VERSION`).

## 2. Browser evidence (clean Chrome profiles, built site; script `afl-qa/consent-e2e.mjs`)

| Scenario | Cookies | Local / session storage | Third-party hosts contacted |
|---|---|---|---|
| 1. First visit, no interaction — `/`, `/en/`, `/fr/`, menu, dish page, `/fr/carte/`, gallery, contact, cookies, privacy | none | none | **none** |
| 2. "Necessary only" (nothing preselected: `media:false, prefs:false`) | none | `afl-consent` | none |
| 3. Allow external videos only, then play | none (first party) | `afl-consent` | YouTube hosts **only after play** (video loads without the extra step) |
| 4. Withdraw videos | — | `afl-consent` (`media:false`) | playing iframe removed; the next click shows the consent step; no new third-party request |
| 5a. Switch language, no consent | none | none | none |
| 5b. Allow "Remember language", switch | `afl_lang` | `afl-consent` | none |
| 5c. Withdraw "Remember language" | **none** (cookie deleted) | `afl-consent` | none |
| 6. Video two-click without prior consent (DE/EN/FR, 390 px) | none | none | **none before "Load video"**; YouTube after; "Load video" stores nothing |
| 6b. Facebook video, "Always allow external videos" | — | `afl-consent` (`media:true`) | Facebook hosts after the click |
| 8. Ratings enabled (dev server, isolated test DB): first visit | none | none | none |
| 8. Rate without "remember" (tick box unticked by default) | **none** | **none** | none |
| 8. Rate with "remember" | `afl_rv` (HttpOnly) | `afl-rated:abacha`, `afl-consent` (`ratings:true`) | none |
| 8. Withdraw ratings in settings | **none** (expired via API) | `afl-consent` only | none |

Ratings-off build: the cookie policy and privacy policy do not mention rating storage. Ratings-on build: they list `afl_rv`, `afl-rated:<id>` and `afl_admin`, and the settings show a "Remember ratings" toggle.

Accessibility: 0 axe violations (WCAG 2.2 AA + best practice) on the cookie, privacy and Impressum pages and with the settings dialog or the video consent step open — DE/EN/FR, 390 and 1440 px. Focus moves into the dialog, Escape closes it and focus returns to the trigger. The video step focuses "Load video".

## 3. Remaining items

- Owner data for Impressum/privacy (see `legal-release-gate-2026-10-10.md`). Operator name **Emeka Nwokorie** is now shown; legal form, address confirmation, e-mail, VAT/W-IdNr., register, Gaststättenerlaubnis authority and § 36 VSBG remain open.
- Processor agreements (Vercel DPA; Afrolink ↔ Maxpromo Digital; Neon before ratings).
- The server-side language redirect can only be verified on Vercel (preview checks in the release report).
- Third-party cookie names set by YouTube/Facebook are described generically: headless test browsers block third-party cookies, so the exact names could not be observed reliably.
