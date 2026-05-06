import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Global error wrapper for Supabase operations with timeout handling
 */
export async function withSupabaseErrorHandling(operation, timeoutMs = 10000) {
  return Promise.race([
    (async () => {
      const result = await operation();
      return result;
    })(),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Supabase operation timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]).catch((error) => {
    console.error('Supabase operation failed:', error.message);
    return { error: { message: error.message } };
  });
}

/**
 * Listen to auth state changes globally
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
