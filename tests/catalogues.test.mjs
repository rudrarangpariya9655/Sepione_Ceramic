import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { getCatalogueCollections } from '../src/lib/catalogues.js';

const PDF = '%PDF-1.7\nfixture catalogue\n%%EOF\n';

async function fixture(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sepione-catalogues-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}

async function writePdf(root, collection, filename, content = PDF) {
  const directory = path.join(root, collection);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), content);
}

test('missing catalogue directories produce two empty collections', async t => {
  const root = await fixture(t);
  const expected = [
    { collection: '300x300', catalogues: [], unavailable: false },
    { collection: '400x400', catalogues: [], unavailable: false },
  ];
  assert.deepEqual(await getCatalogueCollections(path.join(root, 'missing')), expected);
  await fs.mkdir(path.join(root, '300x300'));
  assert.deepEqual(await getCatalogueCollections(root), expected);
});

test('existing valid PDFs stay under their metric collection with readable names', async t => {
  const root = await fixture(t);
  await writePdf(root, '300x300', '300x300MM PLAIN SERIES VOL-1.pdf');
  await writePdf(root, '400x400', '400X400MM NEW COLLECTION-2026.PDF');
  await writePdf(root, '500x500', 'unsupported.pdf');
  const results = await getCatalogueCollections(root);
  assert.deepEqual(results.map(group => group.collection), ['300x300', '400x400']);
  assert.deepEqual(results[0], {
    collection: '300x300',
    catalogues: [{
      name: 'Plain Series Vol. 1',
      filename: '300x300MM PLAIN SERIES VOL-1.pdf',
      href: '/catalogue/300x300/300x300MM%20PLAIN%20SERIES%20VOL-1.pdf',
      sizeBytes: Buffer.byteLength(PDF),
    }],
    unavailable: false,
  });
  assert.equal(results[1].catalogues[0].name, 'New Collection 2026');
  assert.equal(results[1].catalogues[0].href, '/catalogue/400x400/400X400MM%20NEW%20COLLECTION-2026.PDF');
  assert.ok(!JSON.stringify(results).includes(root));
});

test('URL encoding preserves filenames with spaces, percent signs and fragments', async t => {
  const root = await fixture(t);
  const filename = '300x300MM_Green & Cool 100% #1.pdf';
  await writePdf(root, '300x300', filename);
  const [{ catalogues }] = await getCatalogueCollections(root);
  assert.equal(catalogues[0].filename, filename);
  assert.equal(catalogues[0].href, '/catalogue/300x300/300x300MM_Green%20%26%20Cool%20100%25%20%231.pdf');
  assert.equal(decodeURIComponent(catalogues[0].href.split('/').at(-1)), filename);
  assert.equal(catalogues[0].name, 'Green & Cool 100% #1');
});

test('volumes use stable natural order instead of filesystem or lexical order', async t => {
  const root = await fixture(t);
  for (const volume of ['10', '2', '01', '1']) {
    await writePdf(root, '300x300', `300x300MM PUNCH_SERIES-VOL-${volume}.pdf`);
  }
  const [{ catalogues }] = await getCatalogueCollections(root);
  assert.deepEqual(catalogues.map(file => file.name), [
    'Punch Series Vol. 01', 'Punch Series Vol. 1', 'Punch Series Vol. 2', 'Punch Series Vol. 10',
  ]);
  assert.deepEqual(await getCatalogueCollections(root), await getCatalogueCollections(root));
});

test('non-PDFs, empty files, invalid signatures and directories do not create cards', async t => {
  const root = await fixture(t);
  await writePdf(root, '300x300', 'valid.pdf');
  await writePdf(root, '300x300', 'fake.pdf', 'This is not a PDF');
  await writePdf(root, '300x300', 'empty.PDF', '');
  await writePdf(root, '300x300', 'invalid-bytes.pdf', Buffer.from([0x25, 0x50, 0x44, 0x46, 0xad]));
  await writePdf(root, '300x300', 'wrong-extension.txt');
  await fs.mkdir(path.join(root, '300x300', 'directory.pdf'));
  const [{ catalogues, unavailable }] = await getCatalogueCollections(root);
  assert.deepEqual(catalogues.map(file => file.filename), ['valid.pdf']);
  assert.equal(unavailable, false);
});

test('symlink PDFs and symlink category folders are excluded', async t => {
  const root = await fixture(t);
  await writePdf(root, '300x300', 'valid.pdf');
  const fileSystem = {
    ...fs,
    async readdir(...args) {
      const entries = await fs.readdir(...args);
      return [...entries, { name: 'link.pdf', isFile: () => false, isSymbolicLink: () => true }];
    },
    async lstat(location) {
      const stats = await fs.lstat(location.endsWith('400x400') ? path.join(root, '300x300') : location);
      if (location.endsWith('400x400')) stats.isSymbolicLink = () => true;
      return stats;
    },
  };
  const [small, large] = await getCatalogueCollections(root, { fileSystem });
  assert.deepEqual(small.catalogues.map(file => file.filename), ['valid.pdf']);
  assert.deepEqual(large, { collection: '400x400', catalogues: [], unavailable: true });
});

test('an inaccessible collection is unavailable without breaking the other collection', async t => {
  const root = await fixture(t);
  await writePdf(root, '300x300', 'small.pdf');
  await writePdf(root, '400x400', 'large.pdf');
  const fileSystem = {
    ...fs,
    async readdir(location, options) {
      if (location.endsWith('300x300')) throw Object.assign(new Error('private path detail'), { code: 'EACCES' });
      return fs.readdir(location, options);
    },
  };
  const [small, large] = await getCatalogueCollections(root, { fileSystem });
  assert.deepEqual(small, { collection: '300x300', catalogues: [], unavailable: true });
  assert.equal(large.catalogues.length, 1);
  assert.equal(large.unavailable, false);
});

test('PDFs removed or replaced during discovery are excluded and open handles close', async t => {
  const root = await fixture(t);
  await writePdf(root, '300x300', 'removed.pdf');
  await writePdf(root, '300x300', 'replaced.pdf');
  await writePdf(root, '300x300', 'valid.pdf');
  const closed = [];
  const fileSystem = {
    ...fs,
    async open(location, flags) {
      if (location.endsWith('removed.pdf')) throw Object.assign(new Error('file disappeared'), { code: 'ENOENT' });
      const handle = await fs.open(location, flags);
      return {
        async stat() {
          const stats = await handle.stat();
          if (location.endsWith('replaced.pdf')) stats.ino = stats.ino ? 0 : 1;
          return stats;
        },
        read: (...args) => handle.read(...args),
        async close() {
          closed.push(path.basename(location));
          await handle.close();
        },
      };
    },
  };
  const [{ catalogues }] = await getCatalogueCollections(root, { fileSystem });
  assert.deepEqual(catalogues.map(file => file.filename), ['valid.pdf']);
  assert.deepEqual(closed.sort(), ['replaced.pdf', 'valid.pdf']);
});
