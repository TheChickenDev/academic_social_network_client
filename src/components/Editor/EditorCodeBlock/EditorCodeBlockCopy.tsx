import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Editor } from '@tiptap/core'
import { Copy, CopyCheck } from 'lucide-react'
import { toast } from 'react-toastify'

function EditorCodeBlockCopy({ editor }: { editor: Editor }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard
      .writeText(editor.getHTML())
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
        toast.success('Code copied to clipboard')
      })
      .catch(() => {
        toast.error('Failed to copy code to clipboard')
      })
  }

  return (
    <Button
      onClick={handleCopy}
      className='absolute top-2 right-6 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700'
    >
      {copied ? <CopyCheck /> : <Copy />}
    </Button>
  )
}

export default React.memo(EditorCodeBlockCopy)
