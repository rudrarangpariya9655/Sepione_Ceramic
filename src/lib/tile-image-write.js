import { saveNewImage } from './image-write.js';

export function saveTileImage(client, storage, upload, write) {
  return saveNewImage({
    upload, write,
    destroy: id => storage.uploader.destroy(id, { invalidate: true }),
    isReferenced: async id => {
      const { data, error } = await client.from('tile_images').select('id')
        .eq('cloudinary_public_id', id).limit(1).abortSignal(AbortSignal.timeout(8000));
      if (error) throw new Error('Image references could not be checked.');
      return Boolean(data?.length);
    },
  });
}
