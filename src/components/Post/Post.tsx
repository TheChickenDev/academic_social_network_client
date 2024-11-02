import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PostProps } from '@/types/post.type'
import PostComment from '../PostComment'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'
import { convertISODateToLocaleString } from '@/utils/utils'
import { Link, useNavigate } from 'react-router-dom'
import paths from '@/constants/paths'

export default function Post({ post, details = false }: { post: PostProps; details: boolean }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className='rounded-md border border-gray-300 p-4 text-black dark:text-white bg-white dark:bg-dark-primary'>
      <div className='border-b pb-4'>
        {details ? (
          <p className='text-2xl'>{post.title}</p>
        ) : (
          <Link to={post._id ? paths.postDetails.replace(':id', post._id) : '#'} className='text-2xl'>
            {post.title}
          </Link>
        )}
        <div className='mt-4 flex flex-wrap gap-2'>
          {post.tags.map((tag, index) => {
            return (
              <span
                key={index}
                className='inline-block bg-gray-100 rounded-sm text-md font-medium mr-2 px-3 py-1 dark:bg-blue-900'
              >
                {tag.label}
              </span>
            )
          })}
        </div>
        <div className='mt-4 flex justify-start items-center gap-2'>
          <Avatar>
            <AvatarImage src={post.ownerAvatar} />
            <AvatarFallback />
          </Avatar>
          <div>
            <p className='font-semibold'>{post.ownerName}</p>
            <p className='text-xs text-gray-500'>
              {t('post.createdAt') + ` ${convertISODateToLocaleString(post.createdAt)}`}
            </p>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <MinimalTiptapEditor
          value={post.content}
          autofocus={false}
          editable={false}
          editorClassName='focus:outline-none'
        />
      </div>
      <div className='flex justify-between items-center mt-4'>
        <div className='flex gap-2'>
          <Button variant='outline' className='flex items-center'>
            <span>{post.numberOfLikes}</span>
            <ThumbsUp className='ml-2' />
          </Button>
          <Button variant='outline' className='flex items-center'>
            <span>{post.numberOfDislikes}</span>
            <ThumbsDown className='ml-2' />
          </Button>
        </div>
        {(post.numberOfComments ?? 0 > 0) && !details ? (
          <Button
            variant='outline'
            className='flex items-center'
            onClick={() => navigate(post._id ? paths.postDetails.replace(':id', post._id) : '#')}
          >
            <span>{post.numberOfComments}</span>
            <MessageCircle className='ml-2' />
          </Button>
        ) : (
          ''
        )}
      </div>
      {details ? (
        <div className='border-t mt-4'>
          <div className='flex justify-between items-center gap-4 mt-4'>
            <p className='text-xl font-bold'>{`${post.numberOfComments} ` + t('answers')}</p>
            <Select>
              <SelectTrigger className='w-fit'>
                <SelectValue placeholder={t('filter.newest')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>{t('filter.newest')}</SelectItem>
                <SelectItem value='oldest'>{t('filter.oldest')}</SelectItem>
                <SelectItem value='mostLiked'>{t('filter.mostLiked')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {post.comments?.map((comment, index) => {
            return <PostComment key={index} comment={{ ...comment }} reply={false} />
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
