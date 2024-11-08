import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown, MessageCircle, Smile, Frown } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ActionInfo, CommentProps, PostProps } from '@/types/post.type'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'
import { convertISODateToLocaleString } from '@/utils/utils'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '@/contexts/app.context'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost, dislikePost, submitComment } from '@/apis/post.api'
import classNames from 'classnames'
import PostComment from '../PostComment'
import paths from '@/constants/paths'
import { AxiosResponse } from 'axios'
import { ScrollArea } from '../ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Content, JSONContent } from '@tiptap/core'
import { contentMaxLength, contentMinLength } from '@/constants/post'

export default function Post({ post, details = false }: { post: PostProps; details: boolean }) {
  const { t } = useTranslation()
  const { fullName, avatar, email, isAuthenticated } = useContext(AppContext)
  const [postDetails, setPostDetails] = useState<PostProps>(post)
  const [commentDialog, setCommentDialog] = useState<boolean>(false)
  const [editorContent, setEditorContent] = useState<Content>('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: (body: ActionInfo) => likePost(postDetails._id ?? '', body),
    onSuccess: (response) => {
      queryClient.setQueryData(['posts'], (oldData: AxiosResponse) => {
        if (!oldData) return
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((item: PostProps) => {
              if (item._id === postDetails._id) {
                return response.data.data
              }
              return item
            })
          }
        }
      })
      queryClient.setQueryData(['post', postDetails._id], (oldData: AxiosResponse) => {
        if (!oldData) return
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: response.data.data
          }
        }
      })
      setPostDetails({ ...response.data.data, comments: postDetails.comments })
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })
  const dislikeMutation = useMutation({
    mutationFn: (body: ActionInfo) => dislikePost(postDetails._id ?? '', body),
    onSuccess: (response) => {
      queryClient.setQueryData(['posts'], (oldData: AxiosResponse) => {
        if (!oldData) return
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((item: PostProps) => {
              if (item._id === postDetails._id) {
                return response.data.data
              }
              return item
            })
          }
        }
      })
      queryClient.setQueryData(['post', postDetails._id], (oldData: AxiosResponse) => {
        if (!oldData) return
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: response.data.data
          }
        }
      })
      setPostDetails({ ...response.data.data, comments: postDetails.comments })
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })
  const commentMutation = useMutation({
    mutationFn: (body: CommentProps) => submitComment(body)
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

  const extractText = (node: JSONContent) => {
    let text = ''

    if (node.type === 'text') {
      text += node.text
    }

    if (node.content) {
      node.content.forEach((child) => {
        text += extractText(child)
      })
    }

    return text
  }

  const handleSubmit = () => {
    const l = extractText(editorContent as JSONContent).length

    if (l < contentMinLength || l > contentMaxLength) {
      toast.warning(t('post.descriptionError'))
      return
    }
    commentMutation.mutate(
      {
        postId: postDetails._id ?? '',
        ownerName: fullName ?? '',
        ownerAvatar: avatar ?? '',
        ownerEmail: email ?? '',
        content: editorContent as JSONContent
      },
      {
        onSuccess: (response) => {
          const status = response.status
          if (status === 201) {
            toast.success(t('post.commentSuccessful'))
            queryClient.setQueryData(['post', postDetails._id], (oldData: AxiosResponse) => {
              if (!oldData) return
              setPostDetails({
                ...postDetails,
                comments: [response.data.data, ...oldData.data.data.comments],
                numberOfComments: oldData.data.data.numberOfComments + 1
              })
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  data: {
                    ...response.data.data,
                    comments: [response.data.data, ...oldData.data.data.comments],
                    numberOfComments: oldData.data.data.numberOfComments + 1
                  }
                }
              }
            })
            setCommentDialog(false)
            setEditorContent(null)
          } else {
            toast.error(t('post.createFailed'))
          }
        },
        onError: () => {
          toast.error(t('post.createFailed'))
        }
      }
    )
  }

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
              {t('post.createdAt') + ` ${convertISODateToLocaleString(postDetails.createdAt)}`}
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
                    <p className='text-xs'>{t('post.andMore', { count: postDetails.likes.length - 10 })}</p>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <div className='flex justify-center items-center gap-2'>
                  <Frown />
                  <p>{t('post.noOneLiked')}</p>
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
                  <p>{t('post.noOneDisliked')}</p>
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
          <Dialog onOpenChange={setCommentDialog} open={commentDialog}>
            <DialogTrigger asChild>
              <Button>{t('action.comment')}</Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>{t('action.preview')}</DialogTitle>
              </DialogHeader>
              <MinimalTiptapEditor
                value={editorContent}
                onChange={setEditorContent}
                className='h-auto rounded-md border border-input shadow-sm focus-within:border-primary'
                editorContentClassName='p-2'
                output='json'
                placeholder={t('post.descriptionPlaceholder')}
                autofocus={false}
                editable={true}
                editorClassName='focus:outline-none min-h-48 max-h-96 overflow-y-auto'
              />
              <DialogFooter className='gap-4'>
                <DialogClose>{t('action.close')}</DialogClose>
                <Button onClick={handleSubmit}>{t('action.submit')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {details ? (
        <div className='border-t mt-4'>
          <p className='text-xl font-bold mt-4'>{`${postDetails.numberOfComments} ` + t('answers')}</p>
          <ScrollArea
            className={classNames('mt-2', {
              'h-screen': postDetails?.numberOfComments && postDetails.numberOfComments > 0
            })}
          >
            {postDetails.comments?.map((comment) => {
              return (
                <PostComment
                  key={comment._id}
                  comment={{ ...comment }}
                  isReply={false}
                  setPostDetails={setPostDetails}
                />
                // <div key={comment._id}></div>
              )
            })}
          </ScrollArea>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
