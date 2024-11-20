import { acceptFriendRequest, getFriends, removeFriend } from '@/apis/user.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AppContext } from '@/contexts/app.context'
import { Friend } from '@/types/user.type'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

export default function Friends() {
  return (
    <div className='flex justify-between gap-2'>
      <AcceptedFriends />
      <FriendsRequests />
    </div>
  )
}

function AcceptedFriends() {
  const { t } = useTranslation()
  const { email } = useContext(AppContext)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendsLoading, setFriendsLoading] = useState<boolean>(true)

  const handleUnfriendClick = (friendEmail: string) => {
    removeFriend({ email: email ?? '', friendEmail: friendEmail }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveUnfriended'))
        setFriends((prev) => prev.filter((f) => f.email !== friendEmail))
      }
    })
  }

  useEffect(() => {
    getFriends({ email: email ?? '', status: 'accepted' })
      .then((response) => {
        setFriends(response.data.data)
      })
      .finally(() => {
        setFriendsLoading(false)
      })
  }, [])

  return (
    <div className='lg:w-2/3 w-full border rounded-md p-2'>
      <p className='font-bold text-lg'>{t('friend.friends')}</p>
      {friendsLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-[125px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      ) : friends.length > 0 ? (
        friends?.map((friend) => (
          <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex flex-col items-center p-10'>
              <Avatar className='w-24 h-24'>
                <AvatarImage src={friend?.avatarImg} />
                <AvatarFallback />
              </Avatar>
              <p className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
                {friend.fullName ?? friend.email}
              </p>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {friend.rank ? friend.rank : t('friend.noRank')}
              </span>
              <div className='flex mt-4 md:mt-6 gap-2'>
                <Button variant='outline'>{t('action.message')}</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive'>{t('action.unfriend')}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('alertDialog.message')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('alertDialog.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('action.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleUnfriendClick(friend.email)}>
                        {t('action.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))
      ) : (
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
          <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('friend.noFriendFound')}</h2>
          <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
        </div>
      )}
    </div>
  )
}

function FriendsRequests() {
  const { t } = useTranslation()
  const { email } = useContext(AppContext)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendsLoading, setFriendsLoading] = useState<boolean>(true)

  const handleAcceptFriendClick = (friendEmail: string) => {
    acceptFriendRequest({ email: email ?? '', friendEmail: friendEmail }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveAcceptedFriendRequest'))
        setFriends((prev) =>
          prev.map((f) => {
            if (f.email === friendEmail) {
              return { ...f, canAccept: false }
            }
            return f
          })
        )
      }
    })
  }

  const handleRejectFriendClick = (friendEmail: string) => {
    removeFriend({ email: email ?? '', friendEmail: friendEmail }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveRejectedFriendRequest'))
        setFriends((prev) =>
          prev.map((f) => {
            if (f.email === friendEmail) {
              return { ...f, canAccept: false }
            }
            return f
          })
        )
      }
    })
  }

  useEffect(() => {
    getFriends({ email: email ?? '', status: 'pending' })
      .then((response) => {
        setFriends(response?.data?.data?.map((friend) => ({ ...friend, canAccept: true })))
      })
      .finally(() => {
        setFriendsLoading(false)
      })
  }, [])

  return (
    <div className='lg:w-1/3 w-full border rounded-md p-2'>
      <p className='font-bold text-lg'>{t('friend.friendRequests')}</p>
      {friendsLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-[125px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      ) : friends.length > 0 ? (
        friends?.map((friend, index) => (
          <>
            <div key={friend.email} className='flex gap-4 border rounded-md p-2'>
              <Avatar className='w-12 h-12'>
                <AvatarImage src={friend?.avatarImg} />
                <AvatarFallback />
              </Avatar>
              <div className='w-full'>
                <p className='font-semibold'>{friend?.fullName ?? t('friend.friendVirtualName')}</p>
                <p className='text-sm text-gray-500'>{friend.rank ? friend.rank : t('friend.noRank')}</p>
                {friend?.canAccept ? (
                  <div className='float-right space-x-2'>
                    <Button size='sm' variant='outline' onClick={() => handleRejectFriendClick(friend.email)}>
                      {t('action.reject')}
                    </Button>
                    <Button size='sm' onClick={() => handleAcceptFriendClick(friend.email)}>
                      {t('action.accept')}
                    </Button>
                  </div>
                ) : (
                  <p>{t('friend.haveActedFriendRequest')}</p>
                )}
              </div>
            </div>
            {index !== friends.length - 1 && <hr className='my-2' />}
          </>
        ))
      ) : (
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
          <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('friend.noFriendRequest')}</h2>
          <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
        </div>
      )}
    </div>
  )
}
