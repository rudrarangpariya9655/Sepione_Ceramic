import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { tileIdentity } from '../src/lib/tile-identity.js';

const migration = await readFile(new URL('../database/001-tile-identity.sql', import.meta.url), 'utf8');
const rollback = await readFile(new URL('../database/001-tile-identity-rollback.sql', import.meta.url), 'utf8');
const schema = `CREATE TABLE tile_images (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), size varchar(50) NOT NULL,
  category varchar(100) NOT NULL, filename varchar(255) NOT NULL, local_path varchar(1000) NOT NULL UNIQUE);`;
async function insert(db, filename, source, category = 'Stone') {
  return db.query('INSERT INTO tile_images(size, category, filename, local_path) VALUES ($1,$2,$3,$4) RETURNING *', ['12x12', category, filename, source]);
}

test('SQL migration preserves rows, supports rename/name reuse and enforces shared duplicate rules', async () => {
  const db = new PGlite();
  try {
    await db.exec(schema);
    const { rows: [original] } = await insert(db, 'Before', '12x12\\Stone\\Before.jpg');
    await db.exec(migration);
    await db.query('UPDATE tile_images SET filename=$1, category=$2 WHERE id=$3', ['After', 'Wood', original.id]);
    const { rows: [renamed] } = await db.query('SELECT * FROM tile_images WHERE id=$1', [original.id]);
    assert.equal(renamed.local_path, original.local_path);
    assert.deepEqual(renamed.logical_identity, tileIdentity(renamed));
    await insert(db, 'Before', 'upload:second.jpg');
    await assert.rejects(insert(db, ' after ', 'upload:third.JPG', ' WOOD '), { code: '23505' });
    await assert.rejects(db.query('UPDATE tile_images SET filename=$1, category=$2 WHERE id=$3', ['Before', 'Stone', original.id]), { code: '23505' });
    await insert(db, 'After', 'upload:fourth.png', 'Wood');
    await insert(db, 'After', '12x12/Wood/series/After.jpg', 'Wood');
    await assert.rejects(insert(db, 'Different', '12x12/stone/before.JPG'), { code: '23505' });
    await db.exec(rollback);
    assert.equal((await db.query('SELECT count(*)::integer AS n FROM tile_images')).rows[0].n, 4);
    assert.ok(!(await db.query("SELECT column_name FROM information_schema.columns WHERE table_name='tile_images'")).rows.some(x => x.column_name === 'logical_identity'));
  } finally { await db.close(); }
});

test('migration fails atomically on legacy duplicate identities without deleting rows', async () => {
  const db = new PGlite();
  try {
    await db.exec(schema);
    await insert(db, 'Design', '12x12/Stone/Design.jpg');
    await insert(db, 'design', '12x12/stone/design.JPG');
    await assert.rejects(db.exec(migration), { code: '23505' });
    await db.exec('ROLLBACK');
    assert.equal((await db.query('SELECT count(*)::integer AS n FROM tile_images')).rows[0].n, 2);
    assert.ok(!(await db.query("SELECT column_name FROM information_schema.columns WHERE table_name='tile_images'")).rows.some(x => x.column_name === 'logical_identity'));
  } finally { await db.close(); }
});
