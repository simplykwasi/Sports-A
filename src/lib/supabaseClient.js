import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://sijynfgkrcnhgmaqdcav.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanluZmdrcmNuaGdtYXFkY2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTUwMDcsImV4cCI6MjA5MzU5MTAwN30.BUb1FNtJARVAOVQMDo479KFtlbNcf5-EZe7f3XYWOxI'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

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
})

export async function withSupabaseErrorHandling(operation, timeoutMs = 10000) {
  return Promise.race([
    (async () => {
      const result = await operation()
      return result
    })(),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Supabase operation timeout after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]).catch((error) => {
    console.error('Supabase operation failed:', error.message)
    return { error: { message: error.message } }
  })
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
