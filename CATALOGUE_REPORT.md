# Catalogue implementation report

Implemented on 2 October 2026 in the existing Sepione Ceramic website.

## Result

The new `/catalogue` page displays all 29 supplied PDFs in separate 300x300 and 400x400 sections. Catalogue is included in both desktop and mobile navigation through the existing shared link list. The page reuses the existing secondary-page layout, cards, fonts, colors, spacing, focus styles, and link hover effects.

Each card shows a readable catalogue name, collection, PDF icon, file size, and two real links. View Catalogue opens the same-origin public PDF URL in a new tab with `noopener noreferrer`. Download PDF uses an anchor with the original filename in the HTML `download` attribute. Descriptive accessible labels identify the collection and document, and View announces the new tab. Both actions support keyboard activation.

The route includes the title `Catalogue | Sepione Ceramic` and the requested description. No old collection labels appear on the Catalogue page. Existing Supabase configuration, schema, database records, and Storage were not changed.

## Files created

- `src/app/catalogue/page.js` — page, metadata, collection sections, cards, actions, and empty/unavailable messages.
- `src/app/catalogue/Catalogue.module.css` — small layout additions to the existing shared page styles.
- `src/lib/catalogues.js` — build-time discovery, readable names, natural sorting, URL encoding, and graceful handling of invalid or missing PDFs.
- `tests/catalogues.test.mjs` — eight discovery and failure-handling tests.
- `CATALOGUE_INVENTORY.json` — filenames, public URLs, sizes, page counts, signatures, and SHA-256 hashes for all supplied PDFs.
- `CATALOGUE_REPORT.md` — this implementation and verification report.
- `public/catalogue/300x300/` — 13 original PDFs listed below.
- `public/catalogue/400x400/` — 16 original PDFs listed below.

## Files modified for this feature

- `src/components/Navbar.jsx` — one Catalogue entry in the existing link list, used by desktop and mobile menus.
- `src/components/icons/index.jsx` — document and download icons using the existing icon conventions.
- `README.md` — catalogue maintenance and deployment notes.

The product information changes from the earlier request were retained. Its second column is Pieces per Box, with 8 for 300x300 and 5 for 400x400. The existing box areas, approximate weights, thicknesses, and responsive table styles remain intact.

## PDF inventory

All 29 source PDFs were inspected, parsed successfully, and had their first-page covers rendered and visually checked. Their collection and series labels match their source directories and filenames. The files are unencrypted and contain 2,228 pages in total. Embedded metadata titles can be stale, so display names derive from filenames.

No PDFs already existed in the website source tree before the copy. All 29 source hashes are unique, and every public copy has the same SHA-256 hash as its supplied original. Originals remain in the supplied source directories. PDF bytes and filenames were preserved, including the double space in the Step Riser filename; link URLs encode spaces and special characters.

### 300x300: 13 PDFs

Source: `D:\Projects\Sepione Ceramic\catalogue\300x300`

Destination: `public/catalogue/300x300/`

- `300x300MM COOL ROOF SERIES.pdf`
- `300x300MM GREEN SERIES.pdf`
- `300x300MM ORDINARY SERIES.pdf`
- `300x300MM PLAIN SERIES VOL-1.pdf`
- `300x300MM PLAIN SERIES VOL-2.pdf`
- `300x300MM PUNCH SERIES VOL-1.pdf`
- `300x300MM PUNCH SERIES VOL-2.pdf`
- `300x300MM PUNCH SERIES VOL-3.pdf`
- `300x300MM PUNCH SERIES VOL-4.pdf`
- `300x300MM PUNCH SERIES VOL-5.pdf`
- `300x300MM ROCK SERIES.pdf`
- `300x300MM RUSTIC SERIES.pdf`
- `300x300MM  STEP RISER SERIES.pdf`

### 400x400: 16 PDFs

Source: `D:\Projects\Sepione Ceramic\catalogue\400x400`

Destination: `public/catalogue/400x400/`

- `400X400MM NEW COLLECTION-2026.pdf`
- `400X400MM PLAIN SERIES VOL-1.pdf`
- `400X400MM PLAIN SERIES VOL-2.pdf`
- `400X400MM PLAIN SERIES VOL-3.pdf`
- `400X400MM PUNCH SERIES VOL-1.pdf`
- `400X400MM PUNCH SERIES VOL-2.pdf`
- `400X400MM PUNCH SERIES VOL-3.pdf`
- `400X400MM PUNCH SERIES-VOL-4.pdf`
- `400X400MM PUNCH SERIES-VOL-5.pdf`
- `400X400MM PUNCH SERIES VOL-6.pdf`
- `400X400MM ROCK MARBLE SERIES.pdf`
- `400X400MM ROCK SERIES.pdf`
- `400X400MM RUSTIC SERIES-VOL-1.pdf`
- `400X400MM RUSTIC SERIES-VOL-2.pdf`
- `400X400MM RUSTIC SERIES-VOL-3.pdf`
- `400X400MM RUSTIC SERIES-VOL-4.pdf`

## Verification

- `npm run lint` passed.
- `npm test` passed all 49 tests, including eight new catalogue tests.
- `npm run build` passed, including Next.js's TypeScript check phase, with no build warnings after correcting build-time file tracing.
- `/catalogue` is prerendered as a static route. Its server trace contains no catalogue PDFs or environment files; PDFs remain public assets.
- The production server ran with `npm run start -- --port 3100` and served `/catalogue` successfully.
- Production browser checks passed at 375, 768, 1024, and 1440 pixels. An additional 1080-pixel check verified the desktop-navbar breakpoint.
- Each collection contained the expected 13 or 16 cards at every tested width. Cards stack on mobile and use two columns at larger widths. Text stayed inside cards, actions did not overlap, tap targets were at least 44 pixels tall, and there was no horizontal page overflow.
- Desktop and mobile Catalogue links worked. The mobile menu closed after navigation, and the active desktop link identified the current page.
- All 29 direct PDF URLs returned successful responses with `application/pdf` and the expected content length. All 29 ranged requests returned valid PDF signatures and byte ranges.
- Every View Catalogue action opened the correct PDF in a new browser tab.
- Every Download PDF action produced a real browser download with the expected original filename. The entire downloaded file was read and its byte count and SHA-256 hash matched the inventory for all 29 PDFs.
- View and Download were also activated with Enter from the keyboard.
- Browser page errors and console errors were empty during the checks.
- Existing Supabase reads for both internal collection keys succeeded, returning the expected collection data. The information table headers were checked for regressions.
- Discovery tests cover missing folders, unavailable folders, invalid PDFs, non-PDF files, symlinks, URL characters, natural volume sorting, and files removed or replaced during inspection. Missing files are omitted, and one unavailable collection does not break the other.
- Catalogue and navigation screenshots were visually reviewed. A final independent code review found no actionable defects.

Browser results and screenshots are saved in:

`C:\Users\Rangpariya Rudra\.codex\visualizations\2026\10\02\01a0fc3d-a2cb-7c80-bbf1-d63438517727\sepione-catalogue-qa`

## Deployment and maintenance

Add, replace, or remove PDFs under the two public collection folders, then rebuild and redeploy. Discovery runs during the build and does not require filesystem access when users request the deployed page. Include the public assets with the deployment. No Windows filesystem paths are used in frontend PDF links.

The files total **1,237,833,375 bytes**, approximately **1.24 GB**. Individual PDFs range from about 5.3 MB to 69.5 MB. Vercel documents a CLI source-upload limit of 100 MB for Hobby and 1 GB for Pro, so these unmodified assets exceed that CLI upload route's limits. Use the project's connected Git deployment flow for these repository assets. The CLI limits do not establish a universal static-output size limit. See [Vercel limits](https://vercel.com/docs/limits) and [Vercel Git deployments](https://vercel.com/docs/git).

The implementation uses Next.js public static assets and standard same-origin anchors, compatible with the documented deployment model. Local production behavior was verified; no Vercel deployment, push, or commit was performed, so live production hosting has not been tested.

## Issues and limitations

No feature-related build, lint, TypeScript, or runtime failures remain. The test runner emits an existing Node module-type warning; all tests pass. The large PDF collection requires the deployment method described above and can make individual downloads take longer on slower connections.

Automatic approval review rejected recursive cleanup of temporary PDF cover-review images with the reason `blocked by policy`. Those temporary images remain outside the website repository at `D:\Projects\Sepione Ceramic\tmp\pdfs\catalogue-cover-check`; the catalogue implementation and public PDFs are unaffected.
