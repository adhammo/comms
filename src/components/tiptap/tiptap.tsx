import React, { useEffect } from 'react'
import Image from 'next/image'
import { Open_Sans, Roboto } from 'next/font/google'
import { FloatingMenu, EditorContent, EditorContentProps, JSONContent, useEditor } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import TextAlign from '@/components/tiptap/TextAlign'
import TextDirection from '@/components/tiptap/TextDirection'
import TipImage from '@tiptap/extension-image'
import Select from '@/components/select/select'
import Enter from '../enter/enter'
import styles from './tiptap.module.css'
import classNames from 'classnames'

const opensans = Open_Sans({
  subsets: ['latin'],
  weight: '600',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

const MenuBar = ({ editor }: EditorContentProps) => {
  if (!editor) {
    return null
  }

  const [headingSrc, headingAlt] = (editor.isActive('heading', { level: 2 }) && ['h1', 'Heading']) ||
    (editor.isActive('heading', { level: 3 }) && ['h2', 'SubHeading']) ||
    (editor.isActive('paragraph') && ['paragraph', 'Paragraph']) || ['paragraph', 'Paragraph']

  const [alignmentSrc, alignmentAlt] = (editor.isActive({ textAlign: 'left' }) && ['align_left', 'Align Left']) ||
    (editor.isActive({ textAlign: 'center' }) && ['align_center', 'Align Center']) ||
    (editor.isActive({ textAlign: 'right' }) && ['align_right', 'Align Right']) ||
    (editor.isActive({ textAlign: 'justify' }) && ['align_justify', 'Align Justify']) || ['align_left', 'Align Left']

  const [directionSrc, directionAlt] = (editor.isActive({ textDirection: 'ltr' }) && ['ltr', 'Left to Right']) ||
    (editor.isActive({ textDirection: 'rtl' }) && ['rtl', 'Right to Left']) || ['ltr', 'Left to Right']

  return (
    <div className={styles.menu}>
      <div className={styles.headings}>
        <Select
          className={styles.menuButton}
          header={{
            title: 'Set Heading',
            iconSrc: `/icons/editor/${headingSrc}.svg`,
            iconAlt: headingAlt,
          }}
          options={[
            {
              title: 'Heading',
              element: <Image src="/icons/editor/h1.svg" alt="Heading" width={20} height={20} />,
              callback: () => {
                let align = editor.state.selection.$anchor.parent.attrs.textAlign
                const direction = editor.state.selection.$anchor.parent.attrs.textDirection
                if (!align) align = direction === 'rtl' ? 'right' : 'left'
                editor.chain().focus().setHeading({ level: 2 }).setTextDirection(direction).setTextAlign(align).run()
              },
              active: editor.isActive('heading', { level: 2 }),
            },
            {
              title: 'SubHeading',
              element: <Image src="/icons/editor/h2.svg" alt="SubHeading" width={20} height={20} />,
              callback: () => {
                let align = editor.state.selection.$anchor.parent.attrs.textAlign
                const direction = editor.state.selection.$anchor.parent.attrs.textDirection
                if (!align) align = direction === 'rtl' ? 'right' : 'left'
                editor.chain().focus().setHeading({ level: 3 }).setTextDirection(direction).setTextAlign(align).run()
              },
              active: editor.isActive('heading', { level: 3 }),
            },
            {
              title: 'Paragraph',
              element: <Image src="/icons/editor/paragraph.svg" alt="Paragraph" width={20} height={20} />,
              callback: () => {
                let align = editor.state.selection.$anchor.parent.attrs.textAlign
                const direction = editor.state.selection.$anchor.parent.attrs.textDirection
                if (!align) align = direction === 'rtl' ? 'right' : 'left'
                editor.chain().focus().setParagraph().setTextDirection(direction).setTextAlign(align).run()
              },
              active: editor.isActive('paragraph'),
            },
          ]}
          onShow={() => editor.chain().focus()}
        />
      </div>
      <div className={styles.marks}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('bold'),
          })}
          title="Toggle Bold"
        >
          <Image src="/icons/editor/bold.svg" alt="Toggle Bold" width={20} height={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('italic'),
          })}
          title="Toggle Italic"
        >
          <Image src="/icons/editor/italic.svg" alt="Toggle Italic" width={20} height={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('underline'),
          })}
          title="Toggle Underline"
        >
          <Image src="/icons/editor/underline.svg" alt="Toggle Underline" width={20} height={20} priority />
        </button>
      </div>
      <div className={styles.alignment}>
        <Select
          className={styles.menuButton}
          header={{
            title: 'Set Text Alignment',
            iconSrc: `/icons/editor/${alignmentSrc}.svg`,
            iconAlt: alignmentAlt,
          }}
          options={[
            {
              title: 'Align Left',
              element: <Image src="/icons/editor/align_left.svg" alt="Align Left" width={20} height={20} />,
              callback: () => editor.chain().focus().setTextAlign('left').run(),
              active: editor.isActive({ textAlign: 'left' }),
            },
            {
              title: 'Align Center',
              element: <Image src="/icons/editor/align_center.svg" alt="Align Center" width={20} height={20} />,
              callback: () => editor.chain().focus().setTextAlign('center').run(),
              active: editor.isActive({ textAlign: 'center' }),
            },
            {
              title: 'Align Right',
              element: <Image src="/icons/editor/align_right.svg" alt="Align Right" width={20} height={20} />,
              callback: () => editor.chain().focus().setTextAlign('right').run(),
              active: editor.isActive({ textAlign: 'right' }),
            },
            {
              title: 'Align Justify',
              element: <Image src="/icons/editor/align_justify.svg" alt="Align Justify" width={20} height={20} />,
              callback: () => editor.chain().focus().setTextAlign('justify').run(),
              active: editor.isActive({ textAlign: 'justify' }),
            },
          ]}
          onShow={() => editor.chain().focus()}
        />
      </div>
      <div className={styles.direction}>
        <button
          onClick={() => {
            if (directionSrc == 'ltr') editor.chain().focus().setTextDirection('rtl').setTextAlign('right').run()
            else editor.chain().focus().setTextDirection('ltr').setTextAlign('left').run()
          }}
          className={styles.menuButton}
          title="Toggle Text Direction"
        >
          <Image src={`/icons/editor/${directionSrc}.svg`} alt={directionAlt} width={20} height={20} />
        </button>
      </div>
      <div className={styles.lists}>
        <button
          onClick={() => {
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            editor.chain().focus().toggleOrderedList().setTextDirection(direction).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('orderedList'),
          })}
          title="Toggle Ordered List"
        >
          <Image src="/icons/editor/order_list.svg" alt="Toggle Ordered List" width={20} height={20} />
        </button>
        <button
          onClick={() => {
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            editor.chain().focus().toggleBulletList().setTextDirection(direction).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('bulletList'),
          })}
          title="Toggle Bullet list"
        >
          <Image src="/icons/editor/bullet_list.svg" alt="Toggle Bullet List" width={20} height={20} />
        </button>
      </div>
      <div className={styles.extra}>
        <Enter
          className={styles.menuButton}
          header={{ title: 'Link', iconSrc: `/icons/editor/link.svg` }}
          placeholder={'http[s]://'}
          initalValue={editor.getAttributes('link').href ?? ''}
          actions={
            editor.isActive('link')
              ? [
                  {
                    title: 'Relink',
                    default: true,
                    element: <Image src="/icons/editor/check.svg" alt="Check" width={18} height={18} />,
                    callback: value =>
                      editor.chain().focus().extendMarkRange('link').setLink({ href: value, target: '_blank' }).run(),
                  },
                  {
                    title: 'Unlink',
                    element: <Image src="/icons/editor/close.svg" alt="Close" width={18} height={18} />,
                    callback: () => editor.chain().focus().unsetLink().run(),
                  },
                ]
              : [
                  {
                    title: 'Link',
                    default: true,
                    element: <Image src="/icons/editor/check.svg" alt="Link" width={18} height={18} />,
                    callback: value => {
                      const regex = new RegExp(
                        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
                      )
                      if (!editor.state.selection.empty && value.match(regex))
                        editor.chain().focus().extendMarkRange('link').setLink({ href: value, target: '_blank' }).run()
                      else editor.chain().focus()
                    },
                  },
                ]
          }
          onShow={() => editor.chain().focus()}
        />
        <Enter
          className={styles.menuButton}
          header={{ title: 'Image', iconSrc: `/icons/editor/image.svg` }}
          placeholder={'http[s]://'}
          initalValue={editor.getAttributes('image').src ?? ''}
          actions={
            editor.isActive('image')
              ? [
                  {
                    title: 'Update',
                    default: true,
                    element: <Image src="/icons/editor/check.svg" alt="Check" width={18} height={18} />,
                    callback: value => editor.chain().focus().setImage({ src: value }).run(),
                  },
                  {
                    title: 'Remove',
                    element: <Image src="/icons/editor/close.svg" alt="Close" width={18} height={18} />,
                    callback: () => editor.chain().focus().clearNodes().run(),
                  },
                ]
              : [
                  {
                    title: 'Download',
                    default: true,
                    element: <Image src="/icons/editor/check.svg" alt="Link" width={18} height={18} />,
                    callback: value => {
                      const regex = new RegExp(
                        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
                      )
                      if (value.match(regex)) editor.chain().focus().setImage({ src: value }).run()
                      else editor.chain().focus()
                    },
                  },
                ]
          }
          onShow={() => editor.chain().focus()}
        />
      </div>
    </div>
  )
}

const FloatingMenuBar = ({ editor }: EditorContentProps) => {
  if (!editor) {
    return null
  }

  return (
    <FloatingMenu className={styles.float} editor={editor}>
      <div className={styles.headings}>
        <button
          onClick={() => {
            let align = editor.state.selection.$anchor.parent.attrs.textAlign
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            if (!align) align = direction === 'rtl' ? 'right' : 'left'
            editor.chain().focus().setHeading({ level: 2 }).setTextDirection(direction).setTextAlign(align).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('heading', { level: 2 }),
          })}
          title="New Heading"
        >
          <Image src="/icons/editor/h1.svg" alt="New Heading" width={16} height={16} />
        </button>
        <button
          onClick={() => {
            let align = editor.state.selection.$anchor.parent.attrs.textAlign
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            if (!align) align = direction === 'rtl' ? 'right' : 'left'
            editor.chain().focus().setHeading({ level: 3 }).setTextDirection(direction).setTextAlign(align).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('heading', { level: 3 }),
          })}
          title="New SubHeading"
        >
          <Image src="/icons/editor/h2.svg" alt="New SubHeading" width={16} height={16} />
        </button>
        <button
          onClick={() => {
            const align = editor.state.selection.$anchor.parent.attrs.textAlign
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            editor.chain().focus().setParagraph().setTextDirection(direction).setTextAlign(align).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('paragraph'),
          })}
          title="New Paragraph"
        >
          <Image src="/icons/editor/paragraph.svg" alt="New Paragraph" width={16} height={16} />
        </button>
      </div>
      <div className={styles.lists}>
        <button
          onClick={() => {
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            editor.chain().focus().toggleOrderedList().setTextDirection(direction).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('orderedList'),
          })}
          title="New Ordered List"
        >
          <Image src="/icons/editor/order_list.svg" alt="New Ordered List" width={16} height={16} />
        </button>
        <button
          onClick={() => {
            const direction = editor.state.selection.$anchor.parent.attrs.textDirection
            editor.chain().focus().toggleBulletList().setTextDirection(direction).run()
          }}
          className={classNames(styles.menuButton, {
            [styles.active]: editor.isActive('bulletList'),
          })}
          title="New Bullet list"
        >
          <Image src="/icons/editor/bullet_list.svg" alt="New Bullet List" width={16} height={16} />
        </button>
      </div>
    </FloatingMenu>
  )
}

export declare type TiptapProps = { content: JSONContent; setEditor: (editor: Editor) => void }

export const TipTap = ({ content, setEditor }: TiptapProps) => {
  const editor = useEditor({
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
    onCreate: ({ editor: createdEditor }) => setEditor(createdEditor),
  })

  return (
    <div className={styles.tiptap}>
      <MenuBar editor={editor} />
      <FloatingMenuBar editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  )
}

export default TipTap
