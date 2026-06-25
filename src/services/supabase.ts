import { createClient } from '@supabase/supabase-js';

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        persistSession: true,
      },
    })
  : null;

export function getAuthRedirectUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

function normalizeSupabaseUrl(url: string | undefined): string {
  const trimmedUrl = url?.trim() ?? '';

  if (!trimmedUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    return parsedUrl.origin;
  } catch {
    return trimmedUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  }
}
