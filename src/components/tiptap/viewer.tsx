import React from 'react'
import { Open_Sans, Roboto } from 'next/font/google'
import { EditorContent, useEditor, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import TextAlign from './TextAlign'
import TextDirection from './TextDirection'
import TipImage from '@tiptap/extension-image'
import styles from './tiptap.module.css'

import classNames from 'classnames'

export declare type TipTapProps = {
  content: Content
}

const opensans = Open_Sans({
  subsets: ['latin'],
  weight: '600',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export const Viewer = ({ content }: TipTapProps) => {
  const editor = useEditor({
    autofocus: false,
    editable: false,
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

  if (!editor) {
    return null
  }

  return (
    <>
      <div className={classNames(styles.tiptap, styles.viewer)}>
        <EditorContent className={styles.editor} editor={editor} />
      </div>
    </>
  )
}

export default Viewer
