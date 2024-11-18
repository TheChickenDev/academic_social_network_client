import { getUser } from '@/apis/user.api'
import { AppContext } from '@/contexts/app.context'
import { Friend } from '@/types/user.type'
import { useContext, useEffect, useState } from 'react'
import Item from './components/Item'
import { Skeleton } from '../ui/skeleton'
import { useTranslation } from 'react-i18next'

export default function FriendsSuggestion() {
  const { email } = useContext(AppContext)
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  useEffect(() => {
    getUser({ email: email ?? '', page: 1, limit: 10 })
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
    <div className='border rounded-md bg-white p-2 space-y-2'>
      {isLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-[125px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      ) : friends.length > 0 ? (
        friends.map((friend) => <Item key={friend.email} friend={friend} setFriends={setFriends} />)
      ) : (
        <p>{t('friend.noUserFound')}</p>
      )}
    </div>
  )
}
