# Image inventory — Afrolink website

_Last audited: 2026-10-09 (branch `image-seo-2026-10`). Every image was opened and inspected before assignment; file names were only used as initial evidence._

## How images reach the site
- Source photos live in `src/assets/{menu,gallery,venue,brand}/`. Astro generates responsive AVIF/WebP/JPEG variants at build time (`_astro/*.avif|webp|jpg`); originals in `src/assets` are never served directly.
- The owner's original PNGs are kept intact in the git-ignored folder `owner-assets/menu-originals/` and are never deployed. Retired derived copies are in `owner-assets/retired/`.
- `public/` contains only icons, `favicon.ico`, `og-image.jpg` and `site.webmanifest`.
- The hero image (Egusi) is `loading="eager"` + `fetchpriority="high"`. Every other image is `loading="lazy"`.

## 1. Removed from the website (brief 2026-10-09)
| Generated URL reported | Source file | Previously used in | Action |
|---|---|---|---|
| `grilled-fish-plantain.qEXkYVGB_1GSEBk.webp` | `src/assets/gallery/grilled-fish-plantain.jpg` | gallery entry; legacy "Fish" category image | Reference removed from `gallery.ts` and `menu.ts`; source moved to `owner-assets/retired/` |
| `porridge-yam.CbgHkOK7_1nXD4M.avif` | `src/assets/gallery/porridge-yam.jpg` | Porridge Yam dish image; gallery entry; legacy "Beans, Yam & Plantain" category image | References removed from `dish-images.ts`, `gallery.ts`, `menu.ts`; source moved to `owner-assets/retired/` |

The unused legacy `image` field on menu categories was removed entirely. A test (`tests/images.test.ts`) fails if either photo is referenced again or appears in the built HTML.

## 2. Verified menu photography (owner-supplied, mapped one image → one dish)
Batch 1 (earlier on 2026-10-09):

| File (`src/assets/menu/`) | Original | Subject seen | Menu item |
|---|---|---|---|
| egusi-soup.jpg (1680×936) | egusi-soup.png | Egusi with a swallow side, watermark | Egusi Soup + hero + OG image |
| afang-soup.jpg | afang soup.png | Green leaf soup | Afang Soup |
| edikaikong.jpg | Edikaikong soup.png | Green leaf soup | Edikaikong |
| ogbono-soup.jpg | ogbono soup.png | Draw soup | Ogbono Soup |
| ofe-nsala.jpg | Ofe Nsala soup.png | White soup | Ofe Nsala |
| okra-soup.jpg | okra-soup.png | Okra soup | Okra Soup |
| banga-soup.jpg | banga soup.png | Palm-nut soup | Banga Soup |
| efo-riro.jpg | Efo Riro-soup.png | Spinach stew | Efo Riro |
| bitterleaf-soup.jpg | bitterleaf-soup.png | Leaf soup | Bitterleaf Soup |
| fishermans-soup.jpg | Fisherman’s Soup.png | Seafood soup | Fisherman's Soup |
| black-soup.jpg | black-soup.png | Dark leaf soup | Black Soup |
| oha-soup.jpg | oha-soup.png | Leaf soup | Oha Soup |
| fried-rice.jpg | freid rice.png | Fried rice | Fried Rice |
| jollof.jpg | jollof.png | Jollof rice, meat, plantain | Jollof Rice |
| white-rice-stew.jpg | white-rice and stew.png | White rice + stew + plantain | White Rice |
| assorted.jpg | assorted.png | Mixed meat with plantain | Assorted Plate |
| tilapia.jpg | tilapia.png | Whole tilapia with plantain | Tilapia |
| vegetable-soup.jpg | vegetable-soup.png | Leafy vegetable soup | Soups showcase (featured) |

Batch 2 (new in this release, 12 images incorporated):

| File (`src/assets/menu/`) | Original (`owner-assets/menu-originals/`) | Size | Subject seen | Menu item |
|---|---|---|---|---|
| fried-fish-plantain.jpg | FISH AND PLAINTAINS.png | 1086×1448 (3:4) | Fried whole fish, plantain, onion rings, peppers. A **different** photo from the retired grilled-fish image | Fried Fish & Plantain |
| mackerel-fish-slices.jpg | fish-slice-mackerel.png (owner, 2026-10-10; previously in `public/`) | 1086×1448 (3:4) | One golden-brown fried mackerel piece on a white plate | Mackerel Fish Slices |
| yam-porridge.jpg | Porridge Yam.png | 1254×1254 | Yam cubes with greens in red sauce | Porridge Yam |
| abacha.jpg | abacha.png | 1374×1145 | Shredded cassava salad | Abacha |
| beans-plantain.jpg | beans-and-plaintains.png | 1133×1388 | Beans in red sauce + fried plantain | Beans & Plantain |
| coconut-rice.jpg | coconut-rice.png | 1322×1190 | Rice with peppers and meat | Coconut Rice |
| isiewu.jpg | esi ewu-goathead.png | 1374×1145 | Goat-head dish in a wooden bowl | Isiewu |
| fried-yam-egg-sauce.jpg | friedyam-edd-sauce.png | 1254×1254 | Fried yam sticks + egg sauce | Fried Yam & Egg Sauce |
| okpa.jpg | okpa.png | 1254×1254 | Okpa pieces | Okpa |
| snail.jpg | snails.png | 1254×1254 | Snails in tomato-onion sauce | Snail |
| stockfish.jpg | stockfish-spicy.png | 1254×1254 | Stockfish in red sauce | Stockfish |
| suya.jpg | suya.png | 1320×1191 | Suya with onion, tomato, cucumber, chilli | Suya (replaces the gallery photo as the menu image) |
| extra-pounded-yam.jpg | extra-poundedyams.png | 986×1594 | A portion of pounded yam | Extra Pounded Yam |

Processing: EXIF orientation applied, all metadata stripped, long edge ≤ 1600 px, progressive mozjpeg q84. Quality of all 12 is high (sharp, well lit), but like batch 1 they appear to be styled/AI-composited presentation images on Afrolink's table settings (risk R-020). The site labels them as serving suggestions.

**Result: all 31 food menu items now have a matching image. 0 "Image coming soon" placeholders remain.**

## 3. Gallery photography (genuine Afrolink photos, `src/assets/gallery/`)
There are 21 entries in `src/data/gallery.ts`, all previously audited and unchanged apart from the two removals. The owner presentation images are **not** added to the gallery. The gallery stays "genuine Afrolink photographs only", and adding them would show the same image twice on the one page (menu + gallery). Two genuine photos are also reused as dish images: pepper-soup.jpg (Pepper Soup) and nkwobi.jpg (Nkwobi). `suya-plantain.jpg` remains in the gallery only. `egusi-pounded-yam.jpg` is the poster for the David On The Go video.

Venue photos (`src/assets/venue/`): interior.jpg, welcome-sign.jpg, kitchen-pot.jpg are used in About.

## 4. Unused / duplicate
| File | Status |
|---|---|
| `src/assets/menu/jollof-rice-plantain.jpg` | Second jollof image from batch 1. Not mapped (Jollof uses `jollof.jpg`) and not emitted in the build. Kept as an alternative |
| `owner-assets/retired/grilled-fish-plantain.jpg`, `porridge-yam.jpg` | Retired per owner brief; never to be reused |

A perceptual-hash check (dHash) of all 62 site images found no duplicates. The only near matches were different dishes photographed on the same tablecloth.

## 4b. Extras correction (2026-10-09)
Inventory of every file with "extra" in its name (case-insensitive, whole project): `extra-poundedyams.png`, `extra-garri.png`, `extra-rice.png`, `extra-yams.png` (originals in `owner-assets/menu-originals/`; `public/` contains none). All four now appear in the Extras section at €4.00:

| File (`src/assets/menu/`) | Original | Size | Subject seen | Menu item |
|---|---|---|---|---|
| extra-pounded-yam.jpg | extra-poundedyams.png | 986×1594 | Pounded yam | Extra Pounded Yam |
| extra-garri.jpg | extra-garri.png | 1517×1037 | Yellow garri (eba) | Extra Garri (owner-approved) |
| extra-rice.jpg | extra-rice.png | 1312×1199 | Plain white rice | Extra Rice (owner-approved) |
| extra-yam.jpg | extra-yams.png | 1454×1082 | Boiled yam slices | Extra Yam (added: image unambiguous — owner to confirm) |

Total food items with images: 34. The section below is superseded.

## 5. Needs clarification (owner) — superseded by 4b
| Original | Subject | Why not used |
|---|---|---|
| extra-garri.png | Garri (eba) on a plate | "Extra Garri" is not on the verified menu. Only "Extra Pounded Yam" is |
| extra-rice.png | Plain white rice | "Extra Rice" is not on the verified menu |
| extra-yams.png | Boiled yam pieces with pepper sauce | "Extra Yam" is not on the verified menu |

If the owner confirms these extras exist (each at €4), add them to the `extras` category in `src/data/menu.ts`. The prepared images can then be mapped the same way.

## Open owner questions
- Confirm rights/provenance of all owner-supplied presentation images (R-020).
- Confirm whether Extra Garri / Extra Rice / Extra Yam are offered.
