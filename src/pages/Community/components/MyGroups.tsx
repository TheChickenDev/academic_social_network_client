import { getGroups } from '@/apis/group.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import { GroupProps } from '@/types/group.type'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function MyGroups() {
  const { t } = useTranslation()
  const [myGroups, setMyGroups] = useState<GroupProps[]>([])
  const [joinedGroups, setJoinedGroups] = useState<GroupProps[]>([])
  const { email } = useContext(AppContext)

  useEffect(() => {
    getGroups({ ownerEmail: email }).then((response) => {
      const status = response.status
      if (status === 200) {
        setMyGroups(Array.isArray(response.data.data) ? response.data.data : [response.data.data])
      }
    })

    getGroups({ memberEmail: email, getList: true }).then((response) => {
      const status = response.status
      if (status === 200) {
        setJoinedGroups(Array.isArray(response.data.data) ? response.data.data : [response.data.data])
      }
    })
  }, [])

  return (
    <div>
      <div className='border rounded-md p-2'>
        <p className='font-semibold'>{t('community.myGroups')}</p>
        {myGroups.length === 0 ? (
          <p>{t('community.noGroupOwned')}</p>
        ) : (
          myGroups.map((group) => (
            <div key={group._id} className='flex gap-4 mt-2'>
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
              </div>
            </div>
          ))
        )}
      </div>
      <ScrollArea className='h-96 p-2 mt-4 rounded-md border'>
        <p className='font-semibold'>{t('community.joinedGroups')}</p>
        {joinedGroups.length === 0 ? (
          <p>{t('community.noGroupJoined')}</p>
        ) : (
          joinedGroups.map((group) => (
            <div key={group._id} className='flex gap-4 mt-2'>
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
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  )
}
