import 'server-only';
import { checkAdminCredential } from './admin-credentials.js';
import { NextResponse } from 'next/server';
import { isSupabaseAdminConfigured } from './supabase/server';
import { isCloudinaryConfigured } from './cloudinary';

export function authorizeAdmin(secret, { database = true, uploads = false } = {}) {
  const result = checkAdminCredential(secret, process.env.ADMIN_SECRET);
  if (result === 'unconfigured') {
    return NextResponse.json({ success: false, error: 'Admin access is not configured. Set a secure ADMIN_SECRET on the server.' }, { status: 503 });
  }
  if (result !== 'authorized') {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }
  if (database && !isSupabaseAdminConfigured) {
    return NextResponse.json({ success: false, error: 'The admin database is not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server.' }, { status: 503 });
  }
  if (uploads && !isCloudinaryConfigured) {
    return NextResponse.json({ success: false, error: 'Image storage is not configured on the server.' }, { status: 503 });
  }
  return null;
}
