import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    !supabaseUrl.includes('your-project') &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
)

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
