import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { hasSupabaseConfig } from './config.js';

// SERVER-SIDE ONLY CLIENT
// This client bypasses Row Level Security (RLS) policies completely.
// WARNING: NEVER import this into any file containing "use client".
// WARNING: NEVER expose this client or the service role key to the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = hasSupabaseConfig(supabaseUrl, supabaseServiceKey);

export const supabaseServer = isSupabaseAdminConfigured ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
}) : null;
