// Upload callbacks MUST disable overwrite. Never adopt or delete an asset
// returned as already existing: another operation owns it.
export async function saveNewImage({ upload, write, destroy, isReferenced }) {
  let image;
  try {
    image = await upload();
  } catch (cause) {
    throw new Error('Image upload failed. Please retry.', { cause });
  }
  if (image.existing) {
    throw Object.assign(new Error('An image already exists at this storage ID. No image was overwritten. Review the asset before retrying.'), {
      assetId: image.public_id,
    });
  }
  try {
    await write(image);
  } catch (cause) {
    const failure = Object.assign(new Error('The database could not save the image.', { cause }), { code: cause.code });
    try {
      // A timeout can hide a committed write. Check before destroying its image.
      if (await isReferenced(image.public_id)) throw new Error('The image is referenced by a tile.');
      const result = await destroy(image.public_id);
      if (!['ok', 'not found'].includes(result?.result)) throw new Error('Cleanup was not confirmed.');
    } catch {
      failure.cleanup = { assetId: image.public_id, error: 'Automatic image cleanup could not be confirmed. Review this asset in Cloudinary; remove it only after verifying no tile references it.' };
    }
    throw failure;
  }
  return image;
}
