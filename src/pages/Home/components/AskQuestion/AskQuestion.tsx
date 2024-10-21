import { EditorProvider, JSONContent, ReactNodeViewRenderer } from '@tiptap/react'
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
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MultipleSelector, { Option as MultiSelectItem } from '@/components/ui/multi-select'
import { Input } from '@/components/ui/input'

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
  const [editorContent, setEditorContent] = useState<JSONContent>({})
  const contentErrorRef = useRef<HTMLParagraphElement>(null)
  const [questionTitle, setQuestionTitle] = useState<string>('')
  const titleRef = useRef<HTMLInputElement>(null)
  const titleErrorRef = useRef<HTMLParagraphElement>(null)

  const handleSubmitPost = () => {
    let isValid = true
    if (titleErrorRef.current && !questionTitle) {
      titleRef.current?.focus()
      titleErrorRef.current.innerText = t('question.title.required')
      titleErrorRef.current.classList.add('text-red-500')
      titleErrorRef.current.classList.remove('text-gray-500')
      isValid = false
    }

    if (
      contentErrorRef.current &&
      (editorContent.content ?? []).reduce((acc, curr) => {
        let l = acc
        curr.content?.forEach((c) => {
          l += c.text?.length ?? 0
        })
        return l
      }, 0) < 20
    ) {
      contentErrorRef.current.innerText = t('question.problem.required')
      contentErrorRef.current.classList.add('text-red-500')
      contentErrorRef.current.classList.remove('text-gray-500')
      isValid = false
    }

    console.log(isValid)

    if (isValid) {
      console.log('Title:', questionTitle)
      console.log('Tags:', selectedTags)
      console.log('Content:', editorContent)
    }
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
        <div className='md:flex justify-between items-center block gap-3'>
          <div className='md:w-1/2' ref={titleRef}>
            <p className='font-semibold'>{t('question.title')}</p>
            <Input
              type='text'
              placeholder={t('question.title.placeholder')}
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
            />
            <p className='text-sm text-gray-500' ref={titleErrorRef}>
              {t('question.title.description')}
            </p>
          </div>
          <div className='md:w-1/2'>
            <p className='font-semibold'>{t('question.tag')}</p>
            <MultipleSelector
              onChange={(tags) => setSelectedTags(tags)}
              maxSelected={5}
              defaultOptions={OPTIONS}
              placeholder={t('question.tag.placeholder')}
              emptyIndicator={
                <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>{t('no-data-found')}</p>
              }
            />
            <p className='text-sm text-gray-500'>{t('question.tag.description')}</p>
          </div>
        </div>
        <div>
          <p className='font-semibold'>{t('question.problem')}</p>
          <p className='text-sm text-gray-500' ref={contentErrorRef}>
            {t('question.problem.description')}
          </p>
          <EditorProvider
            extensions={extensions}
            editable={!showPreview}
            slotBefore={showPreview ? '' : <EditorToolbar />}
            onUpdate={(e) => setEditorContent(e.editor.getJSON())}
            editorProps={{
              attributes: {
                class: classNames(
                  'rounded-b-md outline-none p-2 max-h-96 min-h-48 overflow-auto dark:bg-dark-secondary',
                  {
                    'preview-mode': showPreview,
                    'border-2 border-black': !showPreview
                  }
                ),
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
