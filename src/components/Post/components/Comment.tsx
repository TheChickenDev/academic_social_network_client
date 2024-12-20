import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useTranslation } from 'react-i18next'
import { CommentProps, PostProps } from '@/types/post.type'
import { convertISODateToLocaleString } from '@/utils/utils'
import { MinimalTiptapEditor } from '@/components//MinimalTiptapEditor'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { dislikeComment, likeComment, replyComment } from '@/apis/comment.api'
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
import { Button } from '@/components//ui/button'
import { contentMaxLength, contentMinLength } from '@/constants/post'
import { AppContext } from '@/contexts/app.context'
import classNames from 'classnames'
import { Frown, Smile, ThumbsDown, ThumbsUp } from 'lucide-react'

export default function Comment({
  comment,
  isReply = false,
  setPostDetails
}: {
  comment: CommentProps
  isReply: boolean
  setPostDetails?: Dispatch<SetStateAction<PostProps>>
}) {
  const { t } = useTranslation()
  const { userId, isAuthenticated, isAdmin } = useContext(AppContext)
  const [commentDialog, setCommentDialog] = useState<boolean>(false)
  const [editorContent, setEditorContent] = useState<Content>('')
  const [commentDetails, setCommentDetails] = useState<CommentProps>(comment)

  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: (body: { userId: string }) => likeComment(commentDetails._id ?? '', body),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['comments', commentDetails.postId],
        (oldData: InfiniteData<CommentProps[], unknown>) => {
          if (!oldData) return
          if (isReply) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return page.map((item) => {
                  if (item._id === commentDetails.parentId) {
                    item.replies = item.replies?.map((reply) => {
                      if (reply._id === commentDetails._id) {
                        return { ...reply, ...response.data.data }
                      }
                      return reply
                    }) as CommentProps[]
                  }
                  return item
                })
              })
            }
          }
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return page.map((item) => {
                if (item._id === commentDetails._id) {
                  return { ...item, ...response.data.data }
                }
                return item
              })
            })
          }
        }
      )
      setCommentDetails({ ...commentDetails, ...response.data.data })
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })

  const dislikeMutation = useMutation({
    mutationFn: (body: { userId: string }) => dislikeComment(commentDetails._id ?? '', body),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ['comments', commentDetails.postId],
        (oldData: InfiniteData<CommentProps[], unknown>) => {
          if (!oldData) return
          if (isReply) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return page.map((item) => {
                  if (item._id === commentDetails.parentId) {
                    item.replies = item.replies?.map((reply) => {
                      if (reply._id === commentDetails._id) {
                        return { ...reply, ...response.data.data } as CommentProps
                      }
                      return reply
                    }) as CommentProps[]
                  }
                  return item
                })
              })
            }
          }
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return page.map((item) => {
                if (item._id === commentDetails._id) {
                  return { ...item, ...response.data.data }
                }
                return item
              })
            })
          }
        }
      )
      setCommentDetails({ ...commentDetails, ...response.data.data })
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })

  const handleLikeClick = () => {
    if (!isAuthenticated || isAdmin) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (commentDetails.dislikedBy?.find((item) => item.userId === userId)) {
      toast.warning(t('post.alreadyDislikedComment'))
      return
    }

    likeMutation.mutate({
      userId: userId ?? ''
    })
  }

  const handleDislikeClick = () => {
    if (!isAuthenticated || isAdmin) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (commentDetails.likedBy?.find((item) => item.userId === userId)) {
      toast.warning(t('post.alreadyLikedComment'))
      return
    }

    dislikeMutation.mutate({
      userId: userId ?? ''
    })
  }

  const replyMutation = useMutation({
    mutationFn: (body: CommentProps) => replyComment(body)
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
        parentId: commentDetails._id ?? '',
        postId: commentDetails.postId ?? '',
        ownerId: userId ?? '',
        content: editorContent as JSONContent
      },
      {
        onSuccess: (response) => {
          const status = response.status
          if (status === 201) {
            toast.success(t('post.commentSuccessful'))
            queryClient.setQueryData(
              ['comments', commentDetails.postId],
              (oldData: InfiniteData<CommentProps[], unknown>) => {
                if (!oldData) return
                return {
                  ...oldData,
                  pages: oldData.pages.map((page) => {
                    return page.map((item) => {
                      if (item._id === commentDetails._id) {
                        return {
                          ...commentDetails,
                          numberOfReplies: (commentDetails.numberOfReplies ?? 0) + 1,
                          replies: [response.data.data, ...(commentDetails.replies ?? [])]
                        }
                      }
                      return item
                    })
                  })
                }
              }
            )
            queryClient.setQueryData(['post', commentDetails.postId], (oldData: PostProps) => {
              if (!oldData) return
              if (setPostDetails) {
                setPostDetails({ ...oldData, numberOfComments: (oldData.numberOfComments ?? 0) + 1 })
              }
              return { ...oldData, numberOfComments: (oldData.numberOfComments ?? 0) + 1 }
            })
            queryClient.setQueryData(['posts'], (oldData: InfiniteData<PostProps[], unknown>) => {
              if (!oldData) return
              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return page.map((item) => {
                    if (item._id === commentDetails.postId) {
                      return { ...item, numberOfComments: (item.numberOfComments ?? 0) + 1 }
                    }
                    return item
                  })
                })
              }
            })
            setCommentDialog(false)
            setEditorContent(null)
            setCommentDetails({
              ...commentDetails,
              numberOfReplies: (commentDetails.numberOfReplies ?? 0) + 1,
              replies: [response.data.data, ...(commentDetails.replies ?? [])]
            })
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
      <div className='flex-1 relative ml-2 w-[calc(100%-48px)]'>
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
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 mt-2'>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant='outline'
                    onClick={handleLikeClick}
                    className={classNames({
                      'text-blue-600': !!commentDetails.likedBy?.find((item) => item.userId === userId)
                    })}
                  >
                    <span>{commentDetails.numberOfLikes}</span>
                    <ThumbsUp className='ml-2' />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className='w-fit'>
                  {commentDetails.likedBy?.length ? (
                    <>
                      {commentDetails.likedBy.slice(0, 10).map((like) => (
                        <p key={like.userId} className='text-xs'>
                          {like.userName}
                        </p>
                      ))}
                      {commentDetails.likedBy.length > 10 ? (
                        <p className='text-xs'>{t('post.andMore', { count: commentDetails.likedBy.length - 10 })}</p>
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
                      'text-red-600': !!commentDetails.dislikedBy?.find((item) => item.userId === userId)
                    })}
                  >
                    <span>{commentDetails.numberOfDislikes}</span>
                    <ThumbsDown className='ml-2' />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className='w-fit'>
                  {commentDetails.dislikedBy?.length ? (
                    commentDetails.dislikedBy.map((dislike) => (
                      <p key={dislike.userId} className='text-xs'>
                        {dislike.userName}
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
            {!isReply && isAuthenticated && !isAdmin && (
              <Dialog onOpenChange={setCommentDialog} open={commentDialog}>
                <DialogTrigger asChild>
                  <Button variant='outline'>{t('action.reply')}</Button>
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
          <div className='mt-2'>
            {commentDetails.replies.map((reply) => (
              <Comment key={reply._id} comment={reply} isReply={true} />
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
