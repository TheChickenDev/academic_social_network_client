import { ScrollArea } from '@/components/ui/scroll-area'
import classNames from 'classnames'
import { t } from 'i18next'
import Comment from './Comment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { CommentProps, PostProps } from '@/types/post.type'
import { commentDefaultQuery } from '@/constants/post'
import { getCommentsByPostId } from '@/apis/comment.api'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Comments({
  postDetails,
  setPostDetails
}: {
  postDetails: PostProps
  setPostDetails: Dispatch<SetStateAction<PostProps>>
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery<CommentProps[]>(
    {
      queryKey: ['comments', postDetails._id],
      queryFn: async ({ pageParam = commentDefaultQuery.page }) => {
        const response = await getCommentsByPostId({
          postId: postDetails._id,
          page: pageParam as number,
          limit: commentDefaultQuery.limit
        })
        return response.data.data
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === commentDefaultQuery.limit) {
          return pages.length + 1
        }
        return undefined
      },
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000
    }
  )

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

  return (
    <div className='mt-4'>
      <hr />
      <p className='text-xl font-bold my-2'>{`${postDetails.numberOfComments} ` + t('answers')}</p>
      {isLoading || isError ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='w-full h-16 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
          </div>
        </div>
      ) : (
        <ScrollArea
          className={classNames('mt-2', {
            'h-screen': postDetails?.numberOfComments && postDetails.numberOfComments > 0
          })}
        >
          {data?.pages?.map((page) =>
            page.map((item: CommentProps) => (
              <Comment key={item._id} comment={{ ...item }} isReply={false} setPostDetails={setPostDetails} />
            ))
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
        </ScrollArea>
      )}
    </div>
  )
}
