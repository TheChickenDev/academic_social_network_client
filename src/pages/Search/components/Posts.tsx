import Post from '@/components/Post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useCallback } from 'react'
import { PostProps } from '@/types/post.type'
import { Skeleton } from '@/components/ui/skeleton'
import { postDefaultQuery } from '@/constants/post'
import { SearchQueryParams } from '@/types/utils.type'
import { search } from '@/apis/search.api'

export default function Posts({ q, type, filter }: SearchQueryParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

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
      {data?.pages?.map((page) => page?.map((item: PostProps) => <Post key={item._id} post={item} details={false} />))}
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
