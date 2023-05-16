import { Open_Sans, Roboto } from 'next/font/google'
import { Content, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import TextAlign from '@/components/tiptap/TextAlign'
import TextDirection from '@/components/tiptap/TextDirection'
import TipImage from '@/components/tiptap/Image'
import classNames from 'classnames'
import styles from '@/components/tiptap/tiptap.module.css'

const opensans = Open_Sans({
  subsets: ['latin'],
  weight: '600',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export const getEditor = (content: Content) =>
  new Editor({
    autofocus: false,
    editable: true,
    injectCSS: false,
    editorProps: {
      attributes: {
        class: classNames(styles.content, roboto.className),
      },
      scrollMargin: 20,
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
          HTMLAttributes: { class: opensans.className },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      TextDirection.configure({
        types: ['heading', 'paragraph', 'bulletList', 'orderedList', 'listItem'],
        defaultDirection: 'ltr',
      }),
      Typography.configure({
        oneHalf: false,
        oneQuarter: false,
        threeQuarters: false,
        copyright: false,
        trademark: false,
        registeredTrademark: false,
        servicemark: false,
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        linkOnPaste: true,
      }),
      TipImage,
    ],
    content,
  })

export const setContent = (editor: Editor, content: Content) => editor.commands.setContent(content)
export const getContent = (editor: Editor) => editor.getJSON()

export default getEditor
