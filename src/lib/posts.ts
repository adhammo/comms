import supabase from './client'

export async function getAllPosts() {
  let { data: posts, error } = await supabase.from('posts').select('id, title')
  if (error) console.error(error.message)
  if (!posts) console.error('No posts found')
  return posts!
}

export async function getPost(id: number) {
  let { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
  if (error) console.error(error.message)
  if (!posts?.length) console.error('No post found with that key')
  return posts![0]
}
