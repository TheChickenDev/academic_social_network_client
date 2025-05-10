import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { ContestProps } from '@/types/contest.type'
import { getContests } from '@/apis/contest.api'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Problem from './components/Problem'
import { isExpiredDate } from '@/utils/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Trophy } from 'lucide-react'

export default function Contest() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contest, setContest] = useState<ContestProps>()
  const { id: contestId } = useParams()

  const [openContest, setOpenContest] = useState<boolean>(false)
  const [openRanking, setOpenRanking] = useState<boolean>(false)
  const [ranking, setRanking] = useState<{
    userId: string
    score: number
    userName: string
  }>()

  useEffect(() => {
    setIsLoading(true)
    getContests({ contestId })
      .then((res) => {
        console.log(res.data.data)
        setContest(Array.isArray(res.data.data) ? res.data.data[0] : res.data.data)
      })
      .catch((err) => {
        console.error('Error fetching contest:', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [contestId])

  return (
    <>
      <Helmet>
        <title>{t('pages.contest')}</title>
      </Helmet>
      {isLoading && <Loading />}
      <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-light-primary dark:bg-dark-primary'>
        {openContest ? (
          <Problem problemIds={contest?.problems?.map((p) => p.problemId).filter((id): id is string => !!id) || []} />
        ) : (
          <div className='container mx-auto'>
            <div className='flex flex-col items-center justify-center min-h-screen'>
              <h1 className='text-3xl font-bold text-center'>{contest?.title}</h1>
              <p className='mt-4 text-lg text-center'>{contest?.description}</p>
              <div className='my-6'>
                <p>
                  {t('admin.contest.startDate')}:{' '}
                  {contest?.startDate ? new Date(contest.startDate).toLocaleString() : 'N/A'}
                </p>
                <p>
                  {t('admin.contest.endDate')}: {contest?.endDate ? new Date(contest.endDate).toLocaleString() : 'N/A'}
                </p>
              </div>
              {isExpiredDate(new Date(contest?.endDate || '')) ? (
                <Dialog open={openRanking} onOpenChange={setOpenRanking}>
                  <DialogTrigger asChild>
                    <Button>{t('admin.contest.ranking')}</Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[475px]'>
                    <DialogHeader>
                      <DialogTitle>
                        <Trophy size='48px' />
                      </DialogTitle>
                      <DialogDescription>{t('admin.contest.rankingDescription')}</DialogDescription>
                    </DialogHeader>
                    <div>hello world</div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button onClick={() => setOpenContest(true)}>{t('action.joinContest')}</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
