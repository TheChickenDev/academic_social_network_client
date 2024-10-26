import { EditorProvider, JSONContent } from '@tiptap/react'
import EditorToolbar from '@/components/Editor/EditorToolbar'
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
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MultipleSelector, { Option as MultiSelectItem } from '@/components/ui/multi-select'
import { Input } from '@/components/ui/input'
import { Content } from '@tiptap/react'
import { MinimalTiptapEditor } from '@/components/MinimalTiptapEditor'

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
  const [selectedTags, setSelectedTags] = useState<MultiSelectItem[]>([])
  const [editorContent, setEditorContent] = useState<Content>('')
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

    if (contentErrorRef.current && editorContent) {
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
    <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-background-light dark:bg-dark-primary'>
      <div className='md:flex justify-between items-center block gap-3 pt-24'>
        <div className='md:w-1/2' ref={titleRef}>
          <p className='font-semibold mb-2'>{t('post.title')}</p>
          <Input
            type='text'
            placeholder={t('post.titlePlaceholder')}
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
          />
          <p className='text-sm text-gray-500 mt-2' ref={titleErrorRef}>
            {t('post.titleDescription')}
          </p>
        </div>
        <div className='md:w-1/2'>
          <p className='font-semibold mb-2'>{t('post.tag')}</p>
          <MultipleSelector
            onChange={(tags) => setSelectedTags(tags)}
            maxSelected={5}
            defaultOptions={OPTIONS}
            placeholder={t('post.tagPlaceholder')}
            emptyIndicator={
              <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>{t('no-data-found')}</p>
            }
          />
          <p className='text-sm text-gray-500 mt-2'>{t('post.tagDescription')}</p>
        </div>
      </div>
      <div className='mt-4'>
        <p className='font-semibold'>{t('post.description')}</p>
        <p className='text-sm text-gray-500 mb-1' ref={contentErrorRef}>
          {t('post.descriptionDescription')}
        </p>
        <MinimalTiptapEditor
          value={editorContent}
          onChange={setEditorContent}
          className='w-full'
          editorContentClassName='p-2'
          output='html'
          placeholder={t('post.descriptionPlaceholder')}
          autofocus={false}
          editable={true}
          editorClassName='focus:outline-none'
        />
      </div>
      <div className='flex justify-end gap-2 mt-4'>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{t('action.preview')}</Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>{t('action.preview')}</DialogTitle>
            </DialogHeader>
            <MinimalTiptapEditor
              value={editorContent}
              className='w-full'
              editorContentClassName='p-2'
              output='html'
              placeholder='Type your description here...'
              autofocus={false}
              editable={false}
              editorClassName='focus:outline-none'
            />
            <DialogFooter>
              <DialogClose>{t('action.close')}</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={() => handleSubmitPost()}>{t('action.post')}</Button>
      </div>
    </div>
  )
}
