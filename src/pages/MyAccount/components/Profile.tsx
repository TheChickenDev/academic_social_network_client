import { Mail, Phone, CalendarDays, MapPinHouse, BriefcaseBusiness, GraduationCap, BookHeart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from 'react-i18next'
import { User, UserProfileData } from '@/types/user.type'
import { Skeleton } from '@/components/ui/skeleton'

export default function Profile({ user }: { user: (User & UserProfileData) | null }) {
  const { t } = useTranslation()

  if (!user)
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
            <AvatarImage src={user.avatarImg} />
            <AvatarFallback />
          </Avatar>
          <p className='md:text-2xl text-lg font-bold mt-4'>{user.fullName}</p>
          <p className='text-base text-gray-500'>{t(user.rank ? user.rank : 'myAccount.noRank')}</p>
          <div className='flex justify-center items-center text-sm mt-12'>
            <div className='px-4'>
              <p>{user.posts?.length ?? 0}</p>
              <p className='text-gray-500'>{t('myAccount.posts')}</p>
            </div>
            <div className='border-x px-4'>
              <p>{user.friends?.length ?? 0}</p>
              <p className='text-gray-500'>{t('myAccount.friends')}</p>
            </div>
            <div className='px-4'>
              <p>{user.points}</p>
              <p className='text-gray-500'>{t('myAccount.points')}</p>
            </div>
          </div>
        </div>
        <div className='border rounded-md p-4 mt-4'>
          <p className='text-lg font-bold'>{t('myAccount.generalInformation')}</p>
          <div className='flex gap-2 mt-4'>
            <Mail />
            <p>{user.email ?? t('myAccount.noEmail')}</p>
          </div>
          <div className='flex gap-2 mt-4'>
            <Phone />
            <p>{user.introduction?.contact?.phone ?? t('myAccount.noPhoneNumber')}</p>
          </div>
          <div className='flex gap-2 mt-4'>
            <BookHeart />
            <p>{user.gender ?? t('myAccount.noGender')}</p>
          </div>
          <div className='flex gap-2 mt-4'>
            <CalendarDays />
            <p>
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-GB') : t('myAccount.noDateOfBirth')}
            </p>
          </div>
          <div className='flex gap-2 mt-4'>
            <MapPinHouse />
            <p>{user.introduction?.address ?? t('myAccount.noAddress')}</p>
          </div>
        </div>
        <div className='border rounded-md p-4 mt-4'>
          <p className='text-lg font-bold'>{t('myAccount.education')}</p>
          {user.introduction?.educations?.length > 0 ? (
            user.introduction.educations.map((education, index) => (
              <div className='mt-4' key={index}>
                <div className='flex gap-2'>
                  <GraduationCap />
                  <p>{education.schoolName}</p>
                </div>
                <div className='mt-1 text-gray-500'>
                  <span>{education.fromDate ? new Date(education.fromDate).toLocaleDateString('en-GB') : ''}</span> -{' '}
                  <span>
                    {education.untilNow
                      ? t('myAccount.untilNow')
                      : education.toDate
                        ? new Date(education.toDate).toLocaleDateString('en-GB')
                        : ''}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>{t('myAccount.noEducation')}</p>
          )}
        </div>
      </div>
      <div className='lg:w-2/3 w-full'>
        <div className='border rounded-md p-4 mt-4 lg:mt-0'>
          <p className='text-xl font-bold'>{t('myAccount.aboutMe')}</p>
          <p className='mt-2'>{user.description ?? t('myAccount.noAboutMe')}</p>
        </div>
        <div className='border rounded-md p-4 mt-4'>
          <p className='text-lg font-bold'>{t('myAccount.work')}</p>
          {user?.introduction?.jobs?.length > 0 ? (
            user.introduction.jobs.map((work, index) => (
              <div className='mt-4' key={index}>
                <div>
                  <div className='flex gap-2'>
                    <BriefcaseBusiness />
                    <p>{work.company}</p>
                  </div>
                  <p className='mt-1'>{work.profession}</p>
                  <div className='mt-1 text-gray-500'>
                    <span>{work.fromDate ? new Date(work.fromDate).toLocaleDateString('en-GB') : ''}</span> -{' '}
                    <span>
                      {work.untilNow
                        ? t('myAccount.untilNow')
                        : work.toDate
                          ? new Date(work.toDate).toLocaleDateString('en-GB')
                          : ''}
                    </span>
                  </div>
                  <p className='mt-1'>{work.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>{t('myAccount.noWork')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
