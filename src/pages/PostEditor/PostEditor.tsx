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
import { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MultipleSelector, { MultipleSelectorRef, Option as MultiSelectItem } from '@/components/ui/multi-select'
import { Input } from '@/components/ui/input'
import { Content, JSONContent } from '@tiptap/react'
import { MinimalTiptapEditor } from '@/components/MinimalTiptapEditor'
import { contentMaxLength, contentMinLength, titleMaxLength, titleMinLength } from '@/constants/post'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/apis/post.api'
import { toast } from 'sonner'
import { AppContext } from '@/contexts/app.context'
import { PostProps } from '@/types/post.type'

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

export default function PostEditor() {
  const { t } = useTranslation()
  const [selectedTags, setSelectedTags] = useState<MultiSelectItem[]>([])
  const [editorContent, setEditorContent] = useState<Content>('')
  const [postTitle, setPostTitle] = useState<string>('')
  const titleRef = useRef<HTMLInputElement>(null)
  const tagsRef = useRef<MultipleSelectorRef>(null)

  const { fullName, avatar, email } = useContext(AppContext)
  const queryClient = useQueryClient()

  const postMutation = useMutation({
    mutationFn: (body: PostProps) => createPost(body)
  })

  const extractText = (node: JSONContent) => {
    let text = ''

    if (node.type === 'text') {
      text += node.text
    }

    if (node.content) {
      node.content.forEach((child) => {
        text += extractText(child)
      })
    }

    return text
  }

  const handleSubmit = () => {
    if (!postTitle || postTitle.length < titleMinLength || postTitle.length > titleMaxLength) {
      titleRef.current?.focus()
      toast.warning(t('post.titleError'))
      return
    }

    if (!selectedTags.length) {
      tagsRef.current?.focus()
      toast.warning(t('post.tagError'))
      return
    }

    const l = extractText(editorContent as JSONContent).length

    if (l < contentMinLength || l > contentMaxLength) {
      toast.warning(t('post.descriptionError'))
      return
    }

    postMutation.mutate(
      {
        title: postTitle,
        tags: selectedTags,
        ownerName: fullName ?? '',
        ownerAvatar: avatar ?? '',
        ownerEmail: email ?? '',
        content: editorContent as JSONContent
      },
      {
        onSuccess: (response) => {
          const status = response.status
          if (status === 201) {
            toast.success(t('post.createSuccessful'))
            queryClient.setQueryData(['posts'], (oldData: InfiniteData<PostProps[], unknown>) => {
              if (!oldData) return
              oldData.pages[0].unshift(response.data.data)
              return {
                ...oldData
              }
            })
          } else toast.error(t('post.createFailed'))
        },
        onError: () => {
          toast.error(t('post.createFailed'))
        }
      }
    )
  }

  return (
    <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-light-primary dark:bg-dark-primary'>
      <div className='md:flex justify-between items-center block gap-3 pt-24'>
        <div className='md:w-1/2'>
          <p className='font-semibold mb-2'>{t('post.title')}</p>
          <Input
            ref={titleRef}
            type='text'
            placeholder={t('post.titlePlaceholder')}
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <p className='text-sm text-gray-500 mt-2'>{t('post.titleDescription')}</p>
        </div>
        <div className='md:w-1/2 md:mt-0 mt-4'>
          <p className='font-semibold mb-2'>{t('post.tag')}</p>
          <MultipleSelector
            ref={tagsRef}
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
        <p className='text-sm text-gray-500 mb-1'>{t('post.descriptionDescription')}</p>
        <MinimalTiptapEditor
          value={editorContent}
          onChange={setEditorContent}
          className='h-auto min-h-48 rounded-md border border-input shadow-sm focus-within:border-primary'
          editorContentClassName='p-2'
          output='json'
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
              output='json'
              placeholder=''
              autofocus={false}
              editable={false}
              editorClassName='focus:outline-none'
            />
            <DialogFooter>
              <DialogClose>{t('action.close')}</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={() => handleSubmit()}>{t('action.post')}</Button>
      </div>
    </div>
  )
}
