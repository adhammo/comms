import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

const TextDirectionPlugin = ({ types }: { types: string[] }) => {
  let init = false
  return new Plugin({
    key: new PluginKey('textDirection'),
    appendTransaction: (transactions, oldState, newState) => {
      const docChanges = transactions.some(
        transaction => transaction.docChanged
      )

      if (init && !docChanges) return
      init = true

      let modified = false
      const tr = newState.tr

      newState.doc.descendants((node, pos, parent) => {
        if (types.includes(node.type.name)) {
          if (
            parent?.type.name === 'orderedList' ||
            parent?.type.name === 'bulletList' ||
            parent?.type.name === 'listItem'
          ) {
            if (node.attrs.textDirection === parent.attrs.textDirection) return
            tr.setNodeAttribute(pos, 'textDirection', parent.attrs.textDirection)
            modified = true
          }
        }
      })

      return modified ? tr : null
    },
  })
}

export declare type Direction = 'ltr' | 'rtl'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textDirection: {
      /**
       * Set the text direction attribute
       */
      setTextDirection: (direction: Direction) => ReturnType
      /**
       * Unset the text direction attribute
       */
      unsetTextDirection: () => ReturnType
    }
  }
}

export interface TextDirectionOptions {
  types: string[]
  defaultDirection: Direction | null
}

export const TextDirection = Extension.create<TextDirectionOptions>({
  name: 'textDirection',

  addOptions() {
    return {
      types: [],
      defaultDirection: null,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textDirection: {
            default: this.options.defaultDirection,
            parseHTML: element => element.dir || this.options.defaultDirection,
            renderHTML: attributes => {
              return { dir: attributes.textDirection }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTextDirection:
        (direction: Direction) =>
        ({ commands }) => {
          return this.options.types.every(type =>
            commands.updateAttributes(type, { textDirection: direction })
          )
        },

      unsetTextDirection:
        () =>
        ({ commands }) => {
          return this.options.types.every(type =>
            commands.resetAttributes(type, 'textDirection')
          )
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      TextDirectionPlugin({
        types: this.options.types,
      }),
    ]
  },
})

export default TextDirection
