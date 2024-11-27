import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useCallback, Fragment } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { postDefaultQuery } from '@/constants/post'
import { SearchQueryParams } from '@/types/utils.type'
import { search } from '@/apis/search.api'
import { User } from '@/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import paths from '@/constants/paths'
import { GroupProps } from '@/types/group.type'
import { requestToJoin } from '@/apis/group.api'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export default function Groups({ q, type, filter, userId }: SearchQueryParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery<
    (GroupProps & { canJoin: boolean })[]
  >({
    queryKey: ['searchGroups'],
    queryFn: async ({ pageParam = postDefaultQuery.page }) => {
      const response = await search({
        page: pageParam as number,
        limit: postDefaultQuery.limit,
        q,
        type,
        filter,
        userId
      })
      return response.data.data as (GroupProps & { canJoin: boolean })[]
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

  const handleJoinGroup = (id: string, isPrivate: boolean) => {
    requestToJoin({ id, userId }).then((response) => {
      const status = response.status
      if (status === 200) {
        if (isPrivate) {
          toast.success(t('group.haveSendJoinRequest'))
        } else {
          toast.success(t('group.haveJoinedGroup'))
        }
        queryClient.setQueryData(['searchGroups'], (oldData: InfiniteData<User[], unknown>) => {
          if (!oldData) return
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return page.map((item) => {
                if (item._id === id) {
                  return { ...item, canJoin: false }
                }
                return item
              })
            })
          }
        })
      }
    })
  }

  if (isLoading || isError) {
    return (
      <div className='flex flex-col space-y-3'>
        <Skeleton className='w-full h-16 rounded-xl' />
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
        data?.pages?.map((page) =>
          page?.map((group: GroupProps) => (
            <Fragment>
              <Fragment key={group._id}>
                <div className='flex gap-4 my-2'>
                  <Avatar className='w-12 h-12 rounded-lg'>
                    <AvatarImage src={group?.avatarImg} />
                    <AvatarFallback isGroupAvatar={true} />
                  </Avatar>
                  <div className='w-full'>
                    <Link to={paths.groupDetails.replace(':id', group._id ?? '')} className='font-semibold'>
                      {group?.name}
                    </Link>
                    <p className='text-sm text-gray-500'>
                      {t(group?.isPrivate ? t('group.privateGroup') : t('group.publicGroup'))}
                    </p>
                    {group.canJoin ? (
                      <Button
                        onClick={() => handleJoinGroup(group._id ?? '', group.isPrivate)}
                        className='mt-2 float-right'
                      >
                        {t('group.join')}
                      </Button>
                    ) : (
                      <p className='text-sm text-gray-500'>{t('search.haveJoinedGroup')}</p>
                    )}
                  </div>
                </div>
                <hr />
              </Fragment>
              <hr />
            </Fragment>
          ))
        )
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
          <Skeleton className='w-full h-16 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-12 w-4/5' />
          </div>
        </div>
      )}
    </div>
  )
}
