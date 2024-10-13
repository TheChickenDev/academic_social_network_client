import { useContext, useState } from 'react'
import CodeSnippet from '@/components/CodeSnippet'
import TextEditor from '@/components/TextEditor'
import { TiptapContext } from '@/contexts/tiptap.context'

export default function AskQuestion() {
  const [showCodeSnippet, setShowCodeSnippet] = useState(false)
  const { editor } = useContext(TiptapContext)

  const extractCodeBlock = () => {
    if (!editor) return ''
    const json = editor.getJSON()
    const codeBlockNode = json?.content?.find((node) => node.type === 'codeBlock')
    return codeBlockNode ? codeBlockNode.content[0] : ''
  }

  const renderContent = () => {
    if (showCodeSnippet) {
      const codeBlockContent = extractCodeBlock()
      return <CodeSnippet codeBlock={codeBlockContent.text} language='css' />
    } else {
      return <p>This is some text content.</p>
    }
  }

  return (
    <div className='p-4'>
      <TextEditor />
      <div className='mt-4'>{renderContent()}</div>
      <button onClick={() => setShowCodeSnippet(!showCodeSnippet)} className='mt-4 p-2 bg-blue-500 text-white rounded'>
        Toggle Content
      </button>
    </div>
  )
}
