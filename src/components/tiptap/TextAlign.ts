import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

const TextAlignPlugin = ({ types }: { types: string[] }) => {
  let init = false
  return new Plugin({
    key: new PluginKey('textAlign'),
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
          if (parent?.type.name === 'listItem') {
            if (node.attrs.textAlign === null) return
            tr.setNodeAttribute(pos, 'textAlign', null)
            modified = true
          } else {
            if (node.attrs.textAlign !== null) return
            tr.setNodeAttribute(pos, 'textAlign', node.attrs.textDirection === 'ltr' ? 'left' : 'right')
            modified = true
          }
        }
      })

      return modified ? tr : null
    },
  })
}

export interface TextAlignOptions {
  types: string[]
  alignments: string[]
  defaultAlignment: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      /**
       * Set the text align attribute
       */
      setTextAlign: (alignment: string) => ReturnType
      /**
       * Unset the text align attribute
       */
      unsetTextAlign: () => ReturnType
    }
  }
}

export const TextAlign = Extension.create<TextAlignOptions>({
  name: 'textAlign',

  addOptions() {
    return {
      types: [],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: element =>
              element.style.textAlign || this.options.defaultAlignment,
            renderHTML: attributes => {
              return attributes.textAlign
                ? { style: `text-align: ${attributes.textAlign}` }
                : {}
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTextAlign:
        (alignment: string) =>
        ({ commands }) => {
          if (!this.options.alignments.includes(alignment)) {
            return false
          }

          return this.options.types.every(type =>
            commands.updateAttributes(type, { textAlign: alignment })
          )
        },

      unsetTextAlign:
        () =>
        ({ commands }) => {
          return this.options.types.every(type =>
            commands.resetAttributes(type, 'textAlign')
          )
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
      'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
    }
  },

  addProseMirrorPlugins() {
    return [
      TextAlignPlugin({
        types: this.options.types,
      }),
    ]
  },
})

export default TextAlign
