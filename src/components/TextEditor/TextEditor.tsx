import Tiptap from '../Tiptap'

export default function TextEditor() {
  return (
    <div className='flex w-full border-black dark:border-gray-300 border-4 rounded-2xl overflow-hidden'>
      <Tiptap />
    </div>
  )
}
