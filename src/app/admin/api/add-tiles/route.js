import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import cloudinary from '@/lib/cloudinary';
import { authorizeAdmin } from '@/lib/admin-auth';
import { TILE_SIZES } from '@/lib/tile-query';
import { validateTileUpload } from '@/lib/tile-validation';
import { getCategoryResult } from '@/lib/tiles';
import { ensureIdentityAvailable, DUPLICATE_TILE_ERROR } from '@/lib/tile-identity';
import { saveTileImage } from '@/lib/tile-image-write';
import { revalidateCatalog } from '@/lib/revalidate-catalog';

export async function GET(request) {
  const denied = authorizeAdmin(request.headers.get('Authorization'));
  if (denied) return denied;
  const size = new URL(request.url).searchParams.get('size');
  if (!TILE_SIZES.includes(size)) return NextResponse.json({ success: false, error: 'Choose a supported tile size.' }, { status: 400 });
  const result = await getCategoryResult(size, supabaseServer);
  return NextResponse.json({ success: !result.error, ...result }, { status: result.error ? 503 : 200 });
}

export async function POST(request) {
  if (Number(request.headers.get('content-length')) > 11 * 1024 * 1024) {
    return NextResponse.json({ success: false, error: 'Images must be 10 MB or smaller.' }, { status: 413 });
  }
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid upload form.' }, { status: 400 });
  }
  const denied = authorizeAdmin(formData.get('secret'), { uploads: true });
  if (denied) return denied;

  const file = formData.get('file');
  let details;
  try {
    details = validateTileUpload({
      size: formData.get('size'), category: formData.get('category'), filename: formData.get('filename'), file,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  let uploadedImage;
  try {
    const { size, category, filename, extension } = details;
    // Manual uploads have unique immutable provenance, independent of display names.
    const localPath = `upload:${randomUUID()}.${extension}`;
    const tile = { size, category, filename, local_path: localPath };
    await ensureIdentityAvailable(supabaseServer, tile);
    const buffer = Buffer.from(await file.arrayBuffer());
    uploadedImage = await saveTileImage(supabaseServer, cloudinary,
      () => new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: `sepione-ceramic/${size}/${category}`,
          public_id: `${filename}-${randomUUID()}`,
          resource_type: 'image', overwrite: false,
        }, (error, result) => error ? reject(error) : resolve(result)).end(buffer);
      }),
      async image => {
        const { error } = await supabaseServer.from('tile_images').insert({
          ...tile, folder_path: `${size}/${category}`,
          cloudinary_public_id: image.public_id, cloudinary_secure_url: image.secure_url,
          image_width: image.width, image_height: image.height,
          upload_status: 'SUCCESS', error_message: null, updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      });
  } catch (error) {
    return NextResponse.json({ success: false,
      error: error.code === '23505' ? DUPLICATE_TILE_ERROR
        : error.code === 'IDENTITY_UNAVAILABLE' ? error.message : 'The image could not be saved. Check the image and try again.',
      ...(error.cleanup ? { cleanup: error.cleanup } : {}),
    }, { status: error.code === '23505' ? 409 : 503 });
  }
  // Cache invalidation is outside compensation: a committed image must survive it.
  revalidateCatalog();
  return NextResponse.json({ success: true, message: 'Tile uploaded successfully.', url: uploadedImage.secure_url });
}
