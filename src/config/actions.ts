import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database'

export declare type FieldType = 'text' | 'number' | 'drop' | 'tiptap'

export declare type Field = {
  id: string
  type: FieldType
  label: string
}

export declare type Changes = {
  [id: string]: (props: { [id: string]: any }, fields: { [id: string]: any }) => { [id: string]: any }
}

export declare type Command = {
  id: string
  label: string
  callback: (supabase: SupabaseClient<Database>, fields: { [id: string]: any }) => void
}

export declare type Action = {
  id: string
  name: string
  load: (supabase: SupabaseClient<Database>) => {}
  fields: Field[]
  changes: Changes
  commands: Command[]
}

const authorActions: Action[] = [
  {
    id: 'create_post',
    name: 'Create Article',
    load: async supabase => {
      const { data, error } = await supabase.from('user_categories').select('categories (*)')
      if (error) throw error
      return {
        category: [
          data.map((category: any) => ({ value: category.categories.id, label: category.categories.title })),
          (data[0]?.categories as any).id,
        ],
        id: '',
        title: '',
        description: '',
        read_time: '',
        content: '',
        error: undefined,
      }
    },
    fields: [
      { id: 'category', type: 'drop', label: 'Category' },
      { id: 'id', type: 'text', label: 'Path' },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'text', label: 'Description' },
      { id: 'read_time', type: 'number', label: 'Read Minutes' },
      { id: 'content', type: 'tiptap', label: 'Content' },
    ],
    changes: {},
    commands: [
      {
        id: 'save',
        label: 'Save',
        callback: async (_, fields) => {
          const res = await fetch('/api/create_post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields),
          })
          if (!res.ok) {
            const text = await res.text()
            console.log(text)
            return text
          }
          return null
        },
      },
      { id: 'publish', label: 'Publish', callback: () => {} },
    ],
  },
  {
    id: 'edit_post',
    name: 'Edit Article',
    load: async supabase => {
      const { data: posts, error } = await supabase.from('posts').select('*')
      if (error) throw error
      return {
        post: [posts.map(post => ({ ...post, value: post.id, label: post.title })), posts[0].id],
        title: posts[0]?.title,
        description: posts[0]?.description,
        read_time: posts[0]?.read_time,
        content: posts[0]?.content,
        error: posts.length === 0 ? 'You have no posts' : undefined,
      }
    },
    fields: [
      { id: 'post', type: 'drop', label: 'Post' },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'text', label: 'Description' },
      { id: 'read_time', type: 'number', label: 'Read Minutes' },
      { id: 'content', type: 'tiptap', label: 'Content' },
    ],
    changes: {
      post: (props, fields) => {
        const post = props['post'].find((post: any) => post.value === fields['post'])
        return {
          title: post?.title,
          description: post?.description,
          read_time: post?.read_time,
          content: post?.content,
          error: !post ? 'No post found' : undefined,
          refresh: true,
        }
      },
    },
    commands: [{ id: 'update', label: 'Update', callback: () => {} }],
  },
]

export const actions: { [name: string]: Action[] } = {
  owner: [...authorActions],
  manager: [...authorActions],
  author: authorActions,
}

export default actions
