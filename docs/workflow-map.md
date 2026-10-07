# Workflow Map — `afrolink-restaurant-online`

| Field | Value |
|-------|-------|
| Owner (DRI) | Marcel — Maxpromo Digital |
| Last reviewed | 2026-10-07 |

## Change a price or dish
1. Edit `src/data/menu.ts` or `src/data/drinks.ts`.
2. Update the matching line in `tests/content.test.ts`.
3. `npm run verify` — must pass.
4. Commit → push → Vercel deploys (after Marcel's approval).

## Add a gallery photo
1. `npm run prepare-image -- "<photo>" <kebab-name>.jpg` (strips GPS/EXIF, resizes to ≤ 2000 px).
2. Add `{ file, alt, caption? }` to `src/data/gallery.ts` — caption only when the dish is certain.
3. `npm run verify`.

## Correct the spirit serving sizes
Edit the single `SPIRIT_GLASS` constant in `src/data/drinks.ts`, set `verified: true`, update the test.

## Release
Local verify → Marcel visual review (375 / 390 / 430 / 768 / 1024 / 1440) → GitHub push → Vercel preview → Marcel approves → production + domain → test QR code before printing.
