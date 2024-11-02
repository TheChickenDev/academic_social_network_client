import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { common, createLowlight } from 'lowlight'
import NodeView from './components/NodeView'

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight: createLowlight(common),
      defaultLanguage: null,
      HTMLAttributes: {
        class: 'block-node'
      }
    }
  }
})

export const CodeBlockWithCopyButton = TiptapCodeBlockLowlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight: createLowlight(common),
      defaultLanguage: null,
      HTMLAttributes: {
        class: 'block-node'
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(NodeView)
  }
})

export default CodeBlockLowlight
