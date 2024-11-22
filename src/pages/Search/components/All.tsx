import { requestToJoin } from '@/apis/group.api'
import { search } from '@/apis/search.api'
import { addFriend } from '@/apis/user.api'
import Post from '@/components/Post'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import { PostProps } from '@/types/post.type'
import { Friend } from '@/types/user.type'
import { SearchAllData, SearchQueryParams } from '@/types/utils.type'
import { t } from 'i18next'
import { Dispatch, Fragment, SetStateAction, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function All({ q, type, filter }: SearchQueryParams) {
  const [data, setData] = useState<SearchAllData | null>(null)
  const { email } = useContext(AppContext)

  useEffect(() => {
    search({ q, type, filter, email: email ?? '' }).then((response) => {
      const status = response.status
      if (status === 200) {
        if (!Array.isArray(response.data.data)) {
          setData({
            posts: response.data.data.posts,
            users: response.data.data.users.map((friend: Friend) => ({ ...friend, canAddFriend: true })),
            groups: response.data.data.groups
          })
        }
      }
    })
  }, [q, type])

  const handleJoinGroup = (id: string, isPrivate: boolean) => {
    requestToJoin({ id, userEmail: email }).then((response) => {
      const status = response.status
      if (status === 200) {
        if (isPrivate) {
          toast.success(t('group.haveSendJoinRequest'))
        } else {
          toast.success(t('group.haveJoinedGroup'))
        }
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            groups: prev.groups?.filter((g) => g._id !== id)
          }
        })
      }
    })
  }

  return (
    <div>
      <ScrollArea className='h-[50vh] border rounded-md '>
        <div className='p-2 space-y-2'>
          <p className='font-semibold text-lg'>{t('search.users')}</p>
          {data?.users?.length && data.users.length > 0 ? (
            data.users.map((friend) => (
              <Fragment key={friend.email}>
                <Item friend={friend} setData={setData} />
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
              <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('noData')}</h2>
              <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <ScrollArea className='h-[50vh] border rounded-md mt-4'>
        <div className='p-2 space-y-2'>
          <p className='font-semibold'>{t('search.groups')}</p>
          {data?.groups?.length && data.groups.length > 0 ? (
            data.groups.map((group) => (
              <Fragment key={group._id}>
                <div className='flex gap-4 mt-2'>
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
                    <Button
                      onClick={() => handleJoinGroup(group._id ?? '', group.isPrivate)}
                      className='mt-2 float-right'
                    >
                      {t('group.join')}
                    </Button>
                  </div>
                </div>
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
              <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('noData')}</h2>
              <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className='flex flex-col space-y-4 mt-4'>
        {data?.posts?.map((item: PostProps) => <Post key={item._id} post={item} details={false} />)}
      </div>
    </div>
  )
}

interface ItemProps {
  friend: Friend
  setData: Dispatch<SetStateAction<SearchAllData | null>>
}

function Item({ friend, setData }: ItemProps) {
  const { email } = useContext(AppContext)
  const { t } = useTranslation()

  const handleAddFriendClick = () => {
    addFriend({ email: email ?? '', friendEmail: friend.email }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveSendFriendRequest'))
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            users: prev.users?.map((f) => {
              if (f.email === friend.email) {
                return { ...f, canAddFriend: false }
              }
              return f
            })
          }
        })
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
        <p className='font-semibold'>{friend?.fullName ?? t('friend.friendVirtualName')}</p>
        <p className='text-sm text-gray-500'>{friend?.rank ? friend.rank : t('myAccount.noRank')}</p>
        {friend?.canAddFriend ? (
          <Button onClick={handleAddFriendClick} className='mt-2 float-right'>
            {t('action.addFriend')}
          </Button>
        ) : (
          <p>{t('friend.haveSendFriendRequest')}</p>
        )}
      </div>
    </div>
  )
}
