import Post from '@/components/Post'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { deletePost, getPosts } from '@/apis/post.api'
import { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { PostProps } from '@/types/post.type'
import { Skeleton } from '@/components/ui/skeleton'
import { postDefaultQuery } from '@/constants/post'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Link, useParams } from 'react-router-dom'
import { AppContext } from '@/contexts/app.context'
import { approvePost, getGroupPosts, rejectPost } from '@/apis/group.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { convertISODateToLocaleString } from '@/utils/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import paths from '@/constants/paths'
import { EllipsisVertical } from 'lucide-react'

export default function Posts({ canEdit }: { canEdit: boolean }) {
  const { t } = useTranslation()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const [posts, setPosts] = useState<PostProps[]>([])
  const { id } = useParams<{ id: string }>()
  const { userId } = useContext(AppContext)
  const [requests, setRequests] = useState<PostProps[]>([])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery<PostProps[]>({
    queryKey: ['groupPosts'],
    queryFn: async ({ pageParam = postDefaultQuery.page }) => {
      const response = await getPosts({
        page: pageParam as number,
        limit: postDefaultQuery.limit,
        groupId: id,
        userId
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

  const handleApprovePostClick = (postId: string) => {
    approvePost({ id, postId }).then((response) => {
      const status = response.status
      if (status === 200) {
        toast.success(t('group.approvePostSuccessful'))
        setRequests(requests.filter((request) => request._id !== postId))
      } else {
        toast.error(t('group.approvePostFailed'))
      }
    })
  }

  const handleRejectPostClick = (postId: string) => {
    rejectPost({ id, postId }).then((response) => {
      const status = response.status
      if (status === 200) {
        toast.success(t('group.rejectPostSuccessful'))
        setRequests(requests.filter((request) => request._id !== postId))
      } else {
        toast.error(t('group.rejectPostFailed'))
      }
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

  useEffect(() => {
    getGroupPosts({ id, postStatus: 'pending' }).then((response) => {
      const status = response.status
      if (status === 200) {
        setRequests(Array.isArray(response.data.data) ? response.data.data : [response.data.data])
      }
    })
  }, [id])

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
    <div className='lg:flex gap-4'>
      {posts && posts.length === 0 ? (
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
      ) : (
        <div className='flex flex-col space-y-4 flex-1'>
          {posts?.map((item: PostProps) => (
            <Post
              key={item._id}
              post={item}
              details={false}
              ownerMode={canEdit}
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
      {canEdit && (
        <div className='lg:w-1/3 border rounded-md p-2'>
          <h2 className='font-semibold'>{t('group.requests')}</h2>
          {requests.length > 0 ? (
            <ScrollArea className='h-screen'>
              {requests.map((post: PostProps) => (
                <div className='flex items-center justify-start gap-2'>
                  <Avatar>
                    <AvatarImage src={post.ownerAvatar} />
                    <AvatarFallback />
                  </Avatar>
                  <div className='flex-1 ml-2'>
                    <p className='font-semibold line-clamp-1'>{post.title}</p>
                    <Link to={paths.profile.replace(':id', post.ownerId)} className='text-xs line-clamp-1'>
                      {post.ownerName ? post.ownerName : post.ownerEmail}
                    </Link>
                    <p className='text-xs text-gray-500 line-clamp-1'>
                      {' '}
                      {t('post.createdAt') + ` ${convertISODateToLocaleString(post.createdAt)}`}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='h-10 outline-none flex justify-center items-center border rounded-full p-1'>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleApprovePostClick(post._id ?? '')}>
                        {t('action.approve')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRejectPostClick(post._id ?? '')}>
                        {t('action.reject')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p>{t('group.noRequest')}</p>
          )}
        </div>
      )}
    </div>
  )
}
