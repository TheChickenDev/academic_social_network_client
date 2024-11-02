import { Avatar, AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useTranslation } from 'react-i18next'
import { CommentProps } from '@/types/post.type'
import { convertISODateToLocaleString } from '@/utils/utils'
import { MinimalTiptapEditor } from '../MinimalTiptapEditor'

export default function PostComment({ comment, reply = false }: { comment: CommentProps; reply: boolean }) {
  const { t } = useTranslation()

  return (
    <div className={'flex text-black dark:text-white bg-white dark:bg-dark-primary p-2'}>
      <div className='relative'>
        <Avatar className='z-10'>
          <AvatarImage src={comment.ownerAvatar} />
          <AvatarFallback />
        </Avatar>
        {reply ? <SubConnectingLine /> : ''}
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
            {reply ? '' : <button className='text-gray-600 text-xs p-0 '>{t('action.reply')}</button>}
          </div>
        </div>
        {(comment.replies?.length ?? 0 > 0) ? (
          <div className='mt-2'>
            {comment.replies?.map((item) => <PostComment key={item._id} comment={item} reply={true} />)}
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
  return <div className='absolute top-0 -left-9 rounded-es-md border-b-2 border-gray-200 w-10 h-5' />
}
