import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTileQuery, escapeSearchPattern } from '../src/lib/tile-query.js';
import { getTiles, getTileCategories, CATALOG_UNAVAILABLE } from '../src/lib/tiles.js';
import { hasSupabaseConfig } from '../src/lib/supabase/config.js';
import { validateTileUpload, validateTileText, isValidTileId } from '../src/lib/tile-validation.js';

function database(responses) {
  const calls = [];
  let index = 0;
  return {
    calls,
    from(table) {
      const operations = [['from', table]];
      calls.push(operations);
      const result = responses[index++];
      const query = {};
      for (const method of ['select', 'eq', 'order', 'range', 'limit', 'ilike', 'abortSignal']) {
        query[method] = (...args) => { operations.push([method, ...args]); return query; };
      }
      query.then = (resolve, reject) => result instanceof Error
        ? Promise.reject(result).then(resolve, reject)
        : Promise.resolve(result).then(resolve, reject);
      return query;
    },
  };
}

test('public query uses safe defaults and normalizes filters', () => {
  assert.deepEqual(parseTileQuery(new URLSearchParams('size=12x12&category=All&search=%20marble%20')), {
    size: '12x12', category: undefined, search: 'marble', page: 1, pageSize: 24, limit: undefined,
  });
});

test('invalid, oversized and fractional pagination never reaches the database', () => {
  for (const query of ['page=-1', 'page=0', 'page=1.5', 'page=2abc', 'page=10001', 'pageSize=1000', 'limit=0', 'limit=NaN', 'size=other', 'page=']) {
    assert.throws(() => parseTileQuery(new URLSearchParams(query)), query);
  }
  assert.throws(() => parseTileQuery(new URLSearchParams({ search: 'x'.repeat(121) })));
});

test('search treats SQL wildcards in filenames literally', () => {
  assert.equal(escapeSearchPattern('stone_50%\\finish'), 'stone\\_50\\%\\\\finish');
});

test('missing configuration never constructs a dummy client', () => {
  assert.equal(hasSupabaseConfig(undefined, undefined), false);
  assert.equal(hasSupabaseConfig('not-a-url', 'key'), false);
  assert.equal(hasSupabaseConfig('https://example.supabase.co', 'your_anon_key'), false);
  assert.equal(hasSupabaseConfig('https://example.supabase.co', 'test-key'), true);
});

test('pagination is inclusive and stable for tiles with identical timestamps', async () => {
  const client = database([{ data: [{ id: 25 }], count: 49, error: null }]);
  const result = await getTiles({ size: '12x12', category: 'Stone', search: '50%', page: 2 }, client);
  assert.deepEqual(result, { tiles: [{ id: 25 }], totalCount: 49, error: null });
  const operations = client.calls[0];
  assert.ok(operations.some(op => op[0] === 'range' && op[1] === 24 && op[2] === 47));
  assert.deepEqual(operations.filter(op => op[0] === 'order'), [
    ['order', 'created_at', { ascending: false }], ['order', 'id', { ascending: false }],
  ]);
  assert.ok(operations.some(op => op[0] === 'ilike' && op[2] === '%50\\%%'));
});

test('outages, exceptions and unconfigured databases produce a safe recoverable error', async () => {
  const expected = { tiles: [], totalCount: 0, error: CATALOG_UNAVAILABLE };
  assert.deepEqual(await getTiles({}, null), expected);
  assert.deepEqual(await getTiles({}, database([{ error: { message: 'private database detail' } }])), expected);
  assert.deepEqual(await getTiles({}, database([new Error('network offline')])), expected);
});

test('empty collections are distinct from unavailable collections', async () => {
  assert.deepEqual(await getTiles({}, database([{ data: [], count: 0, error: null }])), {
    tiles: [], totalCount: 0, error: null,
  });
});

test('categories beyond the first database batch remain discoverable', async () => {
  const client = database([
    { data: Array.from({ length: 1000 }, () => ({ category: 'Stone' })), error: null },
    { data: [{ category: 'Wood' }, { category: '' }, { category: null }, { category: 'Stone' }], error: null },
  ]);
  assert.deepEqual(await getTileCategories('16x16', client), ['Stone', 'Wood']);
  assert.ok(client.calls[1].some(op => op[0] === 'range' && op[1] === 1000 && op[2] === 1999));
});

test('upload validation rejects traversal, unsupported files and oversized images', () => {
  const file = { type: 'image/jpeg', size: 100, arrayBuffer() {} };
  const valid = { size: '12x12', category: 'Stone', filename: 'Morning', file };
  assert.equal(validateTileUpload(valid).extension, 'jpg');
  for (const patch of [
    { category: '../Stone' }, { filename: 'folder/file' }, { filename: '   ' }, { size: '32x32' },
    { file: { ...file, type: 'text/html' } }, { file: { ...file, size: 11 * 1024 * 1024 } }, { file: 'image' },
  ]) assert.throws(() => validateTileUpload({ ...valid, ...patch }));
  assert.throws(() => validateTileText(42, 'Filename'));
});

test('tile edits accept supported database IDs and reject malformed filters', () => {
  assert.equal(isValidTileId('123'), true);
  assert.equal(isValidTileId('d80f76ef-a6ae-4cfa-ae44-f7c0a237e6ef'), true);
  assert.equal(isValidTileId('undefined'), false);
  assert.equal(isValidTileId('1,2'), false);
});
