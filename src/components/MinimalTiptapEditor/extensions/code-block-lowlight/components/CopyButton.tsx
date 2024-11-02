import { Button } from '@/components/ui/button'
import { Copy, CopyCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()
  const handleCopy = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
        toast.success('Code copied to clipboard')
        toast.success(t('code-copied'))
      })
      .catch(() => {
        toast.error('Failed to copy code to clipboard')
        toast.error(t('code-copied-fail'))
      })
  }

  return (
    <Button onClick={handleCopy} className='absolute top-0 right-0 bg-blue-500 px-2 py-1 rounded hover:bg-blue-700'>
      {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
    </Button>
  )
}
