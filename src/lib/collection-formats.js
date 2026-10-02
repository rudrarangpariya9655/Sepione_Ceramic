// Keep storage keys compatible with existing Supabase records and image paths.
// Public labels and routes use metric collection names.
export const COLLECTION_FORMATS = [
  { storageSize: '12x12', name: '300x300', dimensions: '300 × 300 mm', width: 300, height: 300, areaPerBox: 0.72, weightPerBoxKg: 12.5, thicknessMm: 9, href: '/tiles/300x300' },
  { storageSize: '16x16', name: '400x400', dimensions: '400 × 400 mm', width: 400, height: 400, areaPerBox: 0.80, weightPerBoxKg: 18.5, thicknessMm: 11.5, href: '/tiles/400x400' },
];

export function getTileFormat(size) {
  return COLLECTION_FORMATS.find(format => format.storageSize === size || format.name === size);
}

// Present import progress with metric names while retaining original source paths.
export function formatCollectionText(value = '') {
  return String(value).replace(/12\s*[x×]\s*12/gi, '300x300').replace(/16\s*[x×]\s*16/gi, '400x400');
}
