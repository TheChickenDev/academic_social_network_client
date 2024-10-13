import { createContext, ReactNode } from 'react'
import { useEditor } from '@tiptap/react'
import TextStyle, { TextStyleOptions } from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

type TiptapContextProviderProps = {
  children: ReactNode
}

type TiptapContextType = {
  editor: ReturnType<typeof useEditor> | null
}

const TiptapContext = createContext<TiptapContextType>({
  editor: null
})

function TiptapProvider({ children }: TiptapContextProviderProps) {
  const editor = useEditor({
    extensions: [
      // Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] } as Partial<TextStyleOptions>),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Underline.configure(),
      // CodeBlockLowlight.configure({
      //   lowlight
      // }),
      Highlight,
      // Document,
      // Paragraph,
      // Text,
      // Gapcursor,
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    editorProps: {
      attributes: {
        class: 'm-2 focus:outline-none'
      }
    },
    content: `<p>Hello World! 🌎️</p><pre><code>ul {
    list-style: disc;
  }
  ol {
    list-style: decimal;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.17em;
  }
  h4 {
    font-size: 1em;
  }
  h5 {
    font-size: 0.83em;
  }
  h6 {
    font-size: 0.67em;
  }</code></pre>`
  })

  return (
    <TiptapContext.Provider
      value={{
        editor
      }}
    >
      {children}
    </TiptapContext.Provider>
  )
}

export { TiptapProvider, TiptapContext }
