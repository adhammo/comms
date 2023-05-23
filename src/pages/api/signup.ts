import fs from 'fs'
import multiparty from 'multiparty'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database, Json } from '@/lib/database'
import supabase from '@/lib/client'
import { createProfile, getProfileById, updateProfile } from '@/lib/profiles'
import { PostgrestError } from '@supabase/supabase-js'
import path from 'path'

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

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST requests allowed')
    return
  }

  const { fields: fieldsMulti }: any = await parser(req)
  const fields = Object.entries(fieldsMulti).reduce(
    (fields: any, field: [string, any]) => ({ ...fields, [field[0]]: field[1][0] }),
    {}
  )

  const { username, first_name, last_name, email, password } = fields
  if (!username || !first_name || !last_name || !email || !password) {
    res.status(400).send('Missing user data')
    return
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name,
          last_name,
        },
      },
    })
    if (error) {
      if (error.message === 'duplicate key value violates unique constraint "profiles_pkey"')
        throw { message: 'Username already exists' }
      throw error
    }
    if (!user) {
      throw { message: 'No user created' }
    }
    await createProfile({ id: user.id, username, first_name, last_name })
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
