import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

const tags = ['reactjs', 'java', 'javascript', 'typescript', 'nodejs', 'css', 'html']

export default function PopularTags() {
  const { t } = useTranslation()
  return (
    <div className='mt-4 p-2 text-sm border outline-none rounded-md bg-white dark:bg-dark-primary'>
      <h2 className='text-xl font-semibold mb-2'>{t('components.popularTags')}</h2>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <Button variant='outline' key={index} size='sm'>
            {tag}
          </Button>
        ))}
      </div>
    </div>
  )
}
