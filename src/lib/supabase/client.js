import { createClient } from '@supabase/supabase-js';

console.log('DEBUG Supabase URL:', JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL));
console.log('DEBUG Supabase Anon Key (first 12 chars):', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 12) + '...' 
    : 'UNDEFINED');
console.log('DEBUG Supabase Anon Key length:', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0);

// CLIENT-SIDE SAFE CLIENT
// This client uses the anon key and is subject to Row Level Security (RLS) policies.
// It is safe to use in the browser ("use client" components) and on the public website.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or Anon Key. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

export const supabaseClient = createClient(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseAnonKey || 'dummy_key'
);
