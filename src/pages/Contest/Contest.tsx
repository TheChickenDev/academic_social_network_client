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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Contest() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contest, setContest] = useState<ContestProps>()
  const { id: contestId } = useParams()

  const [openContest, setOpenContest] = useState<boolean>(false)
  const [openRanking, setOpenRanking] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    getContests({ contestId })
      .then((res) => {
        const c = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
        setContest(c)
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {}
                        {t('admin.contest.leaderboard')}
                      </DialogTitle>
                    </DialogHeader>
                    <div>
                      <Separator className='my-2' />
                      <table className='min-w-full divide-y divide-gray-200 text-sm'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th className='px-6 py-3 text-left font-semibold text-gray-700'>No</th>
                            <th className='px-6 py-3 text-left font-semibold text-gray-700'>Contestant</th>
                            <th className='px-6 py-3 text-left font-semibold text-gray-700'>Problems Solved</th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {contest?.participants?.map((participant, index) => (
                            <tr key={participant.userId} className='hover:bg-gray-50'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-4'>
                                  <Avatar className='w-12 h-12'>
                                    <AvatarImage src={participant?.userAvatar} />
                                    <AvatarFallback />
                                  </Avatar>
                                  <div>
                                    <p className='font-semibold text-gray-900'>
                                      {participant?.userName ?? participant?.userEmail}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                      {participant?.userRank ? participant.userRank : t('myAccount.noRank')}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4 font-medium text-center'>
                                {participant.score}/{contest?.problems?.length}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
