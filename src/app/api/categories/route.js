import { NextResponse } from 'next/server';
import { getCategoryResult } from '@/lib/tiles';
import { TILE_SIZES } from '@/lib/tile-query';

export async function GET(request) {
  const size = new URL(request.url).searchParams.get('size');
  if (!TILE_SIZES.includes(size)) return NextResponse.json({ error: 'Choose a supported tile size.' }, { status: 400 });
  const result = await getCategoryResult(size);
  return NextResponse.json(result, { status: result.error ? 503 : 200 });
}
