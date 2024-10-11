import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import CodeSnippet from '../CodeSnippet'
import { CommentProps } from '@/types/post.type'

export default function Comment({
  userName,
  userAvatar,
  date,
  numberOfLikes,
  numberOfDislikes,
  content
}: CommentProps) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
  const linkBlockRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  return (
    <div className='border-gray-300 text-black dark:text-white bg-white dark:bg-background-dark'>
      <div className='border-b pb-4'>
        <div className='mt-4 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold'>{userName}</p>
              <p className='text-xs text-gray-500'>{date}</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Button className='flex items-center'>
              <ThumbsUp className='mr-1' />
              <span>{numberOfLikes}</span>
            </Button>
            <Button className='flex items-center'>
              <ThumbsDown className='mr-1' />
              <span>{numberOfDislikes}</span>
            </Button>
          </div>
        </div>
      </div>
      <div className='pt-2'>
        <div>
          {content.split(/(```\w*\n[\s\S]*?```|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
            if (codeBlockRegex.test(part)) {
              const match = part.match(/```(\w*)\n([\s\S]*?)```/) ?? ''
              const language = match[1].trim()
              const code = match[2].trim()
              return <CodeSnippet key={index} codeBlock={code} language={language} />
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
          })}
        </div>
      </div>
    </div>
  )
}
