# Sepione Ceramic content corrections

Implemented directly in the existing project. No theme, font, image, hero, animation, or unrelated layout changes were made. The only CSS changes adjust the Product Information table to its five columns and preserve readable scrolling on small screens.

## Collection terminology and routes

- Replaced user-facing 12x12 / 12 × 12 with **300x300** collection labels or **300 × 300 mm** dimensions.
- Replaced user-facing 16x16 / 16 × 16 with **400x400** collection labels or **400 × 400 mm** dimensions.
- Covered desktop/mobile navigation, homepage collections and product previews, footer/about links, collection headings and SEO metadata, cards, product dialogs, WhatsApp quote text, admin size labels and import progress, and the HTML reference's headings and image descriptions.
- Public routes are now `/tiles/300x300` and `/tiles/400x400`. The old `/tiles/12x12` and `/tiles/16x16` URLs return permanent **308** redirects, preserving query parameters. Catalogue cache revalidation targets the new routes.

## Product Information and packaging

Removed the entire Size column and replaced the former square-foot per-tile column with Area / Box (m²). The table now shows:

| Collection | Pieces per Box | Area / Box (m²) | Per Box Weight | Thickness |
| --- | ---: | ---: | --- | --- |
| 300x300 | 8 | **0.72** | 12.5 kg approx. | 9 mm approx. |
| 400x400 | 5 | **0.80** | 18.5 kg approx. | 11.5 mm approx. |

The latest correction replaces the second column's per-tile area with Pieces per Box: 8 for 300x300 and 5 for 400x400. The requested 0.72 / 0.80 m² box coverage values remain unchanged and agree with the piece counts and metric dimensions. Captions and notes now explain metric collections, pieces, and box coverage. Product descriptions retain “tile.” Other packing information already uses boxes and needs no replacement.

The follow-up adds Per Box Weight and Thickness as proper table columns, using exactly the requested values above. Size remains removed and coverage values are unchanged. The table retains its colors, borders, typography, links, accessible headers, and existing desktop/mobile cell padding. Five equal columns and an 800px minimum table width keep the text readable; the existing overflow container scrolls horizontally at 375/768px while the overall page fits the viewport. At 1024/1440px, the entire table fits without horizontal scrolling.

## Files changed

Paths below are relative to this `website` repository:

| File | Change |
| --- | --- |
| `src/lib/collection-formats.js` | New shared mapping for metric labels, routes, dimensions, pieces per box, box coverage, approximate box weight/thickness, and import-status presentation. |
| `src/components/Navbar.jsx` | Metric labels and links in both navigation menus. |
| `src/components/Footer.jsx` | Metric collection destinations. |
| `src/components/AnimatedHome.jsx` | Metric collection labels and destinations for collections/product previews. |
| `src/components/AnimatedAbout.jsx` | Updated collection destination. |
| `src/components/AnimatedInformations.jsx` | Five-column table, metric collection labels, pieces per box, box areas, approximate weights/thicknesses, caption and note. |
| `src/components/SecondaryPages.module.css` | Table column sizing and mobile cell padding only. |
| `src/components/TileCard.jsx` | Metric size badges. |
| `src/components/TileModal.jsx` | Metric product dimensions and quote text. |
| `src/app/tiles/300x300/page.js` | Moved from `tiles/12x12/page.js`; updated heading and metadata. |
| `src/app/tiles/400x400/page.js` | Moved from `tiles/16x16/page.js`; updated heading and metadata. |
| `src/app/admin/page.js` | Metric catalogue size labels. |
| `src/app/admin/add-tiles/page.js` | Metric size option labels with compatible stored values. |
| `src/app/admin/bulk-migrate/page.js` | Metric collection labels in source progress/failure display. |
| `src/lib/revalidate-catalog.js` | Revalidate new public routes after catalogue writes. |
| `next.config.mjs` | Backward-compatible permanent redirects. |
| `stitch_ui.html` | Metric headings and descriptive image text. |
| `tests/collection-formats.test.mjs` | Storage compatibility, distinct tile/box areas, redirects, and import-display regressions. |
| `README.md` | Documents coverage and route/storage compatibility. |
| `CONTENT_REPORT.md` | This implementation and QA report. |

## Verification

- `npm run lint`: passed, no lint errors.
- `npm test`: **41 passed**, none failed or skipped.
- `npm run build`: passed; compilation and Next.js TypeScript checks completed successfully.
- Ran the production build locally at `http://localhost:3100` and completed **41 browser checks** using Edge/Playwright, with zero browser runtime errors.
- Original content audit verified homepage, About, Product Information, and both populated live catalogues at **375, 768, 1024, and 1440px**, with no document overflow.
- Follow-up verification reran lint, all 41 tests, and the production build. Browser checks of the five-column table passed at all four widths: exact headers/data, balanced columns, unchanged 15px body/12px header fonts, no text overlap or page overflow, and no runtime or console errors. Verified localized table scrolling and keyboard access to the Thickness column at 375/768px; no table scrolling is needed at 1024/1440px.
- Verified mobile navigation at 375/768/1024px and desktop navigation at 1440px for both collections, including active links and mobile menu closure.
- Verified product cards, dialogs, metric quote URLs, filtering, clear filters, search, empty search results, and loading more designs. Inspected mobile dialog and mobile/desktop table screenshots.
- Verified admin presentation using mocked browser API responses, without performing real authentication, uploads, edits, deletions, or migration.
- Audited all **1,926** publicly readable catalogue records: product names and categories contain no old collection terms.
- Final repository search classified all remaining legacy terms as internal compatibility data or historical artifacts. Public page text, navigation, metadata, image alt text, and accessible labels contain none.

## Internal terminology retained

Existing Supabase size keys, API query values, upload option values, homepage data props, Cloudinary IDs/URLs, local import folder names, and compatibility test fixtures retain `12x12` / `16x16`. Changing these would disconnect existing catalogue records or assets and alter import identity. Shared presentation mapping supplies metric labels without changing that data.

Old URLs appear only as redirect sources. Historical `FIX_REPORT.md`, the source ZIP snapshot, and the parent workspace's `jpg_structure.txt` retain their original references; they are not rendered by the website. Existing Cloudinary URL examples and import configuration documentation accurately describe those unchanged internal paths.

The changes are local and have not been deployed to Vercel.
