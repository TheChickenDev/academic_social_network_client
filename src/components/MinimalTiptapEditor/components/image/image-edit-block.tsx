import * as React from 'react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'
import { blobUrlToBase64 } from '../../utils'

interface ImageEditBlockProps {
  editor: Editor
  close: () => void
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({ editor, close }) => {
  const { t } = useTranslation()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [link, setLink] = React.useState('')

  const handleClick = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return

      const insertImages = async () => {
        const contentBucket = []
        const filesArray = Array.from(files)

        for (const file of filesArray) {
          contentBucket.push({ src: file })
        }

        editor.commands.setImages(contentBucket)
      }

      await insertImages()
      close()
    },
    [editor, close]
  )

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (link) {
        blobUrlToBase64(link).then((base64) => {
          editor.commands.setImages([{ src: base64 }])
        })
        close()
      }
    },
    [editor, link, close]
  )

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-1'>
        <Label htmlFor='image-link'>{t('minimalEditor.attachAnImageLink')}</Label>
        <div className='flex'>
          <Input
            id='image-link'
            type='url'
            required
            placeholder='https://example.com'
            value={link}
            className='grow'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
          />
          <Button type='submit' className='ml-2'>
            {t('action.submit')}
          </Button>
        </div>
      </div>
      <Button type='button' className='w-full' onClick={handleClick}>
        {t('minimalEditor.uploadFromComputer')}
      </Button>
      <input type='file' accept='image/*' ref={fileInputRef} multiple className='hidden' onChange={handleFile} />
    </form>
  )
}

export default ImageEditBlock
