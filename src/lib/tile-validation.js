import { TILE_SIZES } from './tile-query.js';

export function validateTileText(value, label) {
  const maxLength = label === 'Category' ? 100 : 120;
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`${label} must contain 1 to ${maxLength} characters.`);
  }
  const text = value.trim();
  if (/[\\/\u0000-\u001f:#?<>|&%]/.test(text) || text === '.' || text === '..') {
    throw new Error(`${label} contains unsupported characters.`);
  }
  return text;
}

export function validateTileUpload({ size, category, filename, file }) {
  if (!TILE_SIZES.includes(size)) throw new Error('Choose a supported tile size.');
  const cleanCategory = validateTileText(category, 'Category');
  const cleanFilename = validateTileText(filename, 'Filename');
  if (!file || typeof file.arrayBuffer !== 'function' || file.size <= 0) throw new Error('Choose an image file.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Images must be 10 MB or smaller.');
  const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
  const extension = extensions[file.type];
  if (!extension) throw new Error('Choose a JPG, PNG, WebP or AVIF image.');
  return { size, category: cleanCategory, filename: cleanFilename, extension };
}

export function isValidTileId(value) {
  return typeof value === 'string' && (/^[1-9]\d*$/.test(value) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value));
}
