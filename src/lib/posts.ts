import supabase from './client'

export async function getAllPosts() {
  const { data: posts, error } = await supabase.from('posts').select('id, title')
  if (error) console.error(error.message)
  if (!posts) console.error('No posts found')
  return posts
}

export async function getPost(id: number) {
  const { data: posts, error } = await supabase.from('posts').select('*').eq('id', id)
  if (error) console.error(error.message)
  if (!posts?.length) console.error('No post found with that id')
  return posts?.[0]
}

export async function createPost(title: string, content: string) {
  // const { error } = await supabase.from('posts').insert([{ title, content }])
  // if (error) console.error(error.message)
}
