import * as fs from 'node:fs/promises';
import path from 'node:path';

// These reads run only while /catalogue is statically built. The PDFs belong in
// public assets, so omit build-time paths from Turbopack server file tracing.
const COLLECTIONS = ['300x300', '400x400'];
const PDF_SIGNATURE = Buffer.from('%PDF-');
const naturalOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function catalogueName(filename, collection) {
  const collectionPrefix = collection.replace('x', '\\s*[x×]\\s*');
  const name = filename
    .replace(/\.pdf$/i, '')
    .replace(new RegExp(`^${collectionPrefix}\\s*(?:mm)?(?:[\\s_-]+|$)`, 'i'), '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return name.split(' ').filter(Boolean).map(word => {
    if (/^vol\.?$/i.test(word)) return 'Vol.';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ') || `${collection} Catalogue`;
}

function sameFile(first, second) {
  return second.isFile() && !second.isSymbolicLink()
    && first.dev === second.dev && first.ino === second.ino
    && first.size === second.size && first.mtimeMs === second.mtimeMs;
}

async function readCatalogue(directory, filename, collection, fileSystem) {
  let handle;
  try {
    const filePath = path.join(/* turbopackIgnore: true */ directory, filename);
    const before = await fileSystem.lstat(/* turbopackIgnore: true */ filePath);
    if (!before.isFile() || before.isSymbolicLink()) return null;

    handle = await fileSystem.open(/* turbopackIgnore: true */ filePath, 'r');
    const opened = await handle.stat();
    if (!sameFile(before, opened)) return null;

    // Read only the PDF signature, even for large catalogue files.
    const signature = Buffer.alloc(5);
    const { bytesRead } = await handle.read(signature, 0, signature.length, 0);
    if (bytesRead !== signature.length || !signature.equals(PDF_SIGNATURE)) return null;

    const after = await fileSystem.lstat(/* turbopackIgnore: true */ filePath);
    if (!sameFile(opened, after)) return null;

    return {
      name: catalogueName(filename, collection),
      filename,
      href: `/catalogue/${collection}/${encodeURIComponent(filename)}`,
      sizeBytes: opened.size,
    };
  } catch {
    // Missing, inaccessible, or replaced files must not create broken cards.
    return null;
  } finally {
    if (handle) await handle.close().catch(() => {});
  }
}

/**
 * Discover static PDFs at build time. Use only from a Server Component.
 * Missing collections are empty; unreadable collection folders are unavailable.
 */
export async function getCatalogueCollections(
  rootDirectory = path.join(/* turbopackIgnore: true */ process.cwd(), 'public', 'catalogue'),
  { fileSystem = fs } = {},
) {
  return Promise.all(COLLECTIONS.map(async collection => {
    const directory = path.join(/* turbopackIgnore: true */ rootDirectory, collection);
    let entries;
    try {
      const folder = await fileSystem.lstat(/* turbopackIgnore: true */ directory);
      if (!folder.isDirectory() || folder.isSymbolicLink()) {
        return { collection, catalogues: [], unavailable: true };
      }
      entries = await fileSystem.readdir(/* turbopackIgnore: true */ directory, { withFileTypes: true });
    } catch (error) {
      return { collection, catalogues: [], unavailable: error.code !== 'ENOENT' };
    }

    const catalogues = (await Promise.all(entries
      .filter(entry => entry.isFile() && /\.pdf$/i.test(entry.name))
      .map(entry => readCatalogue(directory, entry.name, collection, fileSystem))))
      .filter(Boolean)
      .sort((left, right) => naturalOrder.compare(left.name, right.name)
        || naturalOrder.compare(left.filename, right.filename)
        || (left.filename < right.filename ? -1 : left.filename > right.filename ? 1 : 0));

    return { collection, catalogues, unavailable: false };
  }));
}
