import { Notification } from '@/types/utils.type'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import paths from '@/constants/paths'
import { getNotifications } from '@/apis/notification.api'
import { AppContext } from '@/contexts/app.context'
import { getSocket, initializeSocket } from '@/utils/socket'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()
  const { userId } = useContext(AppContext)

  useEffect(() => {
    getNotifications({ userId: userId ?? '' })
      .then((res) => {
        setNotifications(res?.data?.data)
      })
      .finally(() => {
        setIsLoading(false)
        let socket = getSocket()
        if (!socket && userId) {
          socket = initializeSocket(userId)
        }
        if (userId && socket) {
          socket.on('notify', (response) => {
            const notification: Notification = response
            if (!notification) {
              return
            }

            setNotifications((prev) => [notification, ...prev])
            toast(
              <div>
                <Link to={paths.profile.replace(':id', notification?.userId ?? '')} className='font-bold'>
                  {notification?.userName}
                </Link>
                <span>{t(`notifications.${notification?.type}`)}</span>
                {notification?.groupName && (
                  <Link to={paths.groupDetails.replace(':id', notification?.groupId ?? '')} className='font-bold'>
                    {notification?.groupName}
                  </Link>
                )}
              </div>
            )
          })

          return () => {
            socket.off('notify')
          }
        }
      })
  }, [])

  return (
    <div className='w-full'>
      <div className='w-full rounded-lg m-auto'>
        <p className='text-2xl font-bold'>{t('pages.notifications')}</p>

        {isLoading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <div key={index} className='flex gap-2 w-full mt-2'>
                <Skeleton className='w-12 h-12 rounded-full' />
                <Skeleton className='w-full h-12' />
              </div>
            ))}
          </>
        ) : notifications?.length === 0 ? (
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
            <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('notifications.noNotification')}</h2>
            <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div className={'flex gap-2 py-2'}>
              <Avatar>
                <AvatarImage src={notification?.avatarImg} />
                <AvatarFallback />
              </Avatar>
              <div className='ml-2 flex-1'>
                <Link to={paths.profile.replace(':id', notification?.userId ?? '')} className='font-bold'>
                  {notification?.userName}
                </Link>
                <span>{t(`notifications.${notification?.type}`)}</span>
                {notification?.groupName && (
                  <Link to={paths.groupDetails.replace(':id', notification?.groupId ?? '')} className='font-bold'>
                    {notification?.groupName}
                  </Link>
                )}
                <p className='text-sm text-gray-500'>{notification?.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
