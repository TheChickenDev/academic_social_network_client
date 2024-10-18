import Search from './components/Search'
import PopularTags from './components/PopularTags'
import TodayQuestions from './components/TodayQuestions'
import Posts from './components/Posts'
import Introduction from './components/Introduction'
import AskQuestion from './components/AskQuestion'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'

export default function Home() {
  const { t } = useTranslation()
  const [showPreview, setShowPreview] = useState<boolean>(false)

  return (
    <div className='container h-fit mx-auto px-2 md:px-6 lg:px-12 bg-background-light dark:bg-dark-primary'>
      <div className='flex justify-between items-start gap-4 py-28'>
        <div className='flex-initial w-1/4'>
          <Search />
          <PopularTags />
          <TodayQuestions />
        </div>
        <div className='flex-initial w-1/2'>
          <div className='flex justify-between items-center pb-4'>
            <Dialog>
              <DialogTrigger asChild>
                <Button>{t('ask-question')}</Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle>{t('ask-question')}</DialogTitle>
                </DialogHeader>
                <AskQuestion showPreview={showPreview} />
                <DialogFooter>
                  <div className='w-full flex justify-between items-center gap-2'>
                    <Button variant='ghost'>{t('cancel')}</Button>
                    <div className='flex gap-2'>
                      <Button variant='outline' onClick={() => setShowPreview(!showPreview)}>
                        {t(showPreview ? 'edit' : 'preview')}
                      </Button>
                      <Button>{t('post-question')}</Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className='flex items-center gap-2'>
              <Switch id='reading-focus-mode' />
              <Label htmlFor='reading-focus-mode'>{t('reading-focus')}</Label>
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
