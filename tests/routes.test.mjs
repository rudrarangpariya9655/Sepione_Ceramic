import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { getCategoryResult } from '../src/lib/tiles.js';
import { TILE_SIZES } from '../src/lib/tile-query.js';
import { checkAdminCredential } from '../src/lib/admin-credentials.js';

// Execute the real route bodies with framework/service dependencies substituted.
// No network, production keys or live writes are available in this context.
async function route(file, dependencies = {}) {
  const source = (await readFile(new URL('../src/' + file, import.meta.url), 'utf8'))
    .replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '');
  const names = [...source.matchAll(/async function (GET|POST|PATCH|DELETE)\(/g)].map(x => x[1]);
  return vm.runInNewContext(source + '\n({' + names.join(',') + '})', {
    NextResponse: { json: (body, options) => Response.json(body, options) },
    URL, AbortSignal, process: { env: {} }, ...dependencies,
  });
}

test('every admin API rejects unauthenticated reads and mutations before accessing services', async () => {
  const deny = () => Response.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  for (const file of ['verify-secret', 'tiles', 'tiles/[id]', 'add-tiles', 'bulk-migrate']) {
    const handlers = await route(`app/admin/api/${file}/route.js`, { authorizeAdmin: deny });
    for (const [method, handler] of Object.entries(handlers)) {
      const options = { method };
      if (method === 'POST') {
        if (file === 'add-tiles') options.body = new FormData();
        else { options.body = JSON.stringify({ secret: 'incorrect' }); options.headers = { 'Content-Type': 'application/json' }; }
      }
      const response = await handler(new Request('http://localhost/admin/api/' + file, options), { params: Promise.resolve({ id: '1' }) });
      assert.equal(response.status, 401, `${file} ${method}`);
    }
  }
});

test('auth wrapper fails closed for missing configuration and accepts configured credentials', async () => {
  const source = (await readFile(new URL('../src/lib/admin-auth.js', import.meta.url), 'utf8'))
    .replace(/^import .*;\r?$/gm, '').replace('export function', 'function');
  const environment = { env: {} };
  const authorize = vm.runInNewContext(source + '\nauthorizeAdmin', {
    process: environment, checkAdminCredential, isSupabaseAdminConfigured: true, isCloudinaryConfigured: true,
    NextResponse: { json: (body, options) => Response.json(body, options) },
  });
  assert.equal(authorize('anything').status, 503);
  const { randomBytes } = await import('node:crypto');
  environment.env.ADMIN_SECRET = randomBytes(32).toString('hex');
  assert.equal(authorize('incorrect').status, 401);
  assert.equal(authorize(environment.env.ADMIN_SECRET), null);
});

test('public and admin category APIs return 503 for failed queries and 200 for valid empty collections', async () => {
  for (const failing of [true, false]) {
    const client = { from() {
      const query = {};
      for (const method of ['select', 'eq', 'order', 'range']) query[method] = () => query;
      query.abortSignal = async () => failing ? { error: { code: '08006', message: 'secret connection detail' } } : { data: [] };
      return query;
    } };
    for (const file of ['app/api/categories/route.js', 'app/admin/api/add-tiles/route.js']) {
      const handlers = await route(file, { TILE_SIZES, authorizeAdmin: () => null, supabaseServer: client,
        getCategoryResult: size => getCategoryResult(size, client) });
      const response = await handlers.GET(new Request('http://localhost/api/categories?size=12x12'));
      assert.equal(response.status, failing ? 503 : 200);
      const body = await response.json();
      assert.deepEqual(body.categories, []);
      assert.equal(Boolean(body.error), failing);
      assert.ok(!JSON.stringify(body).includes('secret connection detail'));
    }
  }
});
