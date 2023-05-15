export declare type Field = {
  id: string
  type: string
  label: string
}

export declare type Command = {
  id: string
  label: string
  callback: (fields: Field[]) => void
}

export declare type Action = {
  id: string
  name: string
  fields: Field[]
  commands: Command[]
}

const authorActions: Action[] = [
  {
    id: 'create_post',
    name: 'Create Post',
    fields: [
      { id: 'category', type: 'category', label: 'Category' },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'text', label: 'Description' },
      { id: 'read_time', type: 'number', label: 'Read Minutes' },
      { id: 'content', type: 'tiptap', label: 'Content' },
    ],
    commands: [
      { id: 'save', label: 'Save', callback: () => {} },
      { id: 'publish', label: 'Publish', callback: () => {} },
    ],
  },
  {
    id: 'edit_post',
    name: 'Edit Post',
    fields: [
      { id: 'post', type: 'post', label: 'Post' },
      { id: 'title', type: 'text', label: 'Title' },
      { id: 'description', type: 'text', label: 'Description' },
      { id: 'read_time', type: 'number', label: 'Read Minutes' },
      { id: 'content', type: 'tiptap', label: 'Content' },
    ],
    commands: [{ id: 'update', label: 'Update', callback: () => {} }],
  },
]

export const actions: { [name: string]: Action[] } = {
  owner: [...authorActions],
  manager: [...authorActions],
  author: authorActions,
}

export default actions
