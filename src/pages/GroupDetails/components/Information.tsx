import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { GroupProps } from '@/types/group.type'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Link } from 'react-router-dom'
import paths from '@/constants/paths'

export default function Information({ group }: { group: GroupProps | null }) {
  const { t } = useTranslation()

  if (!group)
    return (
      <div className='flex flex-col space-y-3'>
        <Skeleton className='w-full h-64 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-4/5' />
        </div>
      </div>
    )

  return (
    <div className='block lg:flex justify-between items-start gap-4'>
      <div className='lg:w-1/3 w-full'>
        <div className='border rounded-md text-center px-4 py-12'>
          <Avatar className='md:w-32 md:h-32 w-24 h-24 border m-auto'>
            <AvatarImage src={group?.avatarImg} />
            <AvatarFallback />
          </Avatar>
          <p className='md:text-2xl text-lg font-bold mt-4'>{group?.name ?? t('group.noName')}</p>
          <p className='text-base text-gray-500'>
            {t(group?.isPrivate ? t('group.privateGroup') : t('group.publicGroup'))}
          </p>
          <div className='flex justify-center items-center text-sm mt-12'>
            <div className='px-4'>
              <p>{group?.postsCount ?? 0}</p>
              <p className='text-gray-500'>{t('group.posts')}</p>
            </div>
            <div className='border-l px-4'>
              <p>{group?.membersCount ?? 0}</p>
              <p className='text-gray-500'>{t('group.members')}</p>
            </div>
          </div>
        </div>
        <div className='border rounded-md p-4 mt-4'>
          <p className='text-xl font-bold'>{t('group.description')}</p>
          <p className='mt-2'>{group?.description ?? t('group.noDescription')}</p>
        </div>
      </div>
      <div className='lg:w-2/3 w-full'>
        <div className='border rounded-md p-4 mt-4 lg:mt-0'>
          <p className='text-lg font-bold'>{t('group.owner')}</p>
          <div className='flex items-center'>
            <Avatar className='w-12 h-12'>
              <AvatarImage src={group?.ownerAvatar} />
              <AvatarFallback />
            </Avatar>
            <div className='ml-4'>
              <p>{group?.ownerName ? group?.ownerName : group?.ownerEmail}</p>
              <p className='text-sm text-gray-500'>{group?.ownerRank ? group?.ownerRank : t('myAccount.noRank')}</p>
            </div>
          </div>
          <p className='text-lg font-bold mt-4'>{t('group.moderators')}</p>
          {group?.moderators?.length === 0 ? (
            <p>{t('group.noModerator')}</p>
          ) : (
            <div className='flex flex-wrap items-center gap-4 mt-2'>
              {group?.moderators?.map((moderator) => (
                <HoverCard key={moderator.userId}>
                  <HoverCardTrigger>
                    <Avatar className='w-12 h-12'>
                      <AvatarImage src={moderator.userAvatar} />
                      <AvatarFallback />
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className='flex items-center'>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={moderator.userAvatar} />
                        <AvatarFallback />
                      </Avatar>
                      <div className='ml-4'>
                        <Link to={paths.profile.replace(':id', moderator.userId)}>{moderator.userName}</Link>
                        <p className='text-sm text-gray-500'>
                          {moderator.userRank ? moderator.userRank : t('myAccount.noRank')}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )}
          <p className='text-lg font-bold mt-4'>{t('group.members')}</p>
          {group?.members?.length === 0 ? (
            <p>{t('group.noMember')}</p>
          ) : (
            <div className='flex flex-wrap items-center gap-4 mt-2'>
              {group?.members?.map((member) => (
                <HoverCard key={member.userId}>
                  <HoverCardTrigger>
                    <Avatar className='w-12 h-12'>
                      <AvatarImage src={member.userAvatar} />
                      <AvatarFallback />
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className='flex items-center'>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={member.userAvatar} />
                        <AvatarFallback />
                      </Avatar>
                      <div className='ml-4'>
                        <Link to={paths.profile.replace(':id', member.userId)}>{member.userName}</Link>
                        <p className='text-sm text-gray-500'>
                          {member.userRank ? member.userRank : t('myAccount.noRank')}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
