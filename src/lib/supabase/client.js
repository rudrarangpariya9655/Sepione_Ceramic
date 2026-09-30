import { createClient } from '@supabase/supabase-js';
import { hasSupabaseConfig } from './config.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = hasSupabaseConfig(supabaseUrl, supabaseAnonKey);

// The public catalogue uses the anonymous key and remains subject to RLS.
// Missing configuration must not initiate requests to a dummy database.
export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;
