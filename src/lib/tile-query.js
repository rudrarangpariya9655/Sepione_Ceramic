export const TILE_SIZES = ['12x12', '16x16'];

function positiveInteger(value, fallback, maximum, name) {
  if (value === null || value === undefined) return fallback;
  if (!/^\d+$/.test(String(value))) throw new Error(`${name} must be a positive integer.`);
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > maximum) {
    throw new Error(`${name} must be between 1 and ${maximum}.`);
  }
  return number;
}

export function parseTileQuery(searchParams) {
  const size = searchParams.get('size')?.trim() || undefined;
  const category = searchParams.get('category')?.trim() || undefined;
  const search = searchParams.get('search')?.trim() || undefined;
  if (size && !TILE_SIZES.includes(size)) throw new Error('Choose a supported tile size.');
  if (category && category.length > 120) throw new Error('Category is too long.');
  if (search && search.length > 120) throw new Error('Search must contain 120 characters or fewer.');

  return {
    size,
    category: category === 'All' ? undefined : category,
    search,
    page: positiveInteger(searchParams.get('page'), 1, 10000, 'Page'),
    pageSize: positiveInteger(searchParams.get('pageSize'), 24, 100, 'Page size'),
    limit: positiveInteger(searchParams.get('limit'), undefined, 100, 'Limit'),
  };
}

export function escapeSearchPattern(value) {
  return value.replace(/[\\%_*]/g, '\\$&');
}
