import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { CommentProps } from '@/types/post.type'

export default function PostComment({ comment }: { comment: CommentProps }) {
  const { t } = useTranslation()

  return (
    <div className='rounded-md border border-gray-300 p-4 text-black dark:text-white bg-white dark:bg-dark-primary'>
      <div className='mt-4 flex justify-start items-center border-b pb-4'>
        <Avatar>
          <AvatarImage src={comment.ownerAvatar} />
          <AvatarFallback />
        </Avatar>
        <div>
          <p className='font-semibold'>{comment.ownerName}</p>
          <p className='text-xs text-gray-500'>{t('asked-at') + ` ${comment.createdAt}`}</p>
        </div>
      </div>
      <div>comment</div>
      <div className='flex gap-2'>
        <Button variant='outline' className='flex items-center'>
          <ThumbsUp className='mr-1' />
          <span>{comment.numberOfLikes}</span>
        </Button>
        <Button variant='outline' className='flex items-center'>
          <ThumbsDown className='mr-1' />
          <span>{comment.numberOfDislikes}</span>
        </Button>
      </div>
    </div>
  )
}
