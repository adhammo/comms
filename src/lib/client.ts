import { createClient } from '@supabase/supabase-js'
import { Database } from './database'

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL || SUPABASE_URL,
  process.env.SERVICE_KEY || SERVICE_KEY
)

export default supabase
