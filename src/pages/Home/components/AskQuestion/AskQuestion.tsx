import { EditorProvider, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import EditorCodeBlock from '@/components/Editor/EditorCodeBlock'
import EditorToolbar from '@/components/Editor/EditorToolbar'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import './TextEditor.scss'

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false
    },
    codeBlock: false
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(EditorCodeBlock)
    }
  }).configure({
    lowlight: createLowlight(all)
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  }),
  Image.configure({
    inline: true,
    allowBase64: true
  }),
  Underline,
  Highlight
]

export default function AskQuestion({ showPreview }: { showPreview: boolean }) {
  return (
    <div className='border-2 border-black rounded-md overflow-hidden'>
      <EditorProvider
        extensions={extensions}
        editable={!showPreview}
        slotBefore={showPreview ? '' : <EditorToolbar />}
        editorProps={{
          attributes: {
            class: 'focus:outline-none p-2 max-h-96 min-h-48',
            spellCheck: 'false'
          }
        }}
      ></EditorProvider>
    </div>
  )
}
