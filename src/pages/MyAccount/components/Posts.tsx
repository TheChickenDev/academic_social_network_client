import Post from '@/components/Post'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { deletePost, getPosts } from '@/apis/post.api'
import { useEffect, useRef, useCallback, useState } from 'react'
import { PostProps } from '@/types/post.type'
import { Skeleton } from '@/components/ui/skeleton'
import { postDefaultQuery } from '@/constants/post'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { decodeIdToEmail } from '@/utils/utils'

export default function Posts() {
  const { t } = useTranslation()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const [posts, setPosts] = useState<PostProps[]>([])
  const { id } = useParams<{ id: string }>()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery<PostProps[]>({
    queryKey: ['myPosts'],
    queryFn: async ({ pageParam = postDefaultQuery.page }) => {
      const response = await getPosts({
        page: pageParam as number,
        limit: postDefaultQuery.limit,
        ownerEmail: decodeIdToEmail(id ?? '')
      })
      return response.data.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === postDefaultQuery.limit) {
        return pages.length + 1
      }
      return undefined
    },
    staleTime: 0,
    gcTime: 0
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

  const handleDelete = (postId: string) => {
    deletePost(postId)
      .then((response) => {
        if (response.status === 200) {
          queryClient.invalidateQueries({
            queryKey: ['post', postId]
          })
          queryClient.invalidateQueries({
            queryKey: ['posts']
          })
          toast.success(t('post.actionSuccessful'))
          setPosts((oldPosts) => oldPosts.filter((post) => post._id !== postId))
        } else {
          toast.error(t('post.actionFailed'))
        }
      })
      .catch(() => {
        toast.error(t('post.actionFailed'))
      })
  }

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

  useEffect(() => {
    setPosts(data?.pages?.flat() ?? [])
  }, [data])

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
    <>
      {posts && posts.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-full py-10'>
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
      ) : (
        <div className='flex flex-col space-y-4'>
          {posts?.map((item: PostProps) => (
            <Post
              key={item._id}
              post={item}
              details={false}
              ownerMode={true}
              actionTitle='action.delete'
              actionCallback={handleDelete}
            />
          ))}
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
      )}
    </>
  )
}
