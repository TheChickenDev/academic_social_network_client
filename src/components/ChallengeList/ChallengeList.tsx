import { getContests } from '@/apis/contest.api'
import { ContestProps } from '@/types/contest.type'
import { ArrowRight, Clock, Sparkles, ThumbsUp, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { isExpiredDate } from '@/utils/utils'
import { useNavigate } from 'react-router-dom'

export default function ChallengeList() {
  const [contests, setContests] = useState<ContestProps[]>([])
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    getContests({ page: 1, limit: 0 }).then((response) => {
      setContests(response.data.data)
    })
  }, [])

  return (
    <div className='border rounded-md p-2 bg-white dark:bg-dark-secondary'>
      <div>
        <div className='flex items-center gap-2'>
          <Sparkles />
          <span className='font-bold text-xl'>{t('home.challenge')}</span>
        </div>
        <p className='text-sm text-gray-500'>{t('home.challengeDescription')}</p>
      </div>
      <Separator className='mt-4' />
      {contests.length === 0 ? (
        <div className='flex flex-col items-center mt-4'>
          <Trophy className='w-20 h-20 inline-block mr-2' />
          <p className='font-semibold'>{t('home.noChallenge')}</p>
          <p className='text-sm text-gray-500'>{t('home.noChallengeDescription')}</p>
        </div>
      ) : (
        contests
          .filter((contest) => !isExpiredDate(new Date(contest?.endDate || '')))
          .map((contest) => (
            <div key={contest._id} className='py-4 border-b last:border-b-0'>
              <h3 className='font-semibold'>{contest.title}</h3>
              <div className='flex items-center mt-1'>
                <Clock className='w-6 h-6 mr-2' />
                <p className='text-sm text-gray-500'>
                  {t('admin.contest.startDate')}:&nbsp;
                  {contest?.startDate ? new Date(contest.startDate).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className='flex items-center mt-1'>
                <ThumbsUp className='w-6 h-6 mr-2' />
                <p className='text-sm text-gray-500'>
                  {t('admin.contest.endDate')}:&nbsp;
                  {contest?.endDate ? new Date(contest.endDate).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className='flex justify-end mt-2'>
                <Button variant='outline' onClick={() => navigate(`/contest/${contest._id}`)}>
                  {t('home.viewDetails')} <ArrowRight className='ml-2' />
                </Button>
              </div>
            </div>
          ))
      )}
    </div>
  )
}
