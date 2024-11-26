import {
  acceptJoinRequest,
  appointModerator,
  dismissalModerator,
  getMembers,
  rejectJoinRequest,
  removeMember
} from '@/apis/group.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import { GroupMemberProps, GroupProps } from '@/types/group.type'
import { convertISODateToLocaleString } from '@/utils/utils'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import { addFriend } from '@/apis/user.api'
import { toast } from 'sonner'

interface MembersProps {
  groupDetails: GroupProps | null
}

export default function Members({ groupDetails }: MembersProps) {
  const { t } = useTranslation()
  const [members, setMembers] = useState<GroupMemberProps[]>([])
  const { id } = useParams<{ id: string }>()
  const { userId } = useContext(AppContext)

  useEffect(() => {
    getMembers({ id, memberId: userId }).then((response) => {
      const status = response.status
      if (status === 200) {
        setMembers(Array.isArray(response.data.data) ? response.data.data : [response.data.data])
      }
    })
  }, [])

  const handleAcceptRequest = (memberId: string) => {
    acceptJoinRequest({ id, memberId }).then((response) => {
      const status = response.status
      if (status === 200) {
        setMembers(
          members.map((member) => {
            if (member.userId === memberId) {
              member.role = 'member'
              member.joinDate = response.data.data.joinDate
            }
            return member
          })
        )
      }
    })
  }

  const handleRejectRequest = (memberId: string) => {
    rejectJoinRequest({ id, memberId }).then((response) => {
      const status = response.status
      if (status === 200) {
        setMembers(members.filter((member) => member.userId !== memberId))
      }
    })
  }

  const handleAddFriendClick = (friendId: string) => {
    addFriend({ _id: userId ?? '', friendId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        toast.success(t('friend.haveSendFriendRequest'))
        setMembers((prev) =>
          prev.map((f) => {
            if (f.userId === friendId) {
              return { ...f, canAddFriend: false }
            }
            return f
          })
        )
      }
    })
  }

  const handleKickClick = (memberId: string) => {
    removeMember({ id, memberId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        setMembers(members.filter((member) => member.userId !== memberId))
      }
    })
  }

  const handleDismissalClick = (memberId: string) => {
    dismissalModerator({ id, memberId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        setMembers(
          members.map((member) => {
            if (member.userId === memberId) {
              member.role = 'member'
            }
            return member
          })
        )
      }
    })
  }

  const handleAppointClick = (memberId: string) => {
    appointModerator({ id, memberId }).then((response) => {
      const status = response.status
      if (status === 200) {
        setMembers(
          members.map((member) => {
            if (member.userId === memberId) {
              member.role = 'moderator'
            }
            return member
          })
        )
      }
    })
  }

  return (
    <div className='lg:flex block gap-4'>
      <div className='flex-1'>
        <div className='border rounded-md p-2 h-fit'>
          <p className='font-semibold'>{t('group.moderators')}</p>
          {members.length === 0 ? (
            <p>{t('group.noModerator')}</p>
          ) : (
            <ScrollArea className='space-y-2 h-72'>
              {members.map(
                (member) =>
                  member.role === 'moderator' && (
                    <div key={member.userId} className='flex items-center m-2'>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={member.userAvatar} />
                        <AvatarFallback />
                      </Avatar>
                      <div className='flex-1 ml-4'>
                        <Link to={paths.profile.replace(':id', member.userId)}>{member.userName}</Link>
                        <p className='text-sm text-gray-500'>
                          {member.userRank ? member.userRank : t('myAccount.noRank')}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {`${t('group.joinedAt')} ${convertISODateToLocaleString(member.joinDate.toString())}`}
                        </p>
                      </div>
                      {groupDetails?.canEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className='h-10 outline-none flex justify-center items-center border rounded-full p-1'>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {member.canAddFriend && (
                              <DropdownMenuItem onClick={() => handleAddFriendClick(member.userId)}>
                                {t('action.addFriend')}
                              </DropdownMenuItem>
                            )}
                            {groupDetails.ownerId === userId && (
                              <>
                                <DropdownMenuItem onClick={() => handleDismissalClick(member.userId)}>
                                  {t('action.dismissal')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleKickClick(member.userId)}>
                                  {t('action.kick')}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )
              )}
            </ScrollArea>
          )}
        </div>
        <div className='border rounded-md p-2 mt-4 h-fit'>
          <p className='font-semibold'>{t('group.members')}</p>
          {members.length === 0 ? (
            <p>{t('group.noMember')}</p>
          ) : (
            <ScrollArea className='space-y-2 h-screen'>
              {members.map(
                (member) =>
                  member.role === 'member' && (
                    <div key={member.userId} className='flex items-center m-2'>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={member.userAvatar} />
                        <AvatarFallback />
                      </Avatar>
                      <div className='flex-1 ml-4'>
                        <Link to={paths.profile.replace(':id', member.userId)}>{member.userName}</Link>
                        <p className='text-sm text-gray-500'>
                          {member.userRank ? member.userRank : t('myAccount.noRank')}
                        </p>

                        <p className='text-sm text-gray-500'>
                          {`${t('group.joinedAt')} ${convertISODateToLocaleString(member.joinDate.toString())}`}
                        </p>
                      </div>
                      {groupDetails?.canEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className='h-10 outline-none flex justify-center items-center border rounded-full p-1'>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {member.canAddFriend && (
                              <DropdownMenuItem onClick={() => handleAddFriendClick(member.userId)}>
                                {t('action.addFriend')}
                              </DropdownMenuItem>
                            )}
                            {groupDetails.ownerId === userId && (
                              <DropdownMenuItem onClick={() => handleAppointClick(member.userId)}>
                                {t('action.appoint')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleKickClick(member.userId)}>
                              {t('action.kick')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )
              )}
            </ScrollArea>
          )}
        </div>
      </div>
      {groupDetails?.isPrivate && userId === groupDetails.ownerId && (
        <div className='border rounded-md p-2 lg:mt-0 mt-4 lg:w-1/3 h-fit'>
          <p className='font-semibold'>{t('group.requests')}</p>
          {members.length === 0 ? (
            <p>{t('group.noRequests')}</p>
          ) : (
            <ScrollArea className='space-y-2 h-screen'>
              {members.map(
                (member) =>
                  member.role === 'pending' && (
                    <div key={member.userId} className='flex gap-4 m-2'>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={member.userAvatar} />
                        <AvatarFallback />
                      </Avatar>
                      <div className='flex-1'>
                        <Link to={paths.profile.replace(':id', member.userId)} className='w-full line-clamp-1'>
                          {member.userName}
                        </Link>
                        <p className='text-sm text-gray-500'>
                          {member.userRank ? member.userRank : t('myAccount.noRank')}
                        </p>
                      </div>
                      {groupDetails?.canEdit && (
                        <>
                          <Button variant='outline' size='sm' onClick={() => handleRejectRequest(member.userId ?? '')}>
                            {t('action.reject')}
                          </Button>
                          <Button size='sm' onClick={() => handleAcceptRequest(member.userId ?? '')}>
                            {t('action.accept')}
                          </Button>
                        </>
                      )}
                    </div>
                  )
              )}
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  )
}
