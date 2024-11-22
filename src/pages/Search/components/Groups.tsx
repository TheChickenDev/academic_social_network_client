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

export default function Groups({ q, type, filter, email }: SearchQueryParams) {
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
        email
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
    requestToJoin({ id, userEmail: email }).then((response) => {
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
      {data?.pages?.map((page) =>
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
