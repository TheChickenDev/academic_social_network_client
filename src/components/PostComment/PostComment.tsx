import { Avatar, AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useTranslation } from 'react-i18next'
import { ActionInfo, CommentProps, PostProps, ReplyProps } from '@/types/post.type'
import { convertISODateToLocaleString } from '@/utils/utils'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dislikeComment, likeComment, replyComment } from '@/apis/post.api'
import { toast } from 'sonner'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Content, JSONContent } from '@tiptap/core'
import { Button } from '../ui/button'
import { contentMaxLength, contentMinLength } from '@/constants/post'
import { AxiosResponse } from 'axios'
import { AppContext } from '@/contexts/app.context'
import classNames from 'classnames'
import { Frown, Smile, ThumbsDown, ThumbsUp } from 'lucide-react'

export default function PostComment({
  comment,
  isReply = false,
  setPostDetails
}: {
  comment: CommentProps
  isReply: boolean
  setPostDetails?: Dispatch<SetStateAction<PostProps>>
}) {
  const { t } = useTranslation()
  const { fullName, avatar, email, isAuthenticated } = useContext(AppContext)
  const [commentDialog, setCommentDialog] = useState<boolean>(false)
  const [editorContent, setEditorContent] = useState<Content>('')
  const [commentDetails, setCommentDetails] = useState<CommentProps>(comment)

  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: (body: ActionInfo & { commentId: string }) => likeComment(commentDetails._id ?? '', body),
    onSuccess: (response) => {
      queryClient.setQueryData(['post', commentDetails._id], (oldData: AxiosResponse) => {
        if (!oldData) return
        if (isReply) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              replies: oldData.data.replies.map((item: ReplyProps) => {
                if (item._id === commentDetails._id) {
                  return response.data.data
                }
                return item
              })
            }
          }
        }
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: response.data.data
          }
        }
      })
      setCommentDetails(response.data.data)
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })

  const dislikeMutation = useMutation({
    mutationFn: (body: ActionInfo & { commentId: string }) => dislikeComment(commentDetails._id ?? '', body),
    onSuccess: (response) => {
      queryClient.setQueryData(['post', commentDetails._id], (oldData: AxiosResponse) => {
        if (!oldData) return
        if (isReply) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              replies: oldData.data.replies.map((item: ReplyProps) => {
                if (item._id === commentDetails._id) {
                  return response.data.data
                }
                return item
              })
            }
          }
        }
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: response.data.data
          }
        }
      })
      setCommentDetails(response.data.data)
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

    if (commentDetails.dislikes?.find((item) => item.ownerEmail === email)) {
      toast.warning(t('post.alreadyDislikedComment'))
      return
    }

    likeMutation.mutate({
      ownerName: fullName ?? '',
      ownerEmail: email ?? '',
      commentId: (commentDetails as ReplyProps).commentId ?? ''
    })
  }

  const handleDislikeClick = () => {
    if (!isAuthenticated) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (commentDetails.likes?.find((item) => item.ownerEmail === email)) {
      toast.warning(t('post.alreadyLikedComment'))
      return
    }

    dislikeMutation.mutate({
      ownerName: fullName ?? '',
      ownerEmail: email ?? '',
      commentId: (commentDetails as ReplyProps).commentId ?? ''
    })
  }

  const replyMutation = useMutation({
    mutationFn: (body: ReplyProps) => replyComment(body)
  })

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
    replyMutation.mutate(
      {
        commentId: commentDetails._id ?? '',
        postId: commentDetails.postId ?? '',
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
            queryClient.setQueryData(['post', commentDetails.postId], (oldData: AxiosResponse) => {
              if (!oldData) return
              oldData.data.data.comments?.forEach((c: CommentProps) => {
                if (c._id === commentDetails._id) {
                  c.replies?.push(response.data.data)
                }
              })
              oldData.data.data.numberOfComments += 1
              if (setPostDetails) {
                setPostDetails(oldData.data.data)
              }
              return {
                ...oldData
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
    <div className='flex text-black dark:text-white bg-white dark:bg-dark-primary p-2'>
      <div className='relative'>
        <Avatar className='z-10'>
          <AvatarImage src={commentDetails.ownerAvatar} />
          <AvatarFallback />
        </Avatar>
        {isReply ? <SubConnectingLine /> : ''}
      </div>
      <div className='relative ml-2'>
        {commentDetails.replies && commentDetails.replies.length > 0 && <ConnectingLine />}
        <div>
          <p className='font-semibold'>{commentDetails.ownerName}</p>
          <p className='text-xs text-gray-500'>
            {t('post.createdAt') + ` ${convertISODateToLocaleString(commentDetails.createdAt)}`}
          </p>
        </div>
        <div className='mt-2'>
          <MinimalTiptapEditor
            value={commentDetails.content}
            autofocus={false}
            editable={false}
            editorClassName='focus:outline-none'
          />
          <div className='flex gap-2 mt-2'>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant='outline'
                  onClick={handleLikeClick}
                  className={classNames({
                    'text-blue-600': !!commentDetails.likes?.find((item) => item.ownerEmail === email)
                  })}
                >
                  <span>{commentDetails.numberOfLikes}</span>
                  <ThumbsUp className='ml-2' />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className='w-fit'>
                {commentDetails.likes?.length ? (
                  <>
                    {commentDetails.likes.slice(0, 10).map((like) => (
                      <p key={like.ownerEmail} className='text-xs'>
                        {like.ownerName}
                      </p>
                    ))}
                    {commentDetails.likes.length > 10 ? (
                      <p className='text-xs'>{t('post.andMore', { count: commentDetails.likes.length - 10 })}</p>
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
                    'text-red-600': !!commentDetails.dislikes?.find((item) => item.ownerEmail === email)
                  })}
                >
                  <span>{commentDetails.numberOfDislikes}</span>
                  <ThumbsDown className='ml-2' />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className='w-fit'>
                {commentDetails.dislikes?.length ? (
                  commentDetails.dislikes.map((dislike) => (
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
            {!isReply && isAuthenticated && (
              <Dialog onOpenChange={setCommentDialog} open={commentDialog}>
                <DialogTrigger asChild>
                  <button className='text-gray-600 text-xs p-0 '>{t('action.reply')}</button>
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
        </div>
        {commentDetails.replies && commentDetails.replies.length > 0 && (
          <div>
            {commentDetails.replies.map((reply) => (
              <PostComment key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ConnectingLine() {
  return <div className='absolute top-0 -left-7 border-l-2 border-gray-200 w-10 h-full' />
}

function SubConnectingLine() {
  return <div className='absolute top-0 -left-9 rounded-es-xl border-b-2 border-gray-200 w-10 h-5' />
}
