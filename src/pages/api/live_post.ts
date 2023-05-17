import fs from 'fs'
import multiparty from 'multiparty'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'
import { getProfileById } from '@/lib/profiles'
import { PostgrestError } from '@supabase/supabase-js'
import { checkUserPost, livePost, updatePost } from '@/lib/posts'

export declare type Post = {
  author: string
  category: string
  content: Json
  description: string
  id: string
  read_time: number
  title: string
}

async function parser(req: NextApiRequest) {
  return new Promise((resolve, reject) => {
    var form = new multiparty.Form()
    form.parse(req, function (err, fields, files) {
      if (err) throw reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function live_post(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(401).send('Unauthorized post live')
    return
  }

  const { fields: fieldsMulti }: any = await parser(req)
  const fields = Object.entries(fieldsMulti).reduce(
    (fields: any, field: [string, any]) => ({ ...fields, [field[0]]: field[1][0] }),
    {}
  )

  const { post, live } = fields
  if (!post || !live) {
    res.status(400).send('Missing post data')
    return
  }

  try {
    const profile = await getProfileById(user.id)
    if (!(await checkUserPost(profile.username, post))) {
      res.status(400).send('Post does not belong to this user')
      return
    }
    await livePost(post, live === 'true')
    res.status(200).send('Success')
  } catch (error) {
    res.status(500).send((error as PostgrestError).message)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
