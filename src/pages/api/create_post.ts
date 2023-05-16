import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'

export declare type Post = {
  author: string
  category: string
  content: Json
  description: string
  id: string
  read_time: number
  title: string
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
    res.status(401).send('Unauthorized post creation')
    return
  }

  const postReq = req.body

  const { data, error: categoryError } = await supabaseClient.from('user_categories').select('categories (*)')
  if (categoryError) throw categoryError
  if (!data.some((category: any) => category.categories.id === postReq.category)) {
    res.status(500).send('Category is not available for this user')
    return
  }

  const { data: posts, error: postError } = await supabase.from('posts').select('id').eq('id', postReq.id)
  if (postError) throw postError
  if (posts.length > 0) {
    res.status(500).send('Post with same Id already exists')
    return
  }

  const { error } = await supabase.from('posts').insert([{ ...postReq, author: user.id }])
  if (error) {
    res.status(500).send('Something wrong with post data')
    return
  }

  res.status(200).send('Success')
}
