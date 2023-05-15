import supabase from './client'

export async function getAllPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, author, category, created_at, title, description, read_time')
    .eq('live', true)
  if (error) throw error
  return posts
}

export async function getPost(postId: string) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, author, category, created_at, title, description, content, read_time')
    .eq('live', true)
    .eq('id', postId)
  if (error) throw error
  return posts[0]
}

export async function getAllCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, title, description')
    .eq('live', true)
  if (error) throw error
  return categories
}

export async function getCategory(categoryId: string) {
  const [{ data: categories, error: categoriesErorr }, { data: posts, error: postsError }] = await Promise.all([
    supabase.from('categories').select('id, title, description').eq('live', true).eq('id', categoryId),
    supabase
      .from('posts')
      .select('id, author, category, created_at, title, description, read_time')
      .eq('live', true)
      .eq('category', categoryId),
  ])
  if (categoriesErorr) throw categoriesErorr
  if (postsError) throw postsError
  return { ...categories![0], posts: posts! }
}

export async function createPost(title: string, content: string) {
  // const { error } = await supabase.from('posts').insert([{ title, content }])
  // if (error) console.error(error.message)
}
