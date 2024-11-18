import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import paths from '@/constants/paths'
import MyGroups from './components/MyGroups'
import Posts from './components/Posts'
import GroupsSuggestion from './components/GroupsSuggestion'
import CreateGroupDialog from './components/CreateGroupDialog'

export default function Community() {
  const { t } = useTranslation()
  const [readingFocus, setReadingFocus] = useState<boolean>(false)

  const navigate = useNavigate()

  const handlePostAction = () => {
    navigate(paths.postEditor)
  }

  return (
    <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-light-primary dark:bg-dark-primary'>
      <Helmet>
        <title>{t('pages.community')}</title>
      </Helmet>
      <div className='flex justify-between items-start gap-4 py-28'>
        <div className='md:block hidden w-1/4'>{!readingFocus && <MyGroups />}</div>
        <div className='md:w-1/2 w-full'>
          <div className='hidden md:flex justify-between items-center pb-4'>
            <div className='space-x-2'>
              <Button onClick={handlePostAction}>{t('home.postATopic')}</Button>
              <CreateGroupDialog />
            </div>
            <div className='flex items-center gap-2'>
              <Switch checked={readingFocus} onCheckedChange={setReadingFocus} id='reading-focus-mode' />
              <Label htmlFor='reading-focus-mode'>{t('home.readingFocus')}</Label>
            </div>
          </div>
          <Posts />
        </div>
        <div className='md:block hidden w-1/4'>{!readingFocus && <GroupsSuggestion />}</div>
      </div>
    </div>
  )
}
