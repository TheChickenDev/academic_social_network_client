import { Highlight, themes } from 'prism-react-renderer'
import { useState } from 'react'
import { Copy, CopyCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'

interface CodeSnippetProps {
  codeBlock: string
  language: string
  copyable?: boolean
}

export default function CodeSnippet({ codeBlock, language, copyable = true }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeBlock)
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
    <div className='relative'>
      <Highlight theme={themes.nightOwl} code={codeBlock} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{
              ...style,
              overflow: 'auto',
              maxHeight: '520px',
              minHeight: '52px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className='flex max-w-full'>
                <span className='inline-block select-none min-w-8 text-right text-gray-500 mr-2'>{i + 1}</span>
                <div>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} className='break-words' />
                  ))}
                </div>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      {copyable && (
        <Button
          onClick={handleCopy}
          className='absolute top-2 right-6 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700'
        >
          {copied ? <CopyCheck /> : <Copy />}
        </Button>
      )}
    </div>
  )
}
