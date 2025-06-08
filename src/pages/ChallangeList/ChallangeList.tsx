import { getContests } from '@/apis/contest.api'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { ContestProps } from '@/types/contest.type'
import { ArrowRight, Clock, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function ChallangeList() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contests, setContests] = useState<ContestProps[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    getContests({ page: 1, limit: 0 })
      .then((response) => {
        setContests(response.data.data)
        console.log('Contests fetched:', response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching contests:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('pages.contest')}</title>
      </Helmet>
      {isLoading && <Loading />}
      <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-light-primary dark:bg-dark-primary pt-[88px]'>
        {contests.map((contest) => (
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
        ))}
      </div>
    </>
  )
}
