import Search from './components/Search'
import PopularTags from './components/PopularTags'
import TodayQuestions from './components/TodayPosts'
import Posts from './components/Posts'
import Introduction from './components/Introduction'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const handlePostAction = () => {
    navigate('/post')
  }

  return (
    <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-background-light dark:bg-dark-primary'>
      <div className='flex justify-between items-start gap-4 py-28'>
        <div className='flex-initial w-1/4'>
          <Search />
          <PopularTags />
          <TodayQuestions />
        </div>
        <div className='flex-initial w-1/2'>
          <div className='flex justify-between items-center pb-4'>
            <Button onClick={handlePostAction}>{t('home.postATopic')}</Button>
            <div className='flex items-center gap-2'>
              <Switch id='reading-focus-mode' />
              <Label htmlFor='reading-focus-mode'>{t('home.readingFocus')}</Label>
            </div>
          </div>
          <Posts />
        </div>
        <div className='flex-initial w-1/4'>
          <Introduction />
        </div>
      </div>
    </div>
  )
}
