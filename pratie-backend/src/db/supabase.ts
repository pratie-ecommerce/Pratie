import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let supabase: SupabaseClient | null = null;

if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Supabase client initialized');
  } catch (err) {
    console.warn('⚠️ Supabase credentials invalid or unreachable, using in-memory store', err);
  }
} else {
  console.log('ℹ️ Supabase environment variables not set; using local in-memory DB store');
}

export { supabase };
