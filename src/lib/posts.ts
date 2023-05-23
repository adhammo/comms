import supabase from './client'

export async function getAllLivePosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, profiles ( username, first_name, last_name, picture ), category, created_at, title, description, read_time')
    .eq('live', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return posts
}

export async function getAllPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      'id, profiles ( username, first_name, last_name, picture ), category, created_at, title, description, read_time, live'
    )
    .order('created_at', { ascending: false })
  if (error) throw error
  return posts
}

export async function getUserPosts(username: string) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, profiles ( username, first_name, last_name, picture ), category, created_at, title, description, read_time')
    .eq('live', true)
    .eq('author', username)
    .order('created_at', { ascending: false })
  if (error) throw error
  return posts
}

export async function getUserPostsWithContent(username: string) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author', username)
    .order('created_at', { ascending: false })
  if (error) throw error
  return posts
}

export async function getPost(postId: string) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles ( username, first_name, last_name, picture )')
    .eq('id', postId)
  if (error) throw error
  return posts[0]
}

export async function getPostShort(postId: string) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, profiles ( username, first_name, last_name, picture ), category, created_at, title, description, read_time')
    .eq('id', postId)
  if (error) throw error
  return posts[0]
}

export async function checkPost(postId: string) {
  const { data: posts, error } = await supabase.from('posts').select('id').eq('id', postId)
  if (error) throw error
  return posts.length > 0
}

export async function checkUserPost(username: string, postId: string) {
  const { data: posts, error } = await supabase.from('posts').select('id').eq('author', username).eq('id', postId)
  if (error) throw error
  return posts.length > 0
}

export async function createPost(post: {
  category: any
  id: any
  title: any
  description: any
  read_time: any
  content: any
  author: any
}) {
  const { error } = await supabase.from('posts').insert([post])
  if (error) throw error
}

export async function updatePost(
  postId: string,
  post: {
    title: any
    description: any
    read_time: any
    content: any
  }
) {
  const { error } = await supabase.from('posts').update(post).eq('id', postId)
  if (error) throw error
}

export async function livePost(postId: string, live: boolean) {
  const { error } = await supabase.from('posts').update({ live }).eq('id', postId)
  if (error) throw error
}

export async function getAllLiveCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, title, description')
    .eq('live', true)
    .order('title')
  if (error) throw error
  return categories
}

export async function getAllCategories() {
  const { data: categories, error } = await supabase.from('categories').select('*').order('title')
  if (error) throw error
  return categories
}

export async function getUserCategories(username: string) {
  const { data, error } = await supabase.from('user_categories').select('categories (*)').eq('username', username)
  if (error) throw error
  return (
    data.map(
      category =>
        category.categories as {
          description: string
          id: string
          live: boolean
          title: string
        }
    ) as {
      description: string
      id: string
      live: boolean
      title: string
    }[]
  ).sort()
}

export async function getCategory(categoryId: string) {
  const [{ data: categories, error: categoriesErorr }, { data: posts, error: postsError }] = await Promise.all([
    supabase.from('categories').select('*').eq('id', categoryId),
    supabase
      .from('posts')
      .select('id, profiles ( username, first_name, last_name, picture ), category, created_at, title, description, read_time')
      .eq('live', true)
      .eq('category', categoryId)
      .order('created_at', { ascending: false }),
  ])
  if (categoriesErorr) throw categoriesErorr
  if (postsError) throw postsError
  return { ...categories![0], posts: posts! }
}

export async function checkCategory(categoryId: string) {
  const { data: categories, error } = await supabase.from('categories').select('*').eq('id', categoryId)
  if (error) throw error
  return categories.length > 0
}

export async function checkUserCategory(username: string, categoryId: string) {
  const { data, error } = await supabase
    .from('user_categories')
    .select('categories (id)')
    .eq('username', username)
    .eq('category', categoryId)
  if (error) throw error
  return data.length > 0
}

export async function createCategory(category: { id: any; title: any; description: any }) {
  const { error } = await supabase.from('categories').insert([category])
  if (error) throw error
}

export async function updateCategory(
  categoryId: string,
  category: {
    title: any
    description: any
  }
) {
  const { error } = await supabase.from('categories').update(category).eq('id', categoryId)
  if (error) throw error
}

export async function liveCategory(categoryId: string, live: boolean) {
  const { error } = await supabase.from('categories').update({ live }).eq('id', categoryId)
  if (error) throw error
}
