/**
 * Injects Cloudinary transformation parameters into a secure URL.
 * Designed specifically for the tile thumbnails.
 * 
 * Example:
 * Input:  https://res.cloudinary.com/zvunaque/image/upload/v1725087515/sepione-ceramic/12x12/category/image.jpg
 * Output: https://res.cloudinary.com/zvunaque/image/upload/c_fill,w_400,q_auto,f_auto/v1725087515/sepione-ceramic/12x12/category/image.jpg
 */
export function getThumbnailUrl(originalUrl) {
  if (typeof originalUrl !== 'string') return '';
  if (!originalUrl.startsWith('https://res.cloudinary.com/') || !originalUrl.includes('/image/upload/')) {
    return originalUrl;
  }
  
  // Transform string for webp auto-format, auto-quality, max-width 400, crop fill
  const transform = '/upload/c_limit,w_600,q_auto,f_auto/';
  return originalUrl.replace('/upload/', transform);
}
