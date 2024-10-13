import './styles.scss'
import { useContext, useEffect, useRef, useState } from 'react'
import { EditorContent } from '@tiptap/react'
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
  Table,
  Undo,
  Redo,
  Image
} from 'lucide-react'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { TiptapContext } from '@/contexts/tiptap.context'

const TableMenu = ({ editor }: any) => [
  {
    id: 1,
    name: 'Insert Table',
    action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  },
  {
    id: 2,
    name: 'Add Column Before',
    action: () => editor.chain().focus().addColumnBefore().run()
  },
  {
    id: 3,
    name: 'Add Column After',
    action: () => editor.chain().focus().addColumnAfter().run()
  },
  {
    id: 4,
    name: 'Delete Column',
    action: () => editor.chain().focus().deleteColumn().run()
  },
  {
    id: 5,
    name: 'Add Row Before',
    action: () => editor.chain().focus().addRowBefore().run()
  },
  {
    id: 6,
    name: 'Add Row After',
    action: () => editor.chain().focus().addRowAfter().run()
  },
  {
    id: 7,
    name: 'Delete Row',
    action: () => editor.chain().focus().deleteRow().run()
  },
  {
    id: 8,
    name: 'Delete Table',
    action: () => editor.chain().focus().deleteTable().run()
  },
  {
    id: 9,
    name: 'Merge Cells',
    action: () => editor.chain().focus().mergeCells().run()
  },
  {
    id: 11,
    name: 'Toggle Header Column',
    action: () => editor.chain().focus().toggleHeaderColumn().run()
  },
  {
    id: 12,
    name: 'Toggle Header Row',
    action: () => editor.chain().focus().toggleHeaderRow().run()
  },
  {
    id: 13,
    name: 'Toggle Header Cell',
    action: () => editor.chain().focus().toggleHeaderCell().run()
  },
  {
    id: 14,
    name: 'Merge Or Split',
    action: () => editor.chain().focus().mergeOrSplit().run()
  },
  {
    id: 15,
    name: 'Set Cell Attribute',
    action: () => editor.chain().focus().setCellAttribute('colspan', 2).run()
  }
]

const MenuBarIcon = ({ editor }: any) => [
  {
    id: 1,
    name: 'bold',
    icon: Bold,
    onClick: () => editor.chain().focus().toggleBold().run(),
    disable: !editor.can().chain().focus().toggleBold().run(),
    isActive: editor.isActive('bold') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 2,
    name: 'italic',
    icon: Italic,
    onClick: () => editor.chain().focus().toggleItalic().run(),
    disable: !editor.can().chain().focus().toggleItalic().run(),
    isActive: editor.isActive('italic') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 21,
    name: 'underline',
    icon: Underline,
    onClick: () => editor.chain().focus().toggleUnderline().run(),
    disable: false,
    isActive: editor.isActive('underline') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 3,
    name: 'strike',
    icon: Strikethrough,
    onClick: () => editor.chain().focus().toggleStrike().run(),
    disable: !editor.can().chain().focus().toggleStrike().run(),
    isActive: editor.isActive('strike') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 4,
    name: 'code',
    icon: Code,
    onClick: () => editor.chain().focus().toggleCode().run(),
    disable: !editor.can().chain().focus().toggleCode().run(),
    isActive: editor.isActive('code') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 5,
    name: 'heading1',
    icon: Heading1,
    onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 1 }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 6,
    name: 'heading2',
    icon: Heading2,
    onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 2 }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 13,
    name: 'heading3',
    icon: Heading3,
    onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 3 }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 14,
    name: 'heading4',
    icon: Heading4,
    onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 4 }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 15,
    name: 'heading5',
    icon: Heading5,
    onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 5 }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 7,
    name: 'paragraph',
    icon: Pilcrow,
    onClick: () => editor.chain().focus().setParagraph().run(),
    disable: false,
    isActive: editor.isActive('paragraph') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 8,
    name: 'bullet list',
    icon: List,
    onClick: () => editor.chain().focus().toggleBulletList().run(),
    disable: false,
    isActive: editor.isActive('bulletList') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 9,
    name: 'ordered list',
    icon: ListOrdered,
    onClick: () => editor.chain().focus().toggleOrderedList().run(),
    disable: false,
    isActive: editor.isActive('orderedList') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 16,
    name: 'align left',
    icon: AlignLeft,
    onClick: () => editor.chain().focus().setTextAlign('left').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'left' }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 17,
    name: 'align center',
    icon: AlignCenter,
    onClick: () => editor.chain().focus().setTextAlign('center').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'center' }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 18,
    name: 'align right',
    icon: AlignRight,
    onClick: () => editor.chain().focus().setTextAlign('right').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'right' }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 19,
    name: 'align justify',
    icon: AlignJustify,
    onClick: () => editor.chain().focus().setTextAlign('justify').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'justify' }) ? 'text-green-700' : '',
    select: false
  },
  {
    id: 20,
    name: 'highlight',
    icon: Highlighter,
    onClick: () => editor.chain().focus().toggleHighlight().run(),
    disable: false,
    isActive: editor.isActive('highlight') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 10,
    name: 'code block',
    icon: FileCode,
    onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    disable: false,
    isActive: editor.isActive('codeBlock') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 11,
    name: 'blockquote',
    icon: Quote,
    onClick: () => editor.chain().focus().toggleBlockquote().run(),
    disable: false,
    isActive: editor.isActive('blockquote') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 12,
    name: 'table',
    icon: Table,
    onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    disable: false,
    isActive: editor.isActive('table') ? 'text-green-700' : '',
    select: true
  },
  {
    id: 30,
    name: 'undo',
    icon: Undo,
    onClick: () => editor.chain().focus().undo().run(),
    disable: !editor.can().undo(),
    isActive: editor.isActive('table') ? 'text-green-700' : '',
    select: false
  },
  {
    id: 31,
    name: 'redo',
    icon: Redo,
    onClick: () => editor.chain().focus().redo().run(),
    disable: !editor.can().redo(),
    isActive: editor.isActive('table') ? 'text-green-700' : '',
    select: false
  }
]

function MenuBar({ setImageURL }: any) {
  const { editor } = useContext(TiptapContext)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }
  const MenuBarIconValue = MenuBarIcon({ editor })

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
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
    <div className='flex items-center justify-center flex-wrap gap-1 bg-black p-2 text-white w-full'>
      {MenuBarIconValue.map((item) =>
        item.select ? (
          <Menubar className='bg-transparent border-none' key={item.id}>
            <MenubarMenu>
              <MenubarTrigger className='mr-1 p-0' disabled={item.disable}>
                <div
                  key={item.id}
                  // onClick={item.onClick}
                  className={`${item.disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <item.icon />
                </div>
              </MenubarTrigger>
              <MenubarContent>
                {TableMenu({ editor }).map((menuItem) => (
                  <MenubarItem key={menuItem.id} onClick={menuItem.action}>
                    {menuItem.name}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ) : (
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
        )
      )}
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

export default function Tiptap() {
  const { editor } = useContext(TiptapContext)
  const [imageURL, setImageURL] = useState<string | null>(null)

  useEffect(() => {
    if (editor && imageURL) {
      editor.commands.setImage({
        src: imageURL
      })
    }
  }, [imageURL])

  return (
    <div>
      <MenuBar editor={editor} setImageURL={setImageURL} />
      <EditorContent
        className='w-full overflow-auto p-3 m-auto bg-background-light dark:bg-background-dark'
        editor={editor}
      />
    </div>
  )
}
