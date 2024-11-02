import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import CopyButton from './CopyButton'

export default function NodeView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <pre className='relative text-xl'>
        <div className='block absolute top-2 right-2 w-40'>
          <CopyButton content={node.textContent} />
        </div>
        <NodeViewContent as='code' />
      </pre>
    </NodeViewWrapper>
  )
}
