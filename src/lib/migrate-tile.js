import { validateTileText } from './tile-validation.js';
import { ensureIdentityAvailable, migrationImageOptions, DUPLICATE_TILE_ERROR } from './tile-identity.js';
import { saveTileImage } from './tile-image-write.js';

export async function migrateTileFile({ filePath, relativePath, existing, client, storage }) {
  if (existing?.upload_status === 'SUCCESS') return 'skipped';
  const source = relativePath.replaceAll('\\', '/');
  const parts = source.split('/');
  const filename = validateTileText(parts.at(-1).replace(/\.[^.]+$/, ''), 'Filename');
  const category = validateTileText(parts[1], 'Category');
  const tile = { size: parts[0], category, filename,
    folder_path: parts.slice(0, -1).join('/'), local_path: existing?.local_path || source };
  await ensureIdentityAvailable(client, tile, existing?.id);
  try {
    await saveTileImage(client, storage,
      () => storage.uploader.upload(filePath, migrationImageOptions(relativePath)),
      async image => {
        const record = { ...tile, cloudinary_public_id: image.public_id, cloudinary_secure_url: image.secure_url,
          image_width: image.width, image_height: image.height, upload_status: 'SUCCESS', error_message: null,
          updated_at: new Date().toISOString() };
        const query = existing
          ? client.from('tile_images').update(record).eq('id', existing.id).neq('upload_status', 'SUCCESS')
          : client.from('tile_images').insert(record);
        const { data, error } = await query.select('id').maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Tile changed while the migration was running.');
      });
  } catch (error) {
    if (error.code === '23505') error.message = DUPLICATE_TILE_ERROR;
    throw error;
  }
  return 'uploaded';
}
