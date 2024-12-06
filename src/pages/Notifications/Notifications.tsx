import { Notification } from '@/types/utils.type'
import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import paths from '@/constants/paths'

const list: Notification[] = [
  {
    _id: '1',
    type: 'sendFriendRequest',
    userName: 'Mark Webber',
    avatarImg: 'https://randomuser.me/api/portraits/men/78.jpg',
    userId: '1',
    isRead: false,
    time: '1m ago'
  },
  {
    _id: '2',
    type: 'acceptFriendRequest',
    userName: 'Angela Gray',
    avatarImg: 'https://randomuser.me/api/portraits/men/79.jpg',
    userId: '1',
    isRead: true,
    time: '1m ago'
  },
  {
    _id: '3',
    type: 'rejectFriendRequest',
    userName: 'Jacob Thompson',
    avatarImg: 'https://randomuser.me/api/portraits/men/80.jpg',
    userId: '1',
    isRead: false,
    time: '1m ago'
  },
  {
    _id: '4',
    type: 'unfriend',
    userName: 'Rizky Hasanuddin',
    avatarImg: 'https://randomuser.me/api/portraits/men/81.jpg',
    userId: '1',
    isRead: true,
    time: '1m ago'
  },
  {
    _id: '5',
    type: 'joinGroup',
    userName: 'Kimberly Smith',
    avatarImg: 'https://randomuser.me/api/portraits/men/82.jpg',
    userId: '1',
    isRead: true,
    groupName: 'Chess Club',
    time: '1m ago'
  },
  {
    _id: '6',
    type: 'leaveGroup',
    userName: 'Nathan Peterson',
    avatarImg: 'https://randomuser.me/api/portraits/men/83.jpg',
    userId: '1',
    isRead: false,
    groupName: 'Football Club',
    time: '1m ago'
  },
  {
    _id: '7',
    type: 'createPost',
    userName: 'Anna Kim',
    avatarImg: 'https://randomuser.me/api/portraits/men/84.jpg',
    userId: '1',
    isRead: false,
    time: '1m ago'
  },
  {
    _id: '8',
    type: 'commentPost',
    userName: 'Nathan Peterson',
    avatarImg: 'https://randomuser.me/api/portraits/men/85.jpg',
    userId: '1',
    isRead: false,
    time: '1m ago'
  }
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(list)
  const [newNotificationsCount, setNewNotificationsCount] = useState(notifications.filter((n) => !n.isRead).length)
  const { t } = useTranslation()

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => {
        return { ...notification, isRead: true }
      })
    )
    setNewNotificationsCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => {
        return notification._id === id ? { ...notification, isRead: true } : notification
      })
    )
    setNewNotificationsCount(newNotificationsCount - 1)
  }

  return (
    <div className='w-full py-28'>
      <div className='w-full lg:w-[768px] rounded-lg m-auto'>
        <div className='flex flex-row gap-2'>
          <h1 className='text-2xl font-bold'>{t('pages.notifications')}</h1>
          <a className='bg-red-500 font-bold text-white rounded-lg px-3 my-auto'>{newNotificationsCount}</a>
          <a
            onClick={markAllAsRead}
            className='text-[#868690] m-auto mr-0 cursor-pointer duration-200 hover:text-[#43608c]'
          >
            {t('notifications.markAllAsRead')}
          </a>
        </div>

        {notifications?.map((notification) => (
          <div
            onClick={() => markAsRead(notification?._id)}
            className={classNames('flex gap-2 mt-2 p-4', {
              'bg-[#f6fafd] rounded-lg': !notification?.isRead
            })}
          >
            <Avatar>
              <AvatarImage src={notification?.avatarImg} />
              <AvatarFallback />
            </Avatar>
            <div className='ml-2 flex-1'>
              <a>
                <Link to={paths.profile.replace(':id', notification?.userId ?? '')} className='font-bold'>
                  {notification?.userName}
                </Link>
                <span className=''>{t(`notifications.${notification?.type}`)}</span>
                {notification?.groupName && (
                  <Link to={paths.groupDetails.replace(':id', notification?.groupId ?? '')} className='font-bold'>
                    {notification?.groupName}
                  </Link>
                )}
              </a>
              <p className='text-sm text-gray-500'>{notification?.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
