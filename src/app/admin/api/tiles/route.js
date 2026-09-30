import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { authorizeAdmin } from '@/lib/admin-auth';
import { parseTileQuery } from '@/lib/tile-query';
import { getAdminTiles } from '@/lib/admin-tiles';

export async function GET(request) {
  const denied = authorizeAdmin(request.headers.get('Authorization'));
  if (denied) return denied;
  let filters;
  try {
    filters = parseTileQuery(new URL(request.url).searchParams);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
  try {
    return NextResponse.json({ success: true, ...await getAdminTiles(supabaseServer, filters) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch tiles. Please try again.' }, { status: 503 });
  }
}
