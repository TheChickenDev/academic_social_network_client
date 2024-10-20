import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Pilcrow,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  FileCode,
  Quote,
  Undo,
  Redo,
  Image
} from 'lucide-react'
import { Editor } from '@tiptap/core'
import { useCurrentEditor } from '@tiptap/react'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

const ToolbarItems = ({ editor }: { editor: Editor | null }) => [
  {
    id: 1,
    name: 'bold',
    icon: Bold,
    onClick: () => editor?.chain().focus().toggleBold().run(),
    disable: !editor?.can().chain().focus().toggleBold().run(),
    isActive: editor?.isActive('bold') ? 'text-green-700' : ''
  },
  {
    id: 2,
    name: 'italic',
    icon: Italic,
    onClick: () => editor?.chain().focus().toggleItalic().run(),
    disable: !editor?.can().chain().focus().toggleItalic().run(),
    isActive: editor?.isActive('italic') ? 'text-green-700' : ''
  },
  {
    id: 3,
    name: 'underline',
    icon: Underline,
    onClick: () => editor?.chain().focus().toggleUnderline().run(),
    disable: false,
    isActive: editor?.isActive('underline') ? 'text-green-700' : ''
  },
  {
    id: 4,
    name: 'strike',
    icon: Strikethrough,
    onClick: () => editor?.chain().focus().toggleStrike().run(),
    disable: !editor?.can().chain().focus().toggleStrike().run(),
    isActive: editor?.isActive('strike') ? 'text-green-700' : ''
  },
  {
    id: 5,
    name: 'code',
    icon: Code,
    onClick: () => editor?.chain().focus().toggleCode().run(),
    disable: !editor?.can().chain().focus().toggleCode().run(),
    isActive: editor?.isActive('code') ? 'text-green-700' : ''
  },
  {
    id: 6,
    name: 'heading1',
    icon: Heading1,
    onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    disable: false,
    isActive: editor?.isActive('heading', { level: 1 }) ? 'text-green-700' : ''
  },
  {
    id: 7,
    name: 'heading2',
    icon: Heading2,
    onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    disable: false,
    isActive: editor?.isActive('heading', { level: 2 }) ? 'text-green-700' : ''
  },
  {
    id: 8,
    name: 'heading3',
    icon: Heading3,
    onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    disable: false,
    isActive: editor?.isActive('heading', { level: 3 }) ? 'text-green-700' : ''
  },
  {
    id: 9,
    name: 'heading4',
    icon: Heading4,
    onClick: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
    disable: false,
    isActive: editor?.isActive('heading', { level: 4 }) ? 'text-green-700' : ''
  },
  {
    id: 10,
    name: 'heading5',
    icon: Heading5,
    onClick: () => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
    disable: false,
    isActive: editor?.isActive('heading', { level: 5 }) ? 'text-green-700' : ''
  },
  {
    id: 11,
    name: 'paragraph',
    icon: Pilcrow,
    onClick: () => editor?.chain().focus().setParagraph().run(),
    disable: false,
    isActive: editor?.isActive('paragraph') ? 'text-green-700' : ''
  },
  {
    id: 12,
    name: 'bullet list',
    icon: List,
    onClick: () => editor?.chain().focus().toggleBulletList().run(),
    disable: false,
    isActive: editor?.isActive('bulletList') ? 'text-green-700' : ''
  },
  {
    id: 13,
    name: 'ordered list',
    icon: ListOrdered,
    onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    disable: false,
    isActive: editor?.isActive('orderedList') ? 'text-green-700' : ''
  },
  {
    id: 14,
    name: 'align left',
    icon: AlignLeft,
    onClick: () => editor?.chain().focus().setTextAlign('left').run(),
    disable: false,
    isActive: editor?.isActive({ textAlign: 'left' }) ? 'text-green-700' : ''
  },
  {
    id: 15,
    name: 'align center',
    icon: AlignCenter,
    onClick: () => editor?.chain().focus().setTextAlign('center').run(),
    disable: false,
    isActive: editor?.isActive({ textAlign: 'center' }) ? 'text-green-700' : ''
  },
  {
    id: 16,
    name: 'align right',
    icon: AlignRight,
    onClick: () => editor?.chain().focus().setTextAlign('right').run(),
    disable: false,
    isActive: editor?.isActive({ textAlign: 'right' }) ? 'text-green-700' : ''
  },
  {
    id: 17,
    name: 'align justify',
    icon: AlignJustify,
    onClick: () => editor?.chain().focus().setTextAlign('justify').run(),
    disable: false,
    isActive: editor?.isActive({ textAlign: 'justify' }) ? 'text-green-700' : ''
  },
  {
    id: 18,
    name: 'highlight',
    icon: Highlighter,
    onClick: () => editor?.chain().focus().toggleHighlight().run(),
    disable: false,
    isActive: editor?.isActive('highlight') ? 'text-green-700' : ''
  },
  {
    id: 19,
    name: 'code snippet',
    icon: FileCode,
    onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
    disable: false,
    isActive: editor?.isActive('codeBlock') ? 'text-green-700' : ''
  },
  {
    id: 20,
    name: 'blockquote',
    icon: Quote,
    onClick: () => editor?.chain().focus().toggleBlockquote().run(),
    disable: false,
    isActive: editor?.isActive('blockquote') ? 'text-green-700' : ''
  },
  {
    id: 21,
    name: 'undo',
    icon: Undo,
    onClick: () => editor?.chain().focus().undo().run(),
    disable: !editor?.can().undo(),
    isActive: editor?.isActive('table') ? 'text-green-700' : ''
  },
  {
    id: 22,
    name: 'redo',
    icon: Redo,
    onClick: () => editor?.chain().focus().redo().run(),
    disable: !editor?.can().redo(),
    isActive: editor?.isActive('table') ? 'text-green-700' : ''
  }
]

function EditorToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const { editor } = useCurrentEditor()

  useEffect(() => {
    if (editor && imageURL) {
      editor?.commands.setImage({
        src: imageURL
      })
    }
  }, [imageURL])

  const MenuBarIconValue = ToolbarItems({ editor })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const file = files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageURL(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='flex items-center justify-around flex-wrap gap-1 rounded-t-md bg-black p-2 text-white w-full'>
      <input
        type='color'
        onInput={(event: any) => editor?.chain().focus().setColor(event.target.value).run()}
        value={editor?.getAttributes('textStyle').color || '#000000'}
        className='rounded-full w-8 h-8'
      />
      {MenuBarIconValue.map((item) => (
        <div className='flex items-center h-full gap-1' key={item.id}>
          <button
            onClick={item.onClick}
            disabled={item.disable}
            className={`${
              item.disable ? 'cursor-not-allowed p-1' : 'cursor-pointer select:bg-gray-500 select:rounded-lg p-1'
            } ${item.isActive ? item.isActive : ''}`}
          >
            <item.icon />
          </button>
        </div>
      ))}
      <div className='cursor-pointer select:bg-gray-500 select:rounded-lg p-1'>
        <input
          type='file'
          accept='image/jpeg, image/png'
          onChange={handleImageChange}
          ref={fileInputRef}
          className='hidden'
        />
        <Image onClick={handleIconClick} />
      </div>
    </div>
  )
}

export default React.memo(EditorToolbar)
