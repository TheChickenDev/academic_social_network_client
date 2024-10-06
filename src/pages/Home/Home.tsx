import { useTranslation } from 'react-i18next'
import Search from './components/Search'
import PopularTags from './components/PopularTags'
import TodayQuestions from './components/TodayQuestions'
import Posts from '@/components/Posts'
import Introduction from './components/Introduction'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className='container h-fit mx-auto px-4 md:px-6 lg:px-8 bg-background-light dark:bg-black'>
      <div className='flex justify-between items-start gap-4 px-4 py-28 md:px-6'>
        <div className='flex-initial w-1/4'>
          <Search />
          <PopularTags />
          <TodayQuestions />
        </div>
        <div className='flex-initial w-1/2 border bg-white'>
          <Posts />
        </div>
        <div className='flex-initial w-1/4'>
          <Introduction />
        </div>
      </div>
    </div>
  )
}
