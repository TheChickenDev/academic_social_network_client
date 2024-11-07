import { Avatar, AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useTranslation } from 'react-i18next'
import { CommentProps, PostProps, ReplyProps } from '@/types/post.type'
import { convertISODateToLocaleString } from '@/utils/utils'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { replyComment } from '@/apis/post.api'
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
import { Content, JSONContent } from '@tiptap/core'
import { Button } from '../ui/button'
import { contentMaxLength, contentMinLength } from '@/constants/post'
import { AxiosResponse } from 'axios'
import { AppContext } from '@/contexts/app.context'

export default function PostComment({
  comment,
  isReply = false,
  setPostDetails
}: {
  comment: CommentProps
  isReply: boolean
  setPostDetails?: Dispatch<SetStateAction<PostProps>>
}) {
  console.log(comment.content)
  const { t } = useTranslation()
  const { fullName, avatar, email, isAuthenticated } = useContext(AppContext)
  const [commentDialog, setCommentDialog] = useState<boolean>(false)
  const [editorContent, setEditorContent] = useState<Content>('')

  const queryClient = useQueryClient()
  // const likeMutation = useMutation({
  //   mutationFn: (body: ActionInfo) => likePost(postDetails._id ?? '', body),
  //   onSuccess: (response) => {
  //     queryClient.setQueryData(['posts', 1], (oldData: AxiosResponse) => {
  //       if (!oldData) return
  //       return {
  //         ...oldData,
  //         data: {
  //           ...oldData.data,
  //           data: oldData.data.data.map((item: PostProps) => {
  //             if (item._id === postDetails._id) {
  //               return response.data.data
  //             }
  //             return item
  //           })
  //         }
  //       }
  //     })
  //     queryClient.setQueryData(['post', postDetails._id], (oldData: AxiosResponse) => {
  //       if (!oldData) return
  //       return {
  //         ...oldData,
  //         data: {
  //           ...oldData.data,
  //           data: response.data.data
  //         }
  //       }
  //     })
  //     setPostDetails(response.data.data)
  //   },
  //   onError: () => {
  //     toast.error(t('post.actionFailed'))
  //   }
  // })
  // const dislikeMutation = useMutation({
  //   mutationFn: (body: ActionInfo) => dislikePost(postDetails._id ?? '', body),
  //   onSuccess: (response) => {
  //     queryClient.setQueryData(['posts', 1], (oldData: AxiosResponse) => {
  //       if (!oldData) return
  //       return {
  //         ...oldData,
  //         data: {
  //           ...oldData.data,
  //           data: oldData.data.data.map((item: PostProps) => {
  //             if (item._id === postDetails._id) {
  //               return response.data.data
  //             }
  //             return item
  //           })
  //         }
  //       }
  //     })
  //     queryClient.setQueryData(['post', postDetails._id], (oldData: AxiosResponse) => {
  //       if (!oldData) return
  //       return {
  //         ...oldData,
  //         data: {
  //           ...oldData.data,
  //           data: response.data.data
  //         }
  //       }
  //     })
  //     setPostDetails(response.data.data)
  //   },
  //   onError: () => {
  //     toast.error(t('post.actionFailed'))
  //   }
  // })

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
        commentId: comment._id ?? '',
        postId: comment.postId ?? '',
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
            queryClient.setQueryData(['post', comment.postId], (oldData: AxiosResponse) => {
              if (!oldData) return
              oldData.data.data.comments?.forEach((c: CommentProps) => {
                if (c._id === comment._id) {
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
        onError: (e) => {
          console.log(e)
          toast.error(t('post.createFailed'))
        }
      }
    )
  }

  return (
    <div className={'flex text-black dark:text-white bg-white dark:bg-dark-primary p-2'}>
      <div className='relative'>
        <Avatar className='z-10'>
          <AvatarImage src={comment.ownerAvatar} />
          <AvatarFallback />
        </Avatar>
        {isReply ? <SubConnectingLine /> : ''}
      </div>
      <div className='relative ml-2'>
        {comment.replies?.length ? <ConnectingLine /> : ''}
        <div>
          <p className='font-semibold'>{comment.ownerName}</p>
          <p className='text-xs text-gray-500'>
            {t('post.createdAt') + ` ${convertISODateToLocaleString(comment.createdAt)}`}
          </p>
        </div>
        <div className='mt-2'>
          <MinimalTiptapEditor
            value={comment.content}
            autofocus={false}
            editable={false}
            editorClassName='focus:outline-none'
          />
          <div className='flex gap-2 mt-2'>
            <button className='text-gray-600 text-xs p-0 '>{t('action.like')}</button>
            <button className='text-gray-600 text-xs p-0 '>{t('action.dislike')}</button>
            {isReply || !isAuthenticated ? (
              ''
            ) : (
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
        {(comment.replies?.length ?? 0 > 0) ? (
          <div className='mt-2'>
            {comment.replies?.map((item) => <PostComment key={item._id} comment={item} isReply={true} />)}
          </div>
        ) : (
          ''
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
