import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase/client';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get('size');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = searchParams.get('limit');
  
  const page = parseInt(searchParams.get('page')) || 1;
  const pageSize = parseInt(searchParams.get('pageSize')) || 24;
  
  let query = supabaseClient
    .from('tile_images')
    .select('id, size, category, filename, cloudinary_secure_url, created_at', { count: 'exact' })
    .eq('upload_status', 'SUCCESS')
    .order('created_at', { ascending: false });
    
  if (size) query = query.eq('size', size);
  if (category && category !== "All") query = query.eq('category', category);
  if (search) query = query.ilike('filename', `%${search}%`);
  
  if (limit) {
    query = query.limit(parseInt(limit));
  } else {
    // Pagination (0-indexed inclusive)
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }
  
  const { data, count, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ tiles: data, totalCount: count });
}
