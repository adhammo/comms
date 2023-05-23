import fs from 'fs'
import multiparty from 'multiparty'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'
import { getProfileById } from '@/lib/profiles'
import { checkCategory, checkPost, checkUserCategory, createCategory, createPost, updateCategory } from '@/lib/posts'

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

export default async function edit_category(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(401).send('Unauthorized category update')
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

  const { category, title, description } = fields
  if (!category || !title || !description) {
    res.status(400).send('Missing category data')
    return
  }

  const { image } = files

  try {
    const { role } = await getProfileById(user.id)
    // if (!(role === 'owner' || role === 'manager')) {
    //   res.status(401).send('User is not authorized to edit categories')
    //   return
    // }
    if (!(await checkCategory(category))) {
      res.status(400).send('Category does not exist')
      return
    }
    if (image) {
      const { error } = await supabase.storage
        .from('images')
        .upload(`/categories/${category}.jpg`, fs.readFileSync(image.path), { upsert: true, contentType: 'image/jpg' })
      if (error) throw error
    }
    await updateCategory(category, {
      title,
      description,
    })
    await res.revalidate('/articles')
    await res.revalidate(`/articles/${category}`)
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
