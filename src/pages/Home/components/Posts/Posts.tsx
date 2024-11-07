import Post from '@/components/Post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPosts } from '@/apis/post.api'
import { useEffect, useRef, useCallback } from 'react'
import { PostProps } from '@/types/post.type'
import { Skeleton } from '@/components/ui/skeleton'
import { postQuery } from '@/constants/post'

export default function Posts() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = postQuery.page }) => getPosts({ page: pageParam as number, limit: postQuery.limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.data.length === postQuery.limit) {
        return pages.length + 1
      }
      return undefined
    }
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
        <Skeleton className='w-full h-16 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col space-y-4'>
      {data?.pages.map((page) =>
        page.data.data.map((item: PostProps) => <Post key={item._id} post={item} details={false} />)
      )}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='w-full h-16 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
          </div>
        </div>
      )}
    </div>
  )
}
