import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import cloudinary from '@/lib/cloudinary';
import { authorizeAdmin } from '@/lib/admin-auth';
import { isValidTileId, validateTileText } from '@/lib/tile-validation';
import { revalidateCatalog } from '@/lib/revalidate-catalog';
import { ensureIdentityAvailable, DUPLICATE_TILE_ERROR, identityLookupError } from '@/lib/tile-identity';

export async function PATCH(request, { params }) {
  const denied = authorizeAdmin(request.headers.get('Authorization'));
  if (denied) return denied;
  const { id } = await params;
  if (!isValidTileId(id)) return NextResponse.json({ success: false, error: 'Invalid tile ID.' }, { status: 400 });

  let updates;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid tile details.');
    updates = {};
    if (body.filename !== undefined) updates.filename = validateTileText(body.filename, 'Filename');
    if (body.category !== undefined) updates.category = validateTileText(body.category, 'Category');
    if (!Object.keys(updates).length) throw new Error('No fields to update.');
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof SyntaxError ? 'Invalid JSON.' : error.message }, { status: 400 });
  }

  try {
    const { data: current, error: readError } = await supabaseServer.from('tile_images')
      .select('id, size, category, filename, local_path, logical_identity').eq('id', id).maybeSingle();
    if (readError) return NextResponse.json({ success: false, error: identityLookupError(readError).message }, { status: 503 });
    if (!current) return NextResponse.json({ success: false, error: 'Tile not found.' }, { status: 404 });
    await ensureIdentityAvailable(supabaseServer, { ...current, ...updates }, id);
    const { data, error } = await supabaseServer.from('tile_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select('id').maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'Tile not found.' }, { status: 404 });
    revalidateCatalog();
    return NextResponse.json({ success: true, message: 'Tile updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.code === '23505' ? DUPLICATE_TILE_ERROR : error.code === 'IDENTITY_UNAVAILABLE' ? error.message : 'Failed to update tile. Please try again.' }, { status: error.code === '23505' ? 409 : 503 });
  }
}

export async function DELETE(request, { params }) {
  const denied = authorizeAdmin(request.headers.get('Authorization'), { uploads: true });
  if (denied) return denied;
  const { id } = await params;
  if (!isValidTileId(id)) return NextResponse.json({ success: false, error: 'Invalid tile ID.' }, { status: 400 });

  try {
    // Delete the database row first. A database failure must never leave a
    // published tile pointing to an image that has already been destroyed.
    const { data: tile, error } = await supabaseServer.from('tile_images')
      .delete().eq('id', id).select('cloudinary_public_id').maybeSingle();
    if (error) throw error;
    if (!tile) return NextResponse.json({ success: false, error: 'Tile not found.' }, { status: 404 });
    revalidateCatalog();

    let warning;
    if (tile.cloudinary_public_id) {
      try {
        const result = await cloudinary.uploader.destroy(tile.cloudinary_public_id, { invalidate: true });
        if (!['ok', 'not found'].includes(result.result)) throw new Error('Image cleanup failed.');
      } catch {
        warning = 'The tile was removed from the catalogue, but its stored image could not be deleted. Retry image cleanup in Cloudinary.';
      }
    }
    return NextResponse.json({ success: true, message: 'Tile deleted successfully.', ...(warning ? { warning } : {}) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete tile. Please try again.' }, { status: 503 });
  }
}
