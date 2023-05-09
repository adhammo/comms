import { createClient } from '@supabase/supabase-js'
import { Database } from './database'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || 'https://shupathcwnvkitgevtoe.supabase.co',
  process.env.SERVICE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNodXBhdGhjd252a2l0Z2V2dG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI2Mjk1OTgsImV4cCI6MTk5ODIwNTU5OH0.6_zVjsyNk7cGEfg1zJkL1LxSKpFiFA2TGesxw-d7_lI'
)

export default supabase
