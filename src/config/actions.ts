import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database'

export declare type FieldType = 'text' | 'textarea' | 'number' | 'image' | 'drop' | 'tiptap'

export declare type Field = {
  id: string
  type: FieldType
  label: string
  description?: string
  error?: (value: any) => string | undefined
}

export declare type Changes = {
  [id: string]: (props: { [id: string]: any }, fields: { [id: string]: any }) => { [id: string]: any }
}

export declare type Command = {
  id: string
  label: string
  valid?: (props: { [id: string]: any }, fields: { [id: string]: any }) => boolean
  callback: (
    supabase: SupabaseClient<Database>,
    fields: { [id: string]: any }
  ) => Promise<string | undefined> | string | undefined
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
    load: async () => {
      const res = await fetch('/api/user_categories', {
        method: 'POST',
      })
      if (!res.ok) {
        const text = await res.text()
        return { error: text }
      }
      const { categories } = await res.json()
      if (categories.length === 0) return { error: 'You have access to no categories' }
      return {
        category: [
          categories.map((category: any) => ({ ...category, value: category.id, label: category.title })),
          categories[0].id,
        ],
        id: '',
        title: '',
        description: '',
        read_time: '',
        image: '',
        content: '',
      }
    },
    fields: [
      { id: 'category', type: 'drop', label: 'Category' },
      {
        id: 'id',
        type: 'text',
        label: 'Path',
        description: 'Article URL e.g. (why_trees_green)',
        error: value =>
          value === '' || /^[a-z0-9_]*[a-z0-9]+$/.test(value) ? undefined : 'Only small caps, numbers, and underscores',
      },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'textarea', label: 'Description' },
      { id: 'read_time', type: 'number', label: 'Read Time', description: 'How long is the post in minutes' },
      {
        id: 'image',
        type: 'image',
        label: 'Thumbnail',
        description: 'Under 1MB JPEG, better be 864x486 px',
        error: (value: any) =>
          (value.file &&
            ((value.file.size > 1024 * 1024 && 'Image size must be under 1MB') ||
              (value.file.type !== 'image/jpeg' && 'Image format must be JPEG') ||
              undefined)) ||
          undefined,
      },
      { id: 'content', type: 'tiptap', label: 'Content' },
    ],
    changes: {},
    commands: [
      {
        id: 'publish',
        label: 'Publish',
        callback: async (_, fields) => {
          const formData = new FormData()
          for (const id in fields) {
            switch (id) {
              case 'content':
                formData.append(id, JSON.stringify(fields[id]))
                break
              case 'read_time':
                formData.append(id, fields[id].toString())
                break
              case 'image':
                if (fields[id]) formData.append(id, fields[id])
                break
              default:
                formData.append(id, fields[id])
                break
            }
          }
          const res = await fetch('/api/create_post', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
      {
        id: 'save',
        label: 'Save',
        callback: async (_, fields) => {
          const formData = new FormData()
          for (const id in fields) {
            switch (id) {
              case 'content':
                formData.append(id, JSON.stringify(fields[id]))
                break
              case 'read_time':
                formData.append(id, fields[id].toString())
                break
              case 'image':
                if (fields[id]) formData.append(id, fields[id])
                break
              default:
                formData.append(id, fields[id])
                break
            }
          }
          const res = await fetch('/api/create_post', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          const liveformData = new FormData()
          liveformData.append('post', fields['id'])
          liveformData.append('live', 'false')
          const liveres = await fetch('/api/live_post', {
            method: 'POST',
            body: liveformData,
          })
          if (!liveres.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
    ],
  },
  {
    id: 'edit_post',
    name: 'Edit Article',
    load: async () => {
      const res = await fetch('/api/user_posts', {
        method: 'POST',
      })
      if (!res.ok) {
        const text = await res.text()
        return { error: text }
      }
      const { posts } = await res.json()
      if (posts.length === 0) return { error: 'You have no posts' }
      return {
        post: [posts.map((post: any) => ({ ...post, value: post.id, label: post.title })), posts[0].id],
        title: posts[0].title,
        description: posts[0].description,
        read_time: posts[0].read_time,
        image: '',
        content: posts[0].content,
      }
    },
    fields: [
      { id: 'post', type: 'drop', label: 'Post' },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'textarea', label: 'Description' },
      { id: 'read_time', type: 'number', label: 'Read Minutes', description: 'How long is the post in minutes' },
      {
        id: 'image',
        type: 'image',
        label: 'Thumbnail',
        description: 'Leave empty for no thumbnail update',
        error: (value: any) =>
          (value.file &&
            ((value.file.size > 1024 * 1024 && 'Image size must be under 1MB') ||
              (value.file.type !== 'image/jpeg' && 'Image format must be JPEG') ||
              undefined)) ||
          undefined,
      },
      { id: 'content', type: 'tiptap', label: 'Content' },
    ],
    changes: {
      post: (props, fields) => {
        const post = props['post'].find((post: any) => post.value === fields['post'])
        if (!post) return { error: 'No post found' }
        return {
          title: post.title,
          description: post.description,
          read_time: post.read_time,
          content: post.content,
          refresh: true,
        }
      },
    },
    commands: [
      {
        id: 'update',
        label: 'Update',
        callback: async (_, fields) => {
          const formData = new FormData()
          for (const id in fields) {
            switch (id) {
              case 'content':
                formData.append(id, JSON.stringify(fields[id]))
                break
              case 'read_time':
                formData.append(id, fields[id].toString())
                break
              case 'image':
                if (fields[id]) formData.append(id, fields[id])
                break
              default:
                formData.append(id, fields[id])
                break
            }
          }
          const res = await fetch('/api/edit_post', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
      {
        id: 'enable',
        label: 'Enable',
        valid: (props, fields) => !props['post'].find((category: any) => category.id === fields['post'])?.live,
        callback: async (_, fields) => {
          const formData = new FormData()
          formData.append('post', fields['post'])
          formData.append('live', 'true')
          const res = await fetch('/api/live_post', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
      {
        id: 'disable',
        label: 'Disable',
        valid: (props, fields) => props['post'].find((category: any) => category.id === fields['post'])?.live,
        callback: async (_, fields) => {
          const formData = new FormData()
          formData.append('post', fields['post'])
          formData.append('live', 'false')
          const res = await fetch('/api/live_post', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
    ],
  },
]

const managerActions: Action[] = [
  {
    id: 'create_category',
    name: 'Create Category',
    load: async () => {
      return {
        id: '',
        title: '',
        description: '',
        image: '',
      }
    },
    fields: [
      {
        id: 'id',
        type: 'text',
        label: 'Path',
        description: 'Category URL e.g. (green_trees)',
        error: value =>
          value === '' || /^[a-z0-9_]*[a-z0-9]+$/.test(value) ? undefined : 'Only small caps, numbers, and underscores',
      },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'textarea', label: 'Description' },
      {
        id: 'image',
        type: 'image',
        label: 'Thumbnail',
        description: 'Under 1MB JPEG, better be 480x480 px',
        error: (value: any) =>
          (value.file &&
            ((value.file.size > 1024 * 1024 && 'Image size must be under 1MB') ||
              (value.file.type !== 'image/jpeg' && 'Image format must be JPEG') ||
              undefined)) ||
          undefined,
      },
    ],
    changes: {},
    commands: [
      {
        id: 'create',
        label: 'Create',
        callback: async (_, fields) => {
          const formData = new FormData()
          for (const id in fields) {
            switch (id) {
              case 'image':
                if (fields[id]) formData.append(id, fields[id])
                break
              default:
                formData.append(id, fields[id])
                break
            }
          }
          const res = await fetch('/api/create_category', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
    ],
  },
  {
    id: 'edit_category',
    name: 'Edit Category',
    load: async () => {
      const res = await fetch('/api/user_categories', {
        method: 'POST',
      })
      if (!res.ok) {
        const text = await res.text()
        return { error: text }
      }
      const { categories } = await res.json()
      if (categories.length === 0) return { error: 'You have no categories' }
      return {
        category: [
          categories.map((category: any) => ({ ...category, value: category.id, label: category.title })),
          categories[0].id,
        ],
        title: categories[0].title,
        description: categories[0].description,
        image: '',
      }
    },
    fields: [
      { id: 'category', type: 'drop', label: 'Category' },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'textarea', label: 'Description' },
      {
        id: 'image',
        type: 'image',
        label: 'Thumbnail',
        description: 'Leave empty for no thumbnail update',
        error: (value: any) =>
          (value.file &&
            ((value.file.size > 1024 * 1024 && 'Image size must be under 1MB') ||
              (value.file.type !== 'image/jpeg' && 'Image format must be JPEG') ||
              undefined)) ||
          undefined,
      },
    ],
    changes: {
      category: (props, fields) => {
        const category = props['category'].find((post: any) => post.value === fields['category'])
        if (!category) return { error: 'No category found' }
        return {
          title: category.title,
          description: category.description,
          refresh: true,
        }
      },
    },
    commands: [
      {
        id: 'update',
        label: 'Update',
        callback: async (_, fields) => {
          const formData = new FormData()
          for (const id in fields) {
            switch (id) {
              case 'image':
                if (fields[id]) formData.append(id, fields[id])
                break
              default:
                formData.append(id, fields[id])
                break
            }
          }
          const res = await fetch('/api/edit_category', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
      {
        id: 'enable',
        label: 'Enable',
        valid: (props, fields) => !props['category'].find((category: any) => category.id === fields['category'])?.live,
        callback: async (_, fields) => {
          const formData = new FormData()
          formData.append('category', fields['category'])
          formData.append('live', 'true')
          const res = await fetch('/api/live_category', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
      {
        id: 'disable',
        label: 'Disable',
        valid: (props, fields) => props['category'].find((category: any) => category.id === fields['category'])?.live,
        callback: async (_, fields) => {
          const formData = new FormData()
          formData.append('category', fields['category'])
          formData.append('live', 'false')
          const res = await fetch('/api/live_category', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
    ],
  },
]

const userActions: Action[] = [
  {
    id: 'edit_user',
    name: 'Update User',
    load: async () => {
      const res = await fetch('/api/user', {
        method: 'POST',
      })
      if (!res.ok) {
        const text = await res.text()
        return { error: text }
      }
      const { profile } = await res.json()
      return {
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        image: '',
      }
    },
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name' },
      { id: 'last_name', type: 'text', label: 'Last Name' },
      { id: 'bio', type: 'textarea', label: 'Bio' },
      {
        id: 'image',
        type: 'image',
        label: 'Picture',
        description: 'Under 1MB JPEG, better be 480x480 px',
        error: (value: any) =>
          (value.file &&
            ((value.file.size > 1024 * 1024 && 'Image size must be under 1MB') ||
              (value.file.type !== 'image/jpeg' && 'Image format must be JPEG') ||
              undefined)) ||
          undefined,
      },
    ],
    changes: {},
    commands: [
      {
        id: 'update',
        label: 'Update',
        callback: async (_, fields) => {
          const formData = new FormData()
          for (const id in fields) {
            switch (id) {
              case 'image':
                if (fields[id]) formData.append(id, fields[id])
                break
              default:
                formData.append(id, fields[id])
                break
            }
          }
          const res = await fetch('/api/edit_user', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) {
            const text = await res.text()
            return text
          }
          return undefined
        },
      },
    ],
  },
]

export const actions: { [name: string]: Action[] } = {
  owner: [...authorActions, ...managerActions, ...userActions],
  manager: [...authorActions, ...managerActions, ...userActions],
  author: [...authorActions, ...managerActions, ...userActions],
}

export default actions
