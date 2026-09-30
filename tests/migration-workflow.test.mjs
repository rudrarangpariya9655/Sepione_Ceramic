import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateTileFile } from '../src/lib/migrate-tile.js';

function fixture({ writeError, cleanupError, existingImage } = {}) {
  const uploads = [], writes = [], cleanup = [];
  const storage = { uploader: {
    upload: async (file, options) => {
      uploads.push({ file, options });
      return { public_id: options.folder + '/' + options.public_id, secure_url: 'https://example.invalid/tile.jpg', existing: existingImage, width: 100, height: 100 };
    },
    destroy: async id => { cleanup.push(id); if (cleanupError) throw cleanupError; return { result: 'ok' }; },
  } };
  const client = { from() {
    const query = { record: null };
    for (const method of ['select', 'eq', 'neq', 'limit', 'abortSignal']) query[method] = () => query;
    for (const method of ['insert', 'update']) query[method] = record => { query.record = record; return query; };
    query.then = resolve => resolve({ data: [], error: null });
    query.maybeSingle = async () => {
      if (writeError) return { error: writeError };
      writes.push(query.record); return { data: { id: 'new-id' }, error: null };
    };
    return query;
  } };
  return { uploads, writes, cleanup, run: (relativePath, existing) => migrateTileFile({ filePath: relativePath, relativePath, existing, client, storage }) };
}

test('migration writes different image references for same-stem files and separate folders', async () => {
  const f = fixture();
  for (const file of ['12x12/Stone/design.jpg', '12x12/Stone/design.png', '12x12/Stone/series/design.jpg']) assert.equal(await f.run(file), 'uploaded');
  assert.equal(new Set(f.writes.map(x => x.cloudinary_public_id)).size, 3);
  assert.ok(f.uploads.every(x => x.options.overwrite === false));
  assert.equal(f.cleanup.length, 0);
});
test('successful legacy imports are skipped without altering their image IDs or metadata', async () => {
  const f = fixture();
  assert.equal(await f.run('12x12/Stone/design.jpg', { upload_status: 'SUCCESS', local_path: '12x12\\Stone\\design.jpg' }), 'skipped');
  assert.equal(f.uploads.length, 0); assert.equal(f.writes.length, 0);
});
test('migration DB rejection compensates for the newly created asset', async () => {
  const f = fixture({ writeError: { code: '23505', message: 'private details' } });
  await assert.rejects(f.run('12x12/Stone/design.jpg'), error => error.code === '23505' && !error.message.includes('private details'));
  assert.equal(f.cleanup.length, 1); assert.equal(f.writes.length, 0);
});
test('migration cleanup failure exposes only a safe message and asset reference', async () => {
  const f = fixture({ writeError: { code: 'XX000', message: 'private database detail' }, cleanupError: new Error('private cloud detail') });
  await assert.rejects(f.run('12x12/Stone/design.jpg'), error => Boolean(error.cleanup?.assetId) && !error.cleanup.error.includes('private'));
});
test('a pre-existing migration asset is neither overwritten nor deleted', async () => {
  const f = fixture({ existingImage: true });
  await assert.rejects(f.run('12x12/Stone/design.jpg'));
  assert.equal(f.writes.length, 0); assert.equal(f.cleanup.length, 0);
});
