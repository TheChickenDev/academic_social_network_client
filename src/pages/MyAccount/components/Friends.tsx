import { acceptFriendRequest, getFriends, removeFriend } from '@/apis/user.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AppContext } from '@/contexts/app.context'
import { Friend, User } from '@/types/user.type'
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
import { Link } from 'react-router-dom'
import paths from '@/constants/paths'

export default function Friends({ userDetails }: { userDetails: User | null }) {
  const { userId } = useContext(AppContext)
  const { t } = useTranslation()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendsLoading, setFriendsLoading] = useState<boolean>(true)

  const handleUnfriendClick = (friendId: string) => {
    removeFriend({ _id: userId ?? '', friendId: friendId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveUnfriended'))
        setFriends((prev) => prev.filter((f) => f._id !== friendId))
      }
    })
  }

  useEffect(() => {
    getFriends({ userId: userDetails?._id ?? '', status: 'accepted' })
      .then((response) => {
        setFriends(response.data.data)
      })
      .finally(() => {
        setFriendsLoading(false)
      })
  }, [])
  return (
    <div className='lg:flex justify-between gap-2'>
      <div className='flex-1 lg:w-2/3 w-full border rounded-md p-2'>
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
            <div className='xl:w-1/3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex flex-col items-center p-10'>
                <Avatar className='w-24 h-24'>
                  <AvatarImage src={friend?.avatarImg} />
                  <AvatarFallback />
                </Avatar>
                <Link to={paths.profile.replace(':id', friend._id)} className='font-semibold'>
                  {friend?.fullName ?? t('friend.friendVirtualName')}
                </Link>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {friend.rank ? friend.rank : t('friend.noRank')}
                </span>
                {userDetails?._id === userId && (
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
                          <AlertDialogAction onClick={() => handleUnfriendClick(friend._id)}>
                            {t('action.confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
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
      {userDetails?._id === userId && <FriendsRequests setFriends={setFriends} />}
    </div>
  )
}

function FriendsRequests({ setFriends }: { setFriends: React.Dispatch<React.SetStateAction<Friend[]>> }) {
  const { t } = useTranslation()
  const { userId } = useContext(AppContext)
  const [friendRequests, setFriendRequests] = useState<Friend[]>([])
  const [friendRequestsLoading, setFriendsLoading] = useState<boolean>(true)

  const handleAcceptFriendClick = (friendId: string) => {
    acceptFriendRequest({ _id: userId ?? '', friendId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveAcceptedFriendRequest'))
        setFriendRequests((prev) => prev.filter((f) => f._id !== friendId))
        setFriends((prev) => [...prev, friendRequests.find((f) => f._id === friendId) as Friend])
      }
    })
  }

  const handleRejectFriendClick = (friendId: string) => {
    removeFriend({ _id: userId ?? '', friendId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveRejectedFriendRequest'))
        setFriendRequests((prev) => prev.filter((f) => f._id !== friendId))
      }
    })
  }

  useEffect(() => {
    getFriends({ userId: userId ?? '', status: 'pending' })
      .then((response) => {
        setFriendRequests(response?.data?.data?.map((friend) => ({ ...friend, canAccept: true })))
      })
      .finally(() => {
        setFriendsLoading(false)
      })
  }, [])

  return (
    <div className='lg:w-1/3 w-full border rounded-md p-2 lg:mt-0 mt-4'>
      <p className='font-bold text-lg'>{t('friend.friendRequests')}</p>
      {friendRequestsLoading ? (
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-[125px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      ) : friendRequests.length > 0 ? (
        friendRequests?.map((friend, index) => (
          <>
            <div key={friend._id} className='flex gap-4 border rounded-md p-2'>
              <Avatar className='w-12 h-12'>
                <AvatarImage src={friend?.avatarImg} />
                <AvatarFallback />
              </Avatar>
              <div className='w-full'>
                <Link to={paths.profile.replace(':id', friend._id)} className='font-semibold'>
                  {friend?.fullName ?? t('friend.friendVirtualName')}
                </Link>
                <p className='text-sm text-gray-500'>{friend.rank ? friend.rank : t('friend.noRank')}</p>
                <div className='float-right space-x-2'>
                  <Button size='sm' variant='outline' onClick={() => handleRejectFriendClick(friend._id)}>
                    {t('action.reject')}
                  </Button>
                  <Button size='sm' onClick={() => handleAcceptFriendClick(friend._id)}>
                    {t('action.accept')}
                  </Button>
                </div>
              </div>
            </div>
            {index !== friendRequests.length - 1 && <hr className='my-2' />}
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
