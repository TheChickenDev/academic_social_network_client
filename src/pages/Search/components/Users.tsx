import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useCallback, useContext, Fragment } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { postDefaultQuery } from '@/constants/post'
import { SearchQueryParams } from '@/types/utils.type'
import { search } from '@/apis/search.api'
import { User } from '@/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/app.context'
import { addFriend } from '@/apis/user.api'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import paths from '@/constants/paths'
import { encodeEmailToId } from '@/utils/utils'

export default function Users({ q, type, filter, email }: SearchQueryParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery<User[]>({
    queryKey: ['searchUsers'],
    queryFn: async ({ pageParam = postDefaultQuery.page }) => {
      const response = await search({
        page: pageParam as number,
        limit: postDefaultQuery.limit,
        q,
        type,
        filter,
        email
      })
      return response.data.data as User[]
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

  const setData = (friendEmail: string) => {
    queryClient.setQueryData(['searchUsers'], (oldData: InfiniteData<User[], unknown>) => {
      if (!oldData) return
      return {
        ...oldData,
        pages: oldData.pages.map((page) => {
          return page.map((item) => {
            if (item.email === friendEmail) {
              return { ...item, canAddFriend: false }
            }
            return item
          })
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
        page?.map((item: User) => (
          <Fragment>
            <Item key={item._id} friend={item} setData={setData} />
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

interface ItemProps {
  friend: User
  setData: (friendEmail: string) => void
}

function Item({ friend, setData }: ItemProps) {
  const { email } = useContext(AppContext)
  const { t } = useTranslation()

  const handleAddFriendClick = () => {
    addFriend({ email: email ?? '', friendEmail: friend.email }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveSendFriendRequest'))
        setData(friend.email)
      }
    })
  }

  return (
    <div className='flex gap-4'>
      <Avatar className='w-12 h-12'>
        <AvatarImage src={friend?.avatarImg} />
        <AvatarFallback />
      </Avatar>
      <div className='w-full'>
        <Link to={paths.profile.replace(':id', encodeEmailToId(friend.email))} className='font-semibold'>
          {friend?.fullName ?? t('friend.friendVirtualName')}
        </Link>
        <p className='text-sm text-gray-500'>{friend?.rank ? friend.rank : t('myAccount.noRank')}</p>
        {friend?.canAddFriend ? (
          <Button onClick={handleAddFriendClick} className='mt-2 float-right'>
            {t('action.addFriend')}
          </Button>
        ) : (
          <p>{t('friend.youAreFriends')}</p>
        )}
      </div>
    </div>
  )
}
