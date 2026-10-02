import test from 'node:test';
import assert from 'node:assert/strict';
import { COLLECTION_FORMATS, getTileFormat, formatCollectionText } from '../src/lib/collection-formats.js';
import { TILE_SIZES } from '../src/lib/tile-query.js';
import nextConfig from '../next.config.mjs';

test('existing catalogue keys resolve to metric collections without changing storage identity', () => {
  assert.deepEqual(COLLECTION_FORMATS.map(format => format.storageSize), TILE_SIZES);
  for (const format of COLLECTION_FORMATS) {
    assert.equal(getTileFormat(format.storageSize), getTileFormat(format.name));
    assert.equal(format.dimensions, `${format.width} × ${format.height} mm`);
    assert.equal(format.href, `/tiles/${format.name}`);
  }
  assert.equal(getTileFormat('unsupported'), undefined);
  assert.equal(getTileFormat(undefined), undefined);
});

test('box coverage stays distinct from mathematically correct per-tile coverage', () => {
  const [small, large] = COLLECTION_FORMATS;
  assert.equal((small.width * small.height / 1e6).toFixed(2), '0.09');
  assert.equal((large.width * large.height / 1e6).toFixed(2), '0.16');
  assert.equal(small.areaPerBox.toFixed(2), '0.72');
  assert.equal(large.areaPerBox.toFixed(2), '0.80');
  for (const format of COLLECTION_FORMATS) {
    const pieces = format.areaPerBox / (format.width * format.height / 1e6);
    assert.ok(Number.isInteger(pieces) && pieces > 1);
  }
});

test('legacy collection links permanently redirect to the corresponding metric catalogue', async () => {
  const redirects = await nextConfig.redirects();
  for (const format of COLLECTION_FORMATS) {
    const redirect = redirects.find(entry => entry.source === `/tiles/${format.storageSize}`);
    assert.equal(redirect.destination, format.href);
    assert.equal(redirect.permanent, true);
    assert.ok(!redirects.some(entry => entry.source === redirect.destination));
  }
});

test('import status presents metric formats without mutating source paths', () => {
  const original = '12x12/Stone/design.jpg';
  assert.equal(formatCollectionText(original), '300x300/Stone/design.jpg');
  assert.equal(original, '12x12/Stone/design.jpg');
  assert.equal(formatCollectionText('16 X 16\\Stone\\design.jpg'), '400x400\\Stone\\design.jpg');
  assert.equal(formatCollectionText('12 × 12 and 16×16'), '300x300 and 400x400');
  assert.equal(formatCollectionText(), '');
});
