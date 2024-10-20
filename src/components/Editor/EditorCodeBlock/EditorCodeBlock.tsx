import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import EditorCodeBlockSelectLanguage from './EditorCodeBlockSelectLanguage'
import EditorCodeBlockCopy from './EditorCodeBlockCopy'

export default function EditorCodeBlock({ node, updateAttributes, editor }: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <pre className='relative text-xl'>
        <div className='block absolute top-2 right-2 w-40'>
          <EditorCodeBlockSelectLanguage defaultLanguage={node.attrs.language} updateAttributes={updateAttributes} />
          <EditorCodeBlockCopy editor={editor} />
        </div>
        <NodeViewContent as='code' />
      </pre>
    </NodeViewWrapper>
  )
}
