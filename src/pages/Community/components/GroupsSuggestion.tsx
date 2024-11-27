import { getGroups, requestToJoin } from '@/apis/group.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import { GroupProps } from '@/types/group.type'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function GroupsSuggestion() {
  const { t } = useTranslation()
  const [suggestions, setSuggestions] = useState<GroupProps[]>([])
  const { userId } = useContext(AppContext)

  const handleJoinGroup = (id: string, isPrivate: boolean) => {
    requestToJoin({ id, userId }).then((response) => {
      const status = response.status
      if (status === 200) {
        if (isPrivate) {
          toast.success(t('group.haveSendJoinRequest'))
        } else {
          toast.success(t('group.haveJoinedGroup'))
        }
        setSuggestions(suggestions.filter((group) => group._id !== id))
      }
    })
  }

  useEffect(() => {
    getGroups({ getList: true, userId }).then((response) => {
      const status = response.status
      if (status === 200) {
        setSuggestions(Array.isArray(response.data.data) ? response.data.data : [response.data.data])
      }
    })
  }, [])

  return (
    <div className='rounded-md border p-2'>
      <p className='font-semibold'>{t('community.suggestions')}</p>
      {suggestions.length === 0 ? (
        <p>{t('community.noGroupSuggested')}</p>
      ) : (
        suggestions.map((group) => (
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
                <Button onClick={() => handleJoinGroup(group._id ?? '', group.isPrivate)} className='mt-2 float-right'>
                  {t('group.join')}
                </Button>
              </div>
            </div>
            <hr />
          </Fragment>
        ))
      )}
    </div>
  )
}
