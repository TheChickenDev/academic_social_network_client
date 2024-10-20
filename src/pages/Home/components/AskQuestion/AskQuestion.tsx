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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import classNames from 'classnames'
import './TextEditor.scss'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MultipleSelector, { Option as MultiSelectItem } from '@/components/ui/multi-select'

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

const OPTIONS: MultiSelectItem[] = [
  { label: 'nextjs', value: 'Nextjs' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Remix', value: 'remix' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember' },
  { label: 'React', value: 'react' },
  { label: 'Gatsby', value: 'gatsby' },
  { label: 'Astro', value: 'astro' }
]

export default function AskQuestion() {
  const { t } = useTranslation()
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [selectedTags, setSelectedTags] = useState<MultiSelectItem[]>([])
  const [editorContent, setEditorContent] = useState<string>('')

  const handleSubmitPost = () => {
    console.log('selectedTags', selectedTags)
    console.log('editorContent', editorContent)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t('ask-question')}</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('ask-question')}</DialogTitle>
        </DialogHeader>
        <div>
          <MultipleSelector
            onChange={(tags) => setSelectedTags(tags)}
            defaultOptions={OPTIONS}
            placeholder='Select frameworks you like...'
            emptyIndicator={
              <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>no results found.</p>
            }
          />
        </div>
        <div className='border-2 border-black rounded-md overflow-hidden dark:bg-dark-secondary'>
          <EditorProvider
            extensions={extensions}
            editable={!showPreview}
            slotBefore={showPreview ? '' : <EditorToolbar />}
            onUpdate={(e) => setEditorContent(e.editor.getHTML())}
            editorProps={{
              attributes: {
                class: classNames('focus:outline-none p-2 max-h-96 min-h-48 overflow-auto', {
                  'preview-mode': showPreview
                }),
                spellCheck: 'false'
              }
            }}
          ></EditorProvider>
        </div>
        <DialogFooter>
          <div className='w-full flex justify-between items-center gap-2'>
            <DialogClose>{t('cancel')}</DialogClose>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setShowPreview(!showPreview)}>
                {t(showPreview ? 'edit' : 'preview')}
              </Button>
              <Button onClick={() => handleSubmitPost()}>{t('post-question')}</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
