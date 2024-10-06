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
  contents
}: CommentProps) {
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
          {contents.map((content, index) => {
            {
              switch (content.type) {
                case 'text':
                  return (
                    <p key={index} className='pt-2'>
                      {content.content}
                    </p>
                  )
                case 'code':
                  return (
                    <div key={index} className='pt-2'>
                      <CodeSnippet codeBlock={content.content} language={content.language || ''} />
                    </div>
                  )
                case 'image':
                  return <img key={index} className='pt-2' src={content.content} alt='Post image' />
              }
            }
          })}
        </div>
      </div>
    </div>
  )
}
