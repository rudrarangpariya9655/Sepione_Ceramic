# Sepione Ceramic

Next.js 16 website for the Sepione parking and outdoor tile catalogue.

## Run locally

From this `website` directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` and configure the existing Supabase and Cloudinary projects if starting a new checkout. Never commit credentials.

## Checks

```sh
npm run lint
npm test
npm run build
```

The tests cover catalogue validation, stable pagination, category lookup, unavailable services and upload metadata validation. Live catalogue access requires a network connection to Supabase. Missing configuration and service failures display recoverable UI rather than crashing the pages.

## Project notes

- Homepage imagery comes from the supplied Sepione reference website; sources are recorded in `public/images/README.md`.
- Hanken Grotesk and Syne are self-hosted in `src/app/fonts`, with their license notices. Building does not require Google Fonts access.
- Public pages use the Supabase anonymous key and its existing row-level security permissions.
- Company experience is displayed as **10 years**, as requested.
- The information page lists 8 / 5 pieces per box and box area of 0.72 / 0.80 m² for 300x300 / 400x400, with approximate box weights and thicknesses. Other packing and lab specifications must be supplied for the selected product.
- Public collection routes are `/tiles/300x300` and `/tiles/400x400`; the previous URLs permanently redirect. Existing database size keys and image/source paths are retained for compatibility, with metric presentation defined in `src/lib/collection-formats.js`.
- Admin source is included in Git and Tailwind's automatic source scan. Admin operations require `ADMIN_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` and the Cloudinary configuration; these values must remain server-side.
- Bulk migration uses a local external directory configured by `TILES_LOCAL_PATH` and process-local progress; use it in a persistent local Node server, not a serverless deployment.

## Admin configuration and rollout

Set `ADMIN_SECRET` to a unique randomly generated value of at least 32 characters. Missing, short and placeholder values fail closed; the previously documented example is not accepted. This project uses `ADMIN_SECRET`, not `ADMIN_PASSWORD`. For local development put it in ignored `.env.local`. For production set it in the hosting provider's server environment and restart/redeploy. Never add a `NEXT_PUBLIC_` prefix or place credentials in `next.config.mjs` or committed source.

Before enabling uploads or edits, apply the reviewed identity migration using [database/README.md](database/README.md). It protects concurrent writes without changing existing catalogue metadata or images. Admin/public reads remain available before rollout.

Bulk migration is optional. Set `TILES_LOCAL_PATH` to an existing, readable absolute directory on the machine running Next.js. Its structure is `12x12/<category>/<optional-series>/<image>` and/or `16x16/<category>/<optional-series>/<image>`. The directory is external input, not a deployment asset. Missing, invalid and unreadable paths disable only migration and show a sanitized diagnostic in the admin tool. Do not point it at a folder until its contents have been reviewed. No source directories are created automatically.

New migration image IDs include the normalized relative path hash and image extension. Uploads never overwrite existing assets. Failed database writes attempt cleanup only for newly created assets after checking database references. If ownership/references cannot be verified or cleanup fails, the admin receives the asset ID for manual reconciliation; verify it is unused before removing it in Cloudinary.

## Catalogue PDFs

The `/catalogue` page discovers valid PDFs in `public/catalogue/300x300/` and `public/catalogue/400x400/` during the production build. Add, replace, or remove files there and rebuild/redeploy to update the list. Missing, unreadable, or invalid files are omitted; empty collections display a contact message. The page uses no Supabase tables or Storage.

Original PDF filenames are preserved, including spaces, and each filename is URL-encoded in same-origin links. View opens the native browser PDF viewer in a new tab; Download uses a real anchor with the `download` filename. The static assets must be included in the deployment along with the application.

The 29 supplied PDFs total 1,237,833,375 bytes (about 1.24 GB). Use Vercel's connected Git deployment flow for the unmodified assets: the documented [CLI source-upload limits](https://vercel.com/docs/limits) are 100 MB for Hobby and 1 GB for Pro. Those CLI limits do not establish a universal static-output limit. See [CATALOGUE_REPORT.md](CATALOGUE_REPORT.md) and [CATALOGUE_INVENTORY.json](CATALOGUE_INVENTORY.json) for the file list and verification.

## Manual verification

Check the desktop and mobile homepage, image selector, contact anchors, mobile menu and Escape behavior. In both catalogues, check search, category changes, clear filters, loading additional results, keyboard product dialogs and quote links. Quote links open WhatsApp with the chosen design; they do not send a message automatically.
