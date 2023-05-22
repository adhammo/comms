import fs from 'fs'
import multiparty from 'multiparty'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'
import { getProfileById } from '@/lib/profiles'
import { checkCategory, checkPost, checkUserCategory, createPost } from '@/lib/posts'

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

export default async function create_post(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(401).send('Unauthorized post creation')
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

  const { category, id, title, description, read_time, content } = fields
  if (!category || !id || !title || !description || !read_time || !content) {
    res.status(400).send('Missing post data')
    return
  }

  const { image } = files
  if (!image) {
    res.status(400).send('Missing post data')
    return
  }

  try {
    const { username, role } = await getProfileById(user.id)
    // (role === 'owner' || role === 'manager')
    if (true) {
      if (!(await checkCategory(category))) {
        res.status(400).send('No category with this id')
        return
      }
    } else {
      if (!(await checkUserCategory(username, category))) {
        res.status(400).send('Category is not available for this user')
        return
      }
    }
    if (await checkPost(id)) {
      res.status(400).send('Post with same Id already exists')
      return
    }
    const { error } = await supabase.storage
      .from('images')
      .upload(`/posts/${id}.jpg`, fs.readFileSync(image.path), { contentType: 'image/jpg' })
    if (error) throw error
    await createPost({
      category,
      id,
      title,
      description,
      read_time: parseInt(read_time),
      content: JSON.parse(content),
      author: username,
    })
    await res.revalidate(`/articles/${category}`)
    await res.revalidate(`/articles/${category}/${id}`)
    await res.revalidate(`/authors/${username}`)
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
