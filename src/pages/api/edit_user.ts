import fs from 'fs'
import multiparty from 'multiparty'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'
import { getProfileById, updateProfile } from '@/lib/profiles'
import { PostgrestError } from '@supabase/supabase-js'

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

export default async function edit_user(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(401).send('Unauthorized user update')
    return
  }

  const { fields: fieldsMulti, files: filesMulti }: any = await parser(req)
  const fields = Object.entries(fieldsMulti).reduce(
    (fields: any, field: [string, any]) => ({ ...fields, [field[0]]: field[1][0] }),
    {}
  )
  const files = Object.entries(filesMulti).reduce(
    (files: any, file: [string, any]) => ({ ...files, [file[0]]: file[1][0] }),
    {}
  )

  const { first_name, last_name, bio } = fields
  if (!first_name || !last_name || !bio) {
    res.status(400).send('Missing user data')
    return
  }

  const { image } = files

  try {
    const { username } = await getProfileById(user.id)
    if (image) {
      const { error } = await supabase.storage
        .from('images')
        .upload(`/profiles/${username}.jpg`, fs.readFileSync(image.path), {
          upsert: true,
          contentType: 'image/jpg',
        })
      if (error) throw error
    }
    await updateProfile(username, {
      first_name,
      last_name,
      bio,
    })
    await res.revalidate(`/authors/${username}`)
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
