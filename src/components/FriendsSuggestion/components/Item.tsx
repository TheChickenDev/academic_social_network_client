import { addFriend } from '@/apis/user.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AppContext } from '@/contexts/app.context'
import { Friend } from '@/types/user.type'
import { Dispatch, SetStateAction, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface ItemProps {
  friend: Friend
  setFriends: Dispatch<SetStateAction<Friend[]>>
}

export default function Item({ friend, setFriends }: ItemProps) {
  const { email } = useContext(AppContext)
  const { t } = useTranslation()

  const handleAddFriendClick = () => {
    addFriend({ email: email ?? '', friendEmail: friend.email }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveSendFriendRequest'))
        setFriends((prev) =>
          prev.map((f) => {
            if (f.email === friend.email) {
              return { ...f, canAddFriend: false }
            }
            return f
          })
        )
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
        <p className='text-sm text-gray-500'>{friend?.rank}</p>
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
