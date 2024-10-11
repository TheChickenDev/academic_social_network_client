import React, { useState, useRef } from 'react'
import CodeSnippet from '@/components/CodeSnippet' // Adjust the import path as necessary

export default function AskQuestion() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const insertCodeTemplate = () => {
    const codeTemplate = '```language\ncode\n```'
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current
      const newText = input.slice(0, selectionStart) + '\n' + codeTemplate + '\n' + input.slice(selectionEnd)
      setInput(newText)
      // Move cursor to the end of the inserted template
      setTimeout(() => {
        textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd =
          selectionStart + codeTemplate.length + 2
        textareaRef.current!.focus()
      }, 0)
    }
  }

  const insertLinkTemplate = () => {
    const linkTemplate = '[text](url)'
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current
      const newText = input.slice(0, selectionStart) + linkTemplate + input.slice(selectionEnd)
      setInput(newText)
      // Move cursor to the end of the inserted template
      setTimeout(() => {
        textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = selectionStart + linkTemplate.length
        textareaRef.current!.focus()
      }, 0)
    }
  }

  const renderContent = () => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
    const linkBlockRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = input.split(/(```\w*\n[\s\S]*?```|\[[^\]]+\]\([^)]+\))/g)

    return parts.map((part, index) => {
      if (codeBlockRegex.test(part)) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/) ?? ''
        const language = match[1].trim()
        const code = match[2].trim()
        return <CodeSnippet key={index} codeBlock={code} language={language} copyable={false} />
      } else if (linkBlockRegex.test(part)) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (match) {
          const [, text, url] = match
          return (
            <a key={index} href={url} className='text-blue-500 underline'>
              {text}
            </a>
          )
        }
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className='p-4'>
      <div className='mb-2'>
        <button onClick={insertCodeTemplate} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Code
        </button>
        <button
          onClick={insertLinkTemplate}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 ml-2'
        >
          Link
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        placeholder='Type your text or code here'
        rows={10}
        className='w-full p-2 border rounded mb-4'
        style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
      />
      <div>{renderContent()}</div>
    </div>
  )
}
