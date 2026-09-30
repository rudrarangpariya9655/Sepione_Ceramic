import { escapeSearchPattern } from './tile-query.js';

export async function getAdminTiles(client, { page, pageSize, search }) {
  let query = client.from('tile_images')
    .select('id, size, category, filename, cloudinary_secure_url, upload_status, created_at', { count: 'exact' })
    .order('created_at', { ascending: false }).order('id', { ascending: false });
  if (search) query = query.ilike('filename', `%${escapeSearchPattern(search)}%`);
  const count = status => {
    let request = client.from('tile_images').select('id', { count: 'exact', head: true });
    if (status) request = request.eq('upload_status', status);
    return request.abortSignal(AbortSignal.timeout(8000));
  };
  const results = await Promise.all([
    query.range((page - 1) * pageSize, page * pageSize - 1).abortSignal(AbortSignal.timeout(8000)),
    count(), count('SUCCESS'), count('FAILED'),
  ]);
  if (results.some(result => result.error)) throw new Error('Failed to load catalogue statistics or tiles.');
  const [filtered, total, successful, failed] = results;
  return { tiles: filtered.data || [], totalCount: filtered.count ?? 0,
    stats: { total: total.count ?? 0, successful: successful.count ?? 0, failed: failed.count ?? 0 } };
}
