import { getUser } from '@/apis/user.api'
import { AppContext } from '@/contexts/app.context'
import { Friend } from '@/types/user.type'
import { Fragment, useContext, useEffect, useState } from 'react'
import Item from './components/Item'
import { Skeleton } from '../ui/skeleton'
import { useTranslation } from 'react-i18next'

export default function FriendsSuggestion() {
  const { userId } = useContext(AppContext)
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  useEffect(() => {
    getUser({ userId: userId ?? '', page: 1, limit: 10 })
      .then((res) => {
        if (Array.isArray(res?.data?.data)) {
          setFriends(res?.data?.data?.map((friend: Friend) => ({ ...friend, canAddFriend: true })))
        } else {
          setFriends([])
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className='border rounded-md p-2 space-y-2'>
      {isLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-[125px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      ) : friends.length > 0 ? (
        friends.map((friend) => (
          <Fragment key={friend._id}>
            <Item friend={friend} setFriends={setFriends} />
            <hr />
          </Fragment>
        ))
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
          <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('friend.noUserFound')}</h2>
          <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
        </div>
      )}
    </div>
  )
}
