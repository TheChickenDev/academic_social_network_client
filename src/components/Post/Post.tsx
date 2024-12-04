import { Avatar, AvatarFallback } from '../ui/avatar'
import { ThumbsUp, ThumbsDown, MessageCircle, Smile, Frown, Ellipsis } from 'lucide-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { CommentProps, PostProps } from '@/types/post.type'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'
import { convertISODateToLocaleString } from '@/utils/utils'
import { Link, useNavigate } from 'react-router-dom'
import { useCallback, useContext, useState } from 'react'
import { AppContext } from '@/contexts/app.context'
import { toast } from 'sonner'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost, dislikePost } from '@/apis/post.api'
import { submitComment } from '@/apis/comment.api'
import classNames from 'classnames'
import paths from '@/constants/paths'
import { AxiosResponse } from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Content, JSONContent } from '@tiptap/core'
import { contentMaxLength, contentMinLength } from '@/constants/post'
import Comments from './components/Comments'
import Tag from '../Tag'
import { savePost, unsavePost } from '@/apis/user.api'

export default function Post({
  post,
  details = false,
  ownerMode = false,
  actionTitle = 'action.delete',
  actionCallback = () => {}
}: {
  post: PostProps
  details: boolean
  ownerMode?: boolean
  actionTitle?: string
  actionCallback?: (id: string) => void
}) {
  const { t } = useTranslation()
  const { userId, isAuthenticated, isAdmin } = useContext(AppContext)
  const [postDetails, setPostDetails] = useState<PostProps>(post)
  const [commentDialog, setCommentDialog] = useState<boolean>(false)
  const [editorContent, setEditorContent] = useState<Content>('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const setPostsCacheData = useCallback(
    (response: AxiosResponse) => {
      queryClient.setQueryData(['posts'], (oldData: InfiniteData<PostProps[], unknown>) => {
        if (!oldData) return
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return page.map((item) => {
              if (item._id === postDetails._id) {
                return { ...item, ...response.data.data }
              }
              return item
            })
          })
        }
      })
    },
    [postDetails]
  )

  const setPostCacheData = useCallback(
    (response: AxiosResponse) => {
      queryClient.setQueryData(['post', postDetails._id], (oldData: PostProps) => {
        if (!oldData) return
        return { ...oldData, ...response.data.data }
      })
    },
    [postDetails]
  )

  const likeMutation = useMutation({
    mutationFn: (body: { userId: string }) => likePost(postDetails._id ?? '', body),
    onSuccess: (response) => {
      setPostsCacheData(response)
      setPostCacheData(response)
      setPostDetails({ ...postDetails, ...response.data.data })
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })
  const dislikeMutation = useMutation({
    mutationFn: (body: { userId: string }) => dislikePost(postDetails._id ?? '', body),
    onSuccess: (response) => {
      setPostsCacheData(response)
      setPostCacheData(response)
      setPostDetails({ ...postDetails, ...response.data.data })
    },
    onError: () => {
      toast.error(t('post.actionFailed'))
    }
  })
  const commentMutation = useMutation({
    mutationFn: (body: CommentProps) => submitComment(body)
  })

  const handleLikeClick = () => {
    if (!isAuthenticated || isAdmin) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (postDetails.dislikedBy?.find((item) => item.userId === userId)) {
      toast.warning(t('post.alreadyDisliked'))
      return
    }

    likeMutation.mutate({ userId: userId ?? '' })
  }

  const handleDislikeClick = () => {
    if (!isAuthenticated || isAdmin) {
      toast.warning(t('auth.pleaseLogin'))
      return
    }

    if (postDetails.likedBy?.find((item) => item.userId === userId)) {
      toast.warning(t('post.alreadyLiked'))
      return
    }

    dislikeMutation.mutate({ userId: userId ?? '' })
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
        ownerId: userId ?? '',
        content: editorContent as JSONContent
      },
      {
        onSuccess: (response) => {
          const status = response.status
          if (status === 201) {
            toast.success(t('post.commentSuccessful'))
            queryClient.setQueryData(
              ['comments', postDetails._id],
              (oldData: InfiniteData<CommentProps[], unknown>) => {
                if (!oldData) return
                oldData.pages[0].unshift(response.data.data)
                return {
                  ...oldData
                }
              }
            )
            queryClient.setQueryData(['post', postDetails._id], (oldData: PostProps) => {
              if (!oldData) return
              return { ...postDetails, numberOfComments: (postDetails.numberOfComments ?? 0) + 1 }
            })
            queryClient.setQueryData(['posts'], (oldData: InfiniteData<PostProps[], unknown>) => {
              if (!oldData) return
              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return page.map((item) => {
                    if (item._id === postDetails._id) {
                      return { ...postDetails, numberOfComments: (postDetails.numberOfComments ?? 0) + 1 }
                    }
                    return item
                  })
                })
              }
            })
            setCommentDialog(false)
            setEditorContent(null)
            setPostDetails({ ...postDetails, numberOfComments: (postDetails.numberOfComments ?? 0) + 1 })
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

  const handleSavePost = () => {
    savePost({ postId: postDetails._id ?? '', userId: userId ?? '' })
      .then((response) => {
        if (response.status === 200) {
          queryClient.setQueryData(['post', postDetails._id], (oldData: PostProps) => {
            if (!oldData) return
            return { ...oldData, isSaved: true }
          })
          queryClient.setQueryData(['posts'], (oldData: InfiniteData<PostProps[], unknown>) => {
            if (!oldData) return
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return page.map((item) => {
                  if (item._id === postDetails._id) {
                    return { ...postDetails, isSaved: true }
                  }
                  return item
                })
              })
            }
          })
          toast.success(t('post.savePostSuccessful'))
          setPostDetails({ ...postDetails, isSaved: true })
        } else {
          toast.error(t('post.savePostFailed'))
        }
      })
      .catch(() => {
        toast.error(t('post.savePostFailed'))
      })
  }

  const handleUnsavePost = () => {
    unsavePost({ postId: postDetails._id ?? '', userId: userId ?? '' })
      .then((response) => {
        if (response.status === 200) {
          queryClient.setQueryData(['post', postDetails._id], (oldData: PostProps) => {
            if (!oldData) return
            return { ...oldData, isSaved: false }
          })
          queryClient.setQueryData(['posts'], (oldData: InfiniteData<PostProps[], unknown>) => {
            if (!oldData) return
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return page.map((item) => {
                  if (item._id === postDetails._id) {
                    return { ...postDetails, isSaved: false }
                  }
                  return item
                })
              })
            }
          })
          toast.success(t('post.unsavePostSuccessful'))
          setPostDetails({ ...postDetails, isSaved: false })
        } else {
          toast.error(t('post.unsavePostFailed'))
        }
      })
      .catch(() => {
        toast.error(t('post.unsavePostFailed'))
      })
  }

  return (
    <div className='relative rounded-md border p-4 text-black dark:text-white bg-white dark:bg-dark-primary'>
      {isAuthenticated && !isAdmin && (
        <div className='absolute top-2 right-2 p-2'>
          {postDetails?.ownerId === userId && ownerMode ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='sm' variant='destructive'>
                  {t(actionTitle)}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('alertDialog.message')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('alertDialog.description')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('action.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => actionCallback(postDetails?._id ?? '')}>
                    {t('action.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            postDetails?.ownerId !== userId && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-fit min-w-32'>
                  {postDetails?.isSaved ? (
                    <DropdownMenuItem onClick={handleUnsavePost}>{t('post.unsavePost')}</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleSavePost}>{t('post.savePost')}</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => console.log('report')}>{t('post.reportPost')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}
        </div>
      )}
      <div className='border-b pb-4'>
        {details ? (
          <p className='text-xl'>{postDetails.title}</p>
        ) : (
          <Link
            to={postDetails._id ? paths.postDetails.replace(':id', postDetails._id) : '#'}
            className='text-xl hover:underline underline-offset-4'
          >
            {postDetails.title}
          </Link>
        )}
        <div className='mt-4 flex flex-wrap gap-2'>
          {postDetails.tags?.map((tag, index) => {
            return <Tag key={index} tag={tag} />
          })}
        </div>
        <div className='mt-4 flex justify-start items-center gap-2'>
          <Avatar>
            <AvatarImage src={postDetails.ownerAvatar} />
            <AvatarFallback />
          </Avatar>
          <div>
            <Link to={paths.profile.replace(':id', postDetails.ownerId)} target='_blank' className='font-semibold'>
              {postDetails.ownerName ? postDetails.ownerName : postDetails.ownerEmail}
            </Link>
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
                  'text-blue-600': !!postDetails.likedBy?.find((item) => item.userId === userId)
                })}
              >
                <span>{postDetails.numberOfLikes}</span>
                <ThumbsUp className='ml-2' />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className='w-fit'>
              {postDetails.likedBy?.length ? (
                <>
                  {postDetails.likedBy.slice(0, 10).map((like) => (
                    <p key={like.userId} className='text-xs'>
                      {like.userName}
                    </p>
                  ))}
                  {postDetails.likedBy.length > 10 ? (
                    <p className='text-xs'>{t('post.andMore', { count: postDetails.likedBy.length - 10 })}</p>
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
                  'text-red-600': !!postDetails.dislikedBy?.find((item) => item.userId === userId)
                })}
              >
                <span>{postDetails.numberOfDislikes}</span>
                <ThumbsDown className='ml-2' />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className='w-fit'>
              {postDetails.dislikedBy?.length ? (
                postDetails.dislikedBy.map((dislike) => (
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
        {!details ? (
          <Button
            variant='outline'
            onClick={() => navigate(postDetails._id ? paths.postDetails.replace(':id', postDetails._id) : '#')}
          >
            <span>{postDetails.numberOfComments}</span>
            <MessageCircle className='ml-2' />
          </Button>
        ) : (
          isAuthenticated &&
          !isAdmin && (
            <Dialog onOpenChange={setCommentDialog} open={commentDialog}>
              <DialogTrigger asChild>
                <Button>{t('action.comment')}</Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined} className='block'>
                <DialogHeader>
                  <DialogTitle>{t('action.comment')}</DialogTitle>
                </DialogHeader>
                <MinimalTiptapEditor
                  value={editorContent}
                  onChange={setEditorContent}
                  className='h-auto min-h-48 rounded-md border border-input shadow-sm focus-within:border-primary my-4'
                  editorContentClassName='p-2'
                  output='json'
                  placeholder={t('post.commentPlaceholder')}
                  autofocus={false}
                  editable={true}
                  editorClassName='focus:outline-none'
                />
                <DialogFooter className='gap-4'>
                  <DialogClose>{t('action.close')}</DialogClose>
                  <Button onClick={handleSubmit}>{t('action.submit')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
      {details && <Comments postDetails={postDetails} setPostDetails={setPostDetails} />}
    </div>
  )
}
