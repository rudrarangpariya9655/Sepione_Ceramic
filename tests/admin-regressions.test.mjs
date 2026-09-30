import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { checkAdminCredential } from '../src/lib/admin-credentials.js';
import { migrationImageOptions, tileIdentity, ensureIdentityAvailable, identityLookupError } from '../src/lib/tile-identity.js';
import { saveNewImage } from '../src/lib/image-write.js';
import { getTileCategories, getCategoryResult, CATEGORIES_UNAVAILABLE } from '../src/lib/tiles.js';
import { getAdminTiles } from '../src/lib/admin-tiles.js';
import { migrationConfiguration } from '../src/lib/migration-config.js';

function database(responses) {
  const calls = [];
  return { calls, from(table) {
    const operations = [['from', table]]; calls.push(operations);
    const result = responses.shift(); const query = {};
    for (const method of ['select', 'eq', 'neq', 'order', 'range', 'limit', 'ilike', 'abortSignal']) {
      query[method] = (...args) => { operations.push([method, ...args]); return query; };
    }
    query.then = (resolve, reject) => result instanceof Error ? Promise.reject(result).then(resolve, reject) : Promise.resolve(result).then(resolve, reject);
    return query;
  } };
}

test('missing, short and placeholder admin configuration fail closed', () => {
  for (const secret of [undefined, '', 'short-example', 'replace_with_a_secure_random_secret', 'your_' + 'x'.repeat(40)]) {
    assert.equal(checkAdminCredential(secret, secret), 'unconfigured');
  }
});
test('only the correct configured admin credential authenticates', () => {
  const expected = randomBytes(32).toString('hex');
  assert.equal(checkAdminCredential(expected, expected), 'authorized');
  assert.equal(checkAdminCredential('x'.repeat(expected.length), expected), 'unauthorized');
  assert.equal(checkAdminCredential(undefined, expected), 'unauthorized');
});
test('migration IDs distinguish extensions and directories and never overwrite', () => {
  const files = ['12x12/Stone/design.jpg', '12x12/Stone/design.png', '12x12/Stone/series/design.jpg', '12x12/Wood/design.jpg'];
  const options = files.map(migrationImageOptions);
  assert.equal(new Set(options.map(x => x.folder + '/' + x.public_id)).size, 4);
  assert.ok(options.every(x => x.overwrite === false));
  assert.deepEqual(migrationImageOptions('12x12\\STONE\\DESIGN.JPG'), options[0]);
  assert.deepEqual(migrationImageOptions(files[0]), options[0]);
});
test('logical identity follows metadata and preserves subfolders and image format', () => {
  const before = { size: '12x12', category: 'Stone', filename: 'Before', local_path: '12x12\\Stone\\series\\Before.jpg' };
  const renamed = { ...before, category: 'Wood', filename: 'After' };
  assert.deepEqual(tileIdentity(renamed), ['12x12', 'wood', 'series', 'after', 'jpg']);
  assert.notDeepEqual(tileIdentity(before), tileIdentity(renamed));
  assert.deepEqual(tileIdentity(renamed), tileIdentity({ ...renamed, category: ' WOOD ', filename: ' after ', local_path: '12x12/stone/series/before.JPG' }));
  assert.notDeepEqual(tileIdentity(renamed), tileIdentity({ ...renamed, local_path: '12x12/Stone/other/Before.jpg' }));
});
test('upload and edit checks share identity and exclude only the edited record', async () => {
  assert.equal(identityLookupError({ code: '08006' }).code, 'IDENTITY_LOOKUP_FAILED');
  assert.ok(!identityLookupError({ code: '08006' }).message.includes('not configured'));
  const tile = { size: '12x12', category: 'Stone', filename: 'New', local_path: 'upload:unique.jpg' };
  const client = database([{ data: [] }, { data: [{ id: 'other' }] }, { error: { code: '42703' } }]);
  await ensureIdentityAvailable(client, tile, 'current');
  assert.ok(client.calls[0].some(x => x[0] === 'neq' && x[2] === 'current'));
  await assert.rejects(ensureIdentityAvailable(client, tile), { code: '23505' });
  await assert.rejects(ensureIdentityAvailable(client, tile), { code: 'IDENTITY_UNAVAILABLE' });
});

function imageOperation(overrides = {}) {
  const calls = [];
  const args = {
    upload: async () => { calls.push('upload'); return { public_id: 'owned-image' }; },
    write: async () => { calls.push('write'); },
    isReferenced: async () => { calls.push('references'); return false; },
    destroy: async id => { calls.push(['destroy', id]); return { result: 'ok' }; }, ...overrides,
  };
  return { calls, run: () => saveNewImage(args) };
}
test('upload and DB success retain the newly created asset', async () => {
  const op = imageOperation(); assert.equal((await op.run()).public_id, 'owned-image');
  assert.deepEqual(op.calls, ['upload', 'write']);
});
test('upload failure performs no DB write or cleanup', async () => {
  const op = imageOperation({ upload: async () => { throw new Error('private provider message'); } });
  await assert.rejects(op.run(), { message: 'Image upload failed. Please retry.' });
  assert.deepEqual(op.calls, []);
});
test('DB failure cleans up only the new unreferenced asset', async () => {
  const original = Object.assign(new Error('database failed'), { code: '23505' });
  const op = imageOperation({ write: async () => { throw original; } });
  await assert.rejects(op.run(), error => error.cause === original && error.code === '23505' && !error.cleanup);
  assert.deepEqual(op.calls, ['upload', 'references', ['destroy', 'owned-image']]);
});
test('cleanup failure preserves original error and reports the asset separately', async () => {
  const original = new Error('database failed');
  const op = imageOperation({ write: async () => { throw original; }, destroy: async () => { throw new Error('private token'); } });
  await assert.rejects(op.run(), error => error.cause === original && error.cleanup.assetId === 'owned-image' && !JSON.stringify(error.cleanup).includes('private token'));
});
test('unconfirmed cleanup results are failures', async () => {
  const op = imageOperation({ write: async () => { throw new Error('database failed'); }, destroy: async () => ({ result: 'error' }) });
  await assert.rejects(op.run(), error => Boolean(error.cleanup));
});
test('pre-existing assets are never adopted, written or cleaned up', async () => {
  const op = imageOperation({ upload: async () => ({ existing: true, public_id: 'existing-image' }) });
  await assert.rejects(op.run(), error => error.assetId === 'existing-image');
  assert.deepEqual(op.calls, []);
});
test('ambiguous writes preserve assets when references exist or cannot be checked', async () => {
  for (const isReferenced of [async () => true, async () => { throw new Error('offline'); }]) {
    const op = imageOperation({ write: async () => { throw new Error('timeout'); }, isReferenced });
    await assert.rejects(op.run(), error => Boolean(error.cleanup)); assert.deepEqual(op.calls, ['upload']);
  }
});
test('category errors and partial batches do not become successful empty results', async () => {
  const failure = { error: { code: 'PGRST000', message: 'private details' } };
  await assert.rejects(getTileCategories('12x12', database([failure])), { message: CATEGORIES_UNAVAILABLE });
  const client = database([{ data: Array.from({ length: 1000 }, () => ({ category: 'Stone' })) }, failure]);
  assert.deepEqual(await getCategoryResult('12x12', client), { categories: [], error: CATEGORIES_UNAVAILABLE });
  assert.deepEqual(await getCategoryResult('12x12', null), { categories: [], error: CATEGORIES_UNAVAILABLE });
});
test('valid empty category result is successful', async () => {
  assert.deepEqual(await getCategoryResult('12x12', database([{ data: [] }])), { categories: [], error: null });
});
test('dashboard totals are global and unchanged by search', async () => {
  const responses = filtered => [{ data: [], count: filtered }, { count: 1933 }, { count: 1926 }, { count: 7 }];
  const unfiltered = database(responses(1933)); const searched = database(responses(1));
  const all = await getAdminTiles(unfiltered, { page: 1, pageSize: 20 });
  const one = await getAdminTiles(searched, { page: 1, pageSize: 20, search: 'design' });
  assert.deepEqual(all.stats, { total: 1933, successful: 1926, failed: 7 });
  assert.deepEqual(one.stats, all.stats); assert.equal(one.totalCount, 1);
  assert.ok(searched.calls[0].some(x => x[0] === 'ilike'));
  assert.ok(searched.calls.slice(1).every(call => !call.some(x => x[0] === 'ilike')));
  assert.ok(searched.calls[2].some(x => x[0] === 'eq' && x[2] === 'SUCCESS'));
  assert.ok(searched.calls[3].some(x => x[0] === 'eq' && x[2] === 'FAILED'));
});
test('statistics query errors do not become zero totals', async () => {
  await assert.rejects(getAdminTiles(database([{ data: [], count: 0 }, { error: {} }, { count: 0 }, { count: 0 }]), { page: 1, pageSize: 20 }));
});
test('migration configuration reports sanitized missing, invalid and unreadable folder errors', () => {
  const absolute = path.resolve('private-source');
  assert.equal(migrationConfiguration(undefined).ready, false);
  assert.equal(migrationConfiguration('relative/folder').ready, false);
  for (const code of ['ENOENT', 'EACCES']) {
    const result = migrationConfiguration(absolute, { statSync() { throw Object.assign(new Error(absolute), { code }); } });
    assert.equal(result.ready, false); assert.ok(!result.error.includes(absolute));
  }
  assert.equal(migrationConfiguration(absolute, { statSync: () => ({ isDirectory: () => false }) }).ready, false);
  assert.deepEqual(migrationConfiguration(absolute, { statSync: () => ({ isDirectory: () => true }), accessSync() {} }), { ready: true, error: null });
});
