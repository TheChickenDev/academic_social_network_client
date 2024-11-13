import { getPostsById } from '@/apis/post.api'
import Post from '@/components/Post'
import { Skeleton } from '@/components/ui/skeleton'
import { PostProps } from '@/types/post.type'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export default function PostDetails() {
  const { t } = useTranslation()
  const params = useParams()
  const { isLoading, data } = useQuery({
    queryKey: ['post', params.id],
    queryFn: async () => {
      const response = await getPostsById(params.id ?? '')
      return response.data.data
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  })

  return (
    <div className='min-h-screen px-2 pt-28 pb-8 md:px-6 lg:px-12 bg-light-primary dark:bg-dark-primary'>
      <Helmet>
        <title>{t('pages.post')}</title>
      </Helmet>
      {isLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='w-full h-24 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
          </div>
        </div>
      ) : (
        <Post post={data as PostProps} details={true}></Post>
      )}
    </div>
  )
}
