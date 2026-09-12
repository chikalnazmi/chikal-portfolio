import { createClient } from '@supabase/supabase-js';

// Fallback credentials for deployments where environment variables cannot be set directly via Vercel dashboard
const FALLBACK_SUPABASE_URL = 'https://sfenzcsurtcejjpwbrqk.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_2gYwT26z_B34bS0o1nvOEA_wnqRjTXe';
const FALLBACK_SUPABASE_SERVICE_KEY = 'sb_secret_3ds2yI2Zf0iq36SQpW16-g_y7_62ipr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
// Support both standard anon key and Supabase's new publishable key format
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  FALLBACK_SUPABASE_ANON_KEY;

// Backend secret key (service role) - only accessible server-side
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SECRET_KEY ||
  FALLBACK_SUPABASE_SERVICE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

// Client-side & public Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Server-side privileged client (bypasses RLS using secret key)
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
