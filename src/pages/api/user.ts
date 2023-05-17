import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database'
import { getProfileById } from '@/lib/profiles'
import { PostgrestError } from '@supabase/supabase-js'

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST requests allowed')
    return
  }

  const supabaseClient = createServerSupabaseClient<Database>({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) {
    res.status(401).send('Unauthorized user')
    return
  }

  try {
    const profile = await getProfileById(user.id)
    res.status(200).json({ profile })
  } catch (error) {
    res.status(500).send((error as PostgrestError).message)
  }
}
