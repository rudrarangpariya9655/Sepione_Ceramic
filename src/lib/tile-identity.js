import { createHash } from 'node:crypto';

export const IDENTITY_SETUP_ERROR = 'Tile identity protection is not configured. Apply the documented tile identity database migration before uploading or editing.';
export const DUPLICATE_TILE_ERROR = 'A tile with this name and image format already exists in this collection folder. Choose another name.';

export function identityLookupError(error) {
  return ['42703', 'PGRST204'].includes(error?.code)
    ? Object.assign(new Error(IDENTITY_SETUP_ERROR), { code: 'IDENTITY_UNAVAILABLE' })
    : Object.assign(new Error('Tile identities could not be checked. Please try again.'), { code: 'IDENTITY_LOOKUP_FAILED' });
}

export function normalizeSourcePath(value) {
  return String(value).replaceAll('\\', '/').replace(/^ +| +$/g, '').toLowerCase();
}

// local_path is immutable import provenance. The current name/category come
// from metadata; source subfolders and image format still distinguish designs.
export function tileIdentity({ size, category, filename, local_path }) {
  const source = normalizeSourcePath(local_path);
  const parts = source.split('/');
  const extension = source.match(/\.([^./]+)$/)?.[1] || '';
  const normalize = value => String(value).replace(/^ +| +$/g, '').toLowerCase();
  return [normalize(size), normalize(category), parts.slice(2, -1).join('/'), normalize(filename), extension];
}

export function migrationImageOptions(relativePath) {
  const source = normalizeSourcePath(relativePath);
  const parts = source.split('/');
  if (parts.length < 3 || parts.some(p => !p || p === '.' || p === '..')) throw new Error('Invalid source folder structure.');
  const slug = parts.at(-1).replace(/[^a-z0-9_-]+/g, '-').slice(0, 60);
  const hash = createHash('sha256').update(source).digest('hex');
  return {
    folder: `sepione-ceramic/${parts.slice(0, -1).join('/')}`,
    public_id: `${slug}-${hash}`,
    resource_type: 'image', overwrite: false, unique_filename: false,
  };
}

export async function ensureIdentityAvailable(client, tile, excludeId) {
  let query = client.from('tile_images').select('id').eq('logical_identity', JSON.stringify(tileIdentity(tile)));
  if (excludeId) query = query.neq('id', excludeId);
  const { data, error } = await query.limit(1).abortSignal(AbortSignal.timeout(8000));
  if (error) throw identityLookupError(error);
  if (data?.length) throw Object.assign(new Error(DUPLICATE_TILE_ERROR), { code: '23505' });
}
