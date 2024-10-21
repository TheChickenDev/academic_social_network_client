import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Editor } from '@tiptap/core'
import { Copy, CopyCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

function EditorCodeBlockCopy({ editor }: { editor: Editor }) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()
  const handleCopy = () => {
    navigator.clipboard
      .writeText(editor.getHTML())
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
        toast.success(t('code-copied'))
      })
      .catch(() => {
        toast.error(t('code-copied-fail'))
      })
  }

  return (
    <Button
      onClick={handleCopy}
      className='absolute top-0 right-0 bg-blue-500 px-3 text-white rounded hover:bg-blue-700 editor-code-block-copy'
    >
      {copied ? <CopyCheck size={16} className='dark:text-black' /> : <Copy size={16} className='dark:text-black' />}
    </Button>
  )
}

export default React.memo(EditorCodeBlockCopy)
