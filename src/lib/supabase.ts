import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function getSupabaseConfig() {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('orion_supabase_url') : null
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('orion_supabase_key') : null

  const supabaseUrl = (
    customUrl ||
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://ezcwgyhwotomranbyuyh.supabase.co'
  ).trim()

  const supabaseAnonKey = (
    customKey ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim()

  return { supabaseUrl, supabaseAnonKey }
}

export function initSupabase(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
  if (!supabaseUrl || !supabaseAnonKey) return null

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.warn('Supabase initialization warning:', err)
    return null
  }
}

export let supabase = initSupabase()

export function setSupabaseConfig(url?: string, key?: string) {
  if (typeof window === 'undefined') return
  if (url) localStorage.setItem('orion_supabase_url', url.trim())
  if (key) localStorage.setItem('orion_supabase_key', key.trim())
  supabase = initSupabase()
}
