import { getPosts } from '@/apis/post.api'
import Tag from '@/components/Tag'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import paths from '@/constants/paths'
import { postDefaultQuery } from '@/constants/post'
import { PostProps } from '@/types/post.type'
import { convertISODateToLocaleString } from '@/utils/utils'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function TodayPosts() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [posts, setPosts] = useState<PostProps[] | null>(null)

  useEffect(() => {
    getPosts({ page: 1, limit: postDefaultQuery.limit })
      .then((res) => {
        setPosts(res.data.data)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error(t('post.actionFailed'))
      })
  }, [])

  return (
    <div className='mt-4 p-2 text-sm border outline-none rounded-md bg-white dark:bg-dark-primary'>
      {isLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-[125px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      ) : (
        <>
          <h2 className='text-xl font-semibold'>{t('components.todayPosts')}</h2>
          {posts?.map((post, index) => (
            <div
              key={post._id}
              className={classNames('w-full py-4', {
                'border-b': index !== posts?.length - 1
              })}
            >
              <div className='flex'>
                <span className='text-sm text-orange-500 min-w-fit max-h-fit bg-orange-100 border border-orange-200 rounded-sm p-1'>
                  <span className='-ml-1'>🔥</span>
                  <span className='font-bold'>{post.numberOfLikes}</span>
                </span>
                <Link
                  to={post._id ? paths.postDetails.replace(':id', post._id) : '#'}
                  className='ml-2 text-lg text-gray-600 dark:text-white line-clamp-2 font-medium hover:underline'
                >
                  {post.title}
                </Link>
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {post.tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
              </div>
              <div className='mt-2 flex items-center justify-start gap-1'>
                <Avatar>
                  <AvatarImage src={post.ownerAvatar} />
                  <AvatarFallback />
                </Avatar>
                <p className='font-bold text-sm'>{post.ownerName}</p>
                <svg width='12' height='12' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M5 6.475L6.3875 7.525C6.4875 7.59167 6.5875 7.59375 6.6875 7.53125C6.7875 7.46875 6.81667 7.37917 6.775 7.2625L6.25 5.525L7.6125 4.55C7.7125 4.475 7.74167 4.38125 7.7 4.26875C7.65833 4.15625 7.57917 4.1 7.4625 4.1H5.8L5.2375 2.275C5.19583 2.15833 5.11667 2.1 5 2.1C4.88333 2.1 4.80417 2.15833 4.7625 2.275L4.2 4.1H2.5375C2.42083 4.1 2.34167 4.15625 2.3 4.26875C2.25833 4.38125 2.2875 4.475 2.3875 4.55L3.75 5.525L3.225 7.2625C3.18333 7.37917 3.2125 7.46875 3.3125 7.53125C3.4125 7.59375 3.5125 7.59167 3.6125 7.525L5 6.475ZM5 10C4.30833 10 3.65833 9.86875 3.05 9.60625C2.44167 9.34375 1.9125 8.9875 1.4625 8.5375C1.0125 8.0875 0.65625 7.55833 0.39375 6.95C0.13125 6.34167 0 5.69167 0 5C0 4.30833 0.13125 3.65833 0.39375 3.05C0.65625 2.44167 1.0125 1.9125 1.4625 1.4625C1.9125 1.0125 2.44167 0.65625 3.05 0.39375C3.65833 0.13125 4.30833 0 5 0C5.69167 0 6.34167 0.13125 6.95 0.39375C7.55833 0.65625 8.0875 1.0125 8.5375 1.4625C8.9875 1.9125 9.34375 2.44167 9.60625 3.05C9.86875 3.65833 10 4.30833 10 5C10 5.69167 9.86875 6.34167 9.60625 6.95C9.34375 7.55833 8.9875 8.0875 8.5375 8.5375C8.0875 8.9875 7.55833 9.34375 6.95 9.60625C6.34167 9.86875 5.69167 10 5 10Z'
                    fill='#FBBF24'
                  />
                </svg>
              </div>
              <div className='mt-2 flex justify-between text-xs'>
                <span className='text-xs text-gray-500'>
                  {t('post.createdAt') + ` ${convertISODateToLocaleString(post.createdAt)}`}
                </span>
                <span>{`${post.numberOfComments} ` + t('postProps.answersQuantity')}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
