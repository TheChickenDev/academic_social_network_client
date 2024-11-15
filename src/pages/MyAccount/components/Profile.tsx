import { Mail, Phone, CalendarDays, MapPinHouse, BriefcaseBusiness, GraduationCap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from 'react-i18next'
import { User, UserProfileData } from '@/types/user.type'
import { Skeleton } from '@/components/ui/skeleton'

const workData = [
  {
    _id: 1,
    profession: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    fromDate: new Date('2020-01-01'),
    toDate: new Date('2022-01-01'),
    description: 'Developing and maintaining web applications. Developing and maintaining web applications.',
    isPrivate: false
  },
  {
    _id: 2,
    profession: 'Software Engineer',
    company: 'Tech Solutions Inc. 2',
    fromDate: new Date('2022-02-01'),
    toDate: new Date('2024-01-01'),
    description: 'Developing and maintaining web applications.',
    isPrivate: false
  },
  {
    _id: 3,
    profession: 'Software Engineer',
    company: 'Tech Solutions Inc. 3',
    fromDate: new Date('2024-02-01'),
    toDate: 'until now',
    description: 'Developing and maintaining web applications.',
    isPrivate: false
  }
]

const educationData = [
  {
    _id: 1,
    schoolName: 'Harvard University',
    fromDate: new Date('2015-09-01'),
    toDate: new Date('2019-06-01'),
    isPrivate: false
  },
  {
    _id: 2,
    schoolName: 'Stanford University',
    fromDate: new Date('2010-09-01'),
    toDate: new Date('2014-06-01'),
    isPrivate: false
  },
  {
    _id: 3,
    schoolName: 'MIT',
    fromDate: new Date('2020-09-01'),
    toDate: 'until now',
    isPrivate: true
  }
]

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
            <CalendarDays />
            <p>{user.dateOfBirth?.toLocaleDateString() ?? t('myAccount.noDateOfBirth')}</p>
          </div>
          <div className='flex gap-2 mt-4'>
            <MapPinHouse />
            <p>{'address....'}</p>
          </div>
        </div>
        <div className='border rounded-md p-4 mt-4'>
          <p className='text-lg font-bold'>{t('myAccount.education')}</p>
          {educationData.map((education) => (
            <div className='mt-4' key={education._id}>
              <div className='flex gap-2'>
                <BriefcaseBusiness />
                <p>{education.schoolName}</p>
              </div>
              <div className='mt-1 text-gray-500'>
                <span>{education.fromDate.toLocaleDateString()}</span> -{' '}
                <span>
                  {typeof education.toDate === 'string' ? education.toDate : education.toDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='lg:w-2/3 w-full'>
        <div className='border rounded-md p-4 mt-4 lg:mt-0'>
          <p className='text-xl font-bold'>{t('myAccount.aboutMe')}</p>
          <p className='mt-2'>
            Hi I'm Anna Adame, It will be as simple as Occidental; in fact, it will be Occidental. To an English person,
            it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is
            European languages are members of the same family. You always want to make sure that your fonts work well
            together and try to limit the number of fonts you use to three or less. Experiment and play around with the
            fonts that you already have in the software you’re working with reputable font websites. This may be the
            most commonly encountered tip I received from the designers I spoke with. They highly encourage that you use
            different fonts in one design, but do not over-exaggerate and go overboard.
          </p>
        </div>
        <div className='border rounded-md p-4 mt-4'>
          <p className='text-lg font-bold'>{t('myAccount.work')}</p>
          {workData.map((work) => (
            <div className='mt-4' key={work._id}>
              <div>
                <div className='flex gap-2'>
                  <GraduationCap />
                  <p>{work.company}</p>
                </div>
                <p className='mt-1'>{work.profession}</p>
                <div className='mt-1 text-gray-500'>
                  <span>{work.fromDate.toLocaleDateString()}</span> -{' '}
                  <span>{typeof work.toDate === 'string' ? work.toDate : work.toDate.toLocaleDateString()}</span>
                </div>
                <p className='mt-1'>{work.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
