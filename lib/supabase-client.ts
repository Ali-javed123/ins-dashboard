// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Use NEXT_PUBLIC_ prefix for environment variables accessible in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!



export const supabase = createClient(supabaseUrl, supabaseAnonKey)
