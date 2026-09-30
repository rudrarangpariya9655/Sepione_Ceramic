import { supabaseClient } from './supabase/client.js';
import { escapeSearchPattern } from './tile-query.js';

const TILE_FIELDS = 'id, size, category, filename, cloudinary_secure_url, created_at';
export const CATALOG_UNAVAILABLE = 'The collection is temporarily unavailable. Please try again.';
export const CATEGORIES_UNAVAILABLE = 'Collections could not be loaded. Please try again.';

function categoryFailure(error) {
  // Only a constrained error code is logged; provider messages may contain secrets.
  const code = /^[A-Z0-9_]{1,20}$/.test(error?.code || '') ? error.code : 'UNAVAILABLE';
  console.error('Tile category lookup failed:', code);
  return new Error(CATEGORIES_UNAVAILABLE);
}

export async function getTiles({ size, category, search, page = 1, pageSize = 24, limit } = {}, client = supabaseClient) {
  if (!client) return { tiles: [], totalCount: 0, error: CATALOG_UNAVAILABLE };

  try {
    let query = client.from('tile_images')
      .select(TILE_FIELDS, { count: 'exact' })
      .eq('upload_status', 'SUCCESS')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (size) query = query.eq('size', size);
    if (category && category !== 'All') query = query.eq('category', category);
    if (search) query = query.ilike('filename', `%${escapeSearchPattern(search)}%`);
    if (limit) query = query.limit(limit);
    else query = query.range((page - 1) * pageSize, page * pageSize - 1);

    const { data, count, error } = await query.abortSignal(AbortSignal.timeout(8000));
    if (error) return { tiles: [], totalCount: 0, error: CATALOG_UNAVAILABLE };
    return { tiles: data || [], totalCount: count ?? data?.length ?? 0, error: null };
  } catch {
    return { tiles: [], totalCount: 0, error: CATALOG_UNAVAILABLE };
  }
}

export async function getTileCategories(size, client = supabaseClient) {
  if (!client) throw categoryFailure({ code: 'NOT_CONFIGURED' });
  const categories = new Set();
  const batchSize = 1000;
  const signal = AbortSignal.timeout(8000);
  try {
    // Supabase caps a response at 1,000 rows. Read every batch so older
    // categories don't disappear once the catalogue grows beyond that limit.
    for (let offset = 0; ; offset += batchSize) {
      const { data, error } = await client.from('tile_images')
        .select('category')
        .eq('size', size)
        .eq('upload_status', 'SUCCESS')
        .order('id', { ascending: true })
        .range(offset, offset + batchSize - 1)
        .abortSignal(signal);
      if (error) throw error;
      for (const tile of data || []) {
        if (typeof tile.category === 'string' && tile.category.trim()) categories.add(tile.category);
      }
      if (!data || data.length < batchSize) break;
    }
  } catch (error) {
    throw categoryFailure(error);
  }
  return [...categories].sort((a, b) => a.localeCompare(b));
}

export async function getCategoryResult(size, client = supabaseClient) {
  try {
    return { categories: await getTileCategories(size, client), error: null };
  } catch {
    return { categories: [], error: CATEGORIES_UNAVAILABLE };
  }
}
