// import './EditorCodeBlock.scss'
import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import EditorCodeBlockSelectLanguage from './EditorCodeBlockSelectLanguage'
import EditorCodeBlockCopy from './EditorCodeBlockCopy'

export default function EditorCodeBlock({ node, updateAttributes, extension, editor }: NodeViewProps) {
  console.log(editor.isEditable)
  return (
    <NodeViewWrapper>
      <pre className='relative'>
        <div className='flex absolute top-2 right-2 w-40'>
          {editor.isEditable ? (
            <EditorCodeBlockSelectLanguage
              defaultLanguage={node.attrs.language}
              updateAttributes={updateAttributes}
              extension={extension}
            />
          ) : (
            <EditorCodeBlockCopy editor={editor} />
          )}
        </div>
        <NodeViewContent as='code' />
      </pre>
    </NodeViewWrapper>
  )
}
