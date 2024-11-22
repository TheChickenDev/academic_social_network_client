import Post from '@/components/Post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useCallback } from 'react'
import { PostProps } from '@/types/post.type'
import { Skeleton } from '@/components/ui/skeleton'
import { postDefaultQuery } from '@/constants/post'
import { SearchQueryParams } from '@/types/utils.type'
import { search } from '@/apis/search.api'
import { useTranslation } from 'react-i18next'

export default function Posts({ q, type, filter }: SearchQueryParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery<PostProps[]>({
    queryKey: ['searchPosts'],
    queryFn: async ({ pageParam = postDefaultQuery.page }) => {
      const response = await search({ page: pageParam as number, limit: postDefaultQuery.limit, q, type, filter })
      return response.data.data as PostProps[]
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === postDefaultQuery.limit) {
        return pages.length + 1
      }
      return undefined
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  })

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage]
  )

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1
    }
    const observer = new IntersectionObserver(handleObserver, option)
    const currentRef = loadMoreRef.current
    if (currentRef) observer.observe(currentRef)
    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [handleObserver])

  if (isLoading || isError) {
    return (
      <div className='flex flex-col space-y-3'>
        <Skeleton className='w-full h-24 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-12 w-4/5' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col space-y-4'>
      {data?.pages?.[0] && data?.pages?.[0].length > 0 ? (
        data?.pages?.map((page) => page?.map((item: PostProps) => <Post key={item._id} post={item} details={false} />))
      ) : (
        <div className='flex flex-col items-center justify-center h-full py-10 flex-1'>
          <svg
            className='w-16 h-16 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15a4 4 0 014-4h10a4 4 0 014 4M3 15V9a4 4 0 014-4h10a4 4 0 014 4v6M3 9a4 4 0 014-4h10a4 4 0 014 4v6'
            />
          </svg>
          <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('noData')}</h2>
          <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
        </div>
      )}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='w-full h-24 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-12 w-4/5' />
          </div>
        </div>
      )}
    </div>
  )
}
