import { NextResponse } from 'next/server';
import { parseTileQuery } from '@/lib/tile-query';
import { getTiles } from '@/lib/tiles';

export async function GET(request) {
  let filters;
  try {
    filters = parseTileQuery(new URL(request.url).searchParams);
  } catch (error) {
    return NextResponse.json({ error: error.message, tiles: [], totalCount: 0 }, { status: 400 });
  }

  const result = await getTiles(filters);
  return NextResponse.json(result, { status: result.error ? 503 : 200 });
}
