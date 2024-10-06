import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PostProps } from '@/types/post.type'
import CodeSnippet from '../CodeSnippet'
import Comment from '../Comment'

export default function Post({
  title,
  tags,
  userName,
  userAvatar,
  date,
  numberOfLikes,
  numberOfDislikes,
  numberOfComments,
  contents,
  comments
}: PostProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-md border border-gray-300 p-4 text-black dark:text-white bg-white dark:bg-background-dark'>
      <div className='border-b pb-4'>
        <p className='text-2xl'>{title}</p>
        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='inline-block bg-gray-100 rounded-sm text-md font-medium mr-2 px-3 py-1 dark:bg-blue-900'
            >
              {tag}
            </span>
          ))}
        </div>
        <div className='mt-4 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold'>{userName}</p>
              <p className='text-xs text-gray-500'>{t('asked-at') + ` ${date}`}</p>
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
            <Button className='flex items-center'>
              <MessageCircle className='mr-1' />
              <span>{numberOfComments}</span>
            </Button>
          </div>
        </div>
      </div>
      <div className='pt-2'>
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
      <div className='border-t pt-4'>
        <div className='flex justify-between items-center gap-4'>
          <p className='text-xl font-bold'>{`${numberOfComments} ` + t('answers')}</p>
          <Select>
            <SelectTrigger className='w-fit'>
              <SelectValue placeholder={t('filter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>{t('newest')}</SelectItem>
              <SelectItem value='oldest'>{t('oldest')}</SelectItem>
              <SelectItem value='most-liked'>{t('most-liked')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {comments.map((comment, index) => (
          <div key={index}>
            <Comment
              userName={comment.userName}
              userAvatar={userAvatar}
              date={date}
              numberOfLikes={comment.numberOfLikes}
              numberOfDislikes={comment.numberOfDislikes}
              contents={comment.contents}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
