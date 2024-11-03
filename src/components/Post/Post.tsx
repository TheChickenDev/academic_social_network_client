import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown, MessageCircle, Smile, Frown } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ActionInfo, PostProps } from '@/types/post.type'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'
import { convertISODateToLocaleString } from '@/utils/utils'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/app.context'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { likePost, dislikePost } from '@/apis/post.api'
import classNames from 'classnames'
import PostComment from '../PostComment'
import paths from '@/constants/paths'

export default function Post({ post, details = false }: { post: PostProps; details: boolean }) {
  const { t } = useTranslation()
  const { fullName, email, isAuthenticated } = useContext(AppContext)
  const [postDetails, setPostDetails] = useState<PostProps>(post)
  const navigate = useNavigate()
  const likeMutation = useMutation({
    mutationFn: (body: ActionInfo) => likePost(postDetails._id ?? '', body),
    onSuccess: (data) => {
      setPostDetails(data.data.data)
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })
  const dislikeMutation = useMutation({
    mutationFn: (body: ActionInfo) => dislikePost(postDetails._id ?? '', body),
    onSuccess: (data) => {
      setPostDetails(data.data.data)
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (postDetails.dislikes?.find((item) => item.ownerEmail === email)) {
      toast.warning(t('post.alreadyDisliked'))
      return
    }

    likeMutation.mutate({ ownerName: fullName ?? '', ownerEmail: email ?? '' })
  }

  const handleDislikeClick = () => {
    if (!isAuthenticated) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (postDetails.likes?.find((item) => item.ownerEmail === email)) {
      toast.warning(t('post.alreadyLiked'))
      return
    }

    dislikeMutation.mutate({ ownerName: fullName ?? '', ownerEmail: email ?? '' })
  }

  useEffect(() => {
    console.log('postDetails', postDetails)
  }, [postDetails])

  return (
    <div className='rounded-md border border-gray-300 p-4 text-black dark:text-white bg-white dark:bg-dark-primary'>
      <div className='border-b pb-4'>
        {details ? (
          <p className='text-2xl'>{postDetails.title}</p>
        ) : (
          <Link
            to={postDetails._id ? paths.postDetails.replace(':id', postDetails._id) : '#'}
            className='text-2xl hover:underline underline-offset-4'
          >
            {postDetails.title}
          </Link>
        )}
        <div className='mt-4 flex flex-wrap gap-2'>
          {postDetails.tags.map((tag, index) => {
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
            <AvatarImage src={postDetails.ownerAvatar} />
            <AvatarFallback />
          </Avatar>
          <div>
            <p className='font-semibold'>{postDetails.ownerName}</p>
            <p className='text-xs text-gray-500'>
              {t('postDetails.createdAt') + ` ${convertISODateToLocaleString(postDetails.createdAt)}`}
            </p>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <MinimalTiptapEditor
          value={postDetails.content}
          autofocus={false}
          editable={false}
          editorClassName='focus:outline-none'
        />
      </div>
      <div className='flex justify-between items-center mt-4'>
        <div className='flex gap-2'>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant='outline'
                onClick={handleLikeClick}
                className={classNames({
                  'text-blue-600': !!postDetails.likes?.find((item) => item.ownerEmail === email)
                })}
              >
                <span>{postDetails.numberOfLikes}</span>
                <ThumbsUp className='ml-2' />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className='w-fit'>
              {postDetails.likes?.length ? (
                <>
                  {postDetails.likes.slice(0, 10).map((like) => (
                    <p key={like.ownerEmail} className='text-xs'>
                      {like.ownerName}
                    </p>
                  ))}
                  {postDetails.likes.length > 10 ? (
                    <p className='text-xs'>{t('postDetails.andMore', { count: postDetails.likes.length - 10 })}</p>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <div className='flex justify-center items-center gap-2'>
                  <Frown />
                  <p>{t('postDetails.noOneLiked')}</p>
                </div>
              )}
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant='outline'
                onClick={handleDislikeClick}
                className={classNames({
                  'text-red-600': !!postDetails.dislikes?.find((item) => item.ownerEmail === email)
                })}
              >
                <span>{postDetails.numberOfDislikes}</span>
                <ThumbsDown className='ml-2' />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className='w-fit'>
              {postDetails.dislikes?.length ? (
                postDetails.dislikes.map((dislike) => (
                  <p key={dislike.ownerEmail} className='text-xs'>
                    {dislike.ownerName}
                  </p>
                ))
              ) : (
                <div className='flex justify-center items-center gap-2'>
                  <Smile />
                  <p>{t('postDetails.noOneDisliked')}</p>
                </div>
              )}
            </HoverCardContent>
          </HoverCard>
        </div>
        {!details ? (
          <Button
            variant='outline'
            onClick={() => navigate(postDetails._id ? paths.postDetails.replace(':id', postDetails._id) : '#')}
          >
            <span>{postDetails.numberOfComments}</span>
            <MessageCircle className='ml-2' />
          </Button>
        ) : (
          ''
        )}
      </div>
      {details ? (
        <div className='border-t mt-4'>
          <div className='flex justify-between items-center gap-4 mt-4'>
            <p className='text-xl font-bold'>{`${postDetails.numberOfComments} ` + t('answers')}</p>
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
          {postDetails.comments?.map((comment, index) => {
            return <PostComment key={index} comment={{ ...comment }} reply={false} />
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
