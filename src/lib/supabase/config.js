export function hasSupabaseConfig(url, key) {
  if (typeof url !== 'string' || typeof key !== 'string' || !key.trim()) return false;
  if (/^(your_|<)/i.test(key.trim())) return false;
  try {
    return ['https:', 'http:'].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}
