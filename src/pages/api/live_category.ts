import fs from 'fs'
import multiparty from 'multiparty'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'
import { getProfileById } from '@/lib/profiles'
import { checkCategory, checkPost, checkUserCategory, createCategory, createPost, liveCategory, updateCategory } from '@/lib/posts'

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
    res.status(401).send('Unauthorized category live')
    return
  }

  const { fields: fieldsMulti }: any = await parser(req)
  const fields = Object.entries(fieldsMulti).reduce(
    (fields: any, field: [string, any]) => ({ ...fields, [field[0]]: field[1][0] }),
    {}
  )

  const { category, live } = fields
  if (!category || !live) {
    res.status(400).send('Missing category data')
    return
  }

  try {
    const profile = await getProfileById(user.id)
    if (!(profile.role === 'owner' || profile.role === 'manager')) {
      res.status(401).send('User is not authorized to live categories')
      return
    }
    if (!(await checkCategory(category))) {
      res.status(400).send('Category does not exist')
      return
    }
    await liveCategory(category, live === 'true')
    res.status(200).send('Success')
  } catch (error) {
    res.status(500).send((error as Error).message)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
