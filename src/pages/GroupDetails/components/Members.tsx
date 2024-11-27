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
    getMembers({ id, userId }).then((response) => {
      const status = response.status
      if (status === 200) {
        setMembers(Array.isArray(response.data.data) ? response.data.data : [response.data.data])
      }
    })
  }, [])

  const handleAcceptRequest = (memberId: string) => {
    acceptJoinRequest({ id, userId: memberId }).then((response) => {
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
    rejectJoinRequest({ id, userId: memberId }).then((response) => {
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
    removeMember({ id, userId: memberId }).then((response) => {
      const status = response?.status
      if (status === 200) {
        setMembers(members.filter((member) => member.userId !== memberId))
        toast.success(t('group.kickSuccessful'))
      } else {
        toast.error(t('group.kickFailed'))
      }
    })
  }

  const handleDismissalClick = (memberId: string) => {
    dismissalModerator({ id, userId: memberId }).then((response) => {
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
        toast.success(t('group.dismissalSuccessful'))
      } else {
        toast.error(t('group.dismissalFailed'))
      }
    })
  }

  const handleAppointClick = (memberId: string) => {
    appointModerator({ id, userId: memberId }).then((response) => {
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
        toast.success(t('group.appointSuccessful'))
      } else {
        toast.error(t('group.appointFailed'))
      }
    })
  }

  const moderators = members.filter((member) => member.role === 'moderator')
  const membersList = members.filter((member) => member.role === 'member')
  const pendingMembers = members.filter((member) => member.role === 'pending')

  return (
    <div className='lg:flex block gap-4'>
      <div className='flex-1'>
        <div className='border rounded-md p-2 h-fit'>
          <p className='font-semibold'>{t('group.moderators')}</p>
          {moderators.length === 0 ? (
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
              <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('group.noMember')}</h2>
              <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
            </div>
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
                      {groupDetails?.canEdit && member.userId !== userId && (
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
          {membersList.length === 0 ? (
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
              <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('group.noMember')}</h2>
              <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
            </div>
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
                      {groupDetails?.canEdit && member.userId !== userId && (
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
          {pendingMembers.length === 0 ? (
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
              <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('group.noRequest')}</h2>
              <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
            </div>
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
