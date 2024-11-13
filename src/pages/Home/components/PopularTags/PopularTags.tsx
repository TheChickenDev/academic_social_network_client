import Tag from '@/components/Tag'
import { useTranslation } from 'react-i18next'

const tags = [
  {
    label: 'reactjs',
    value: 'reactjs'
  },
  {
    label: 'java',
    value: 'java'
  },
  {
    label: 'javascript',
    value: 'javascript'
  },
  {
    label: 'typescript',
    value: 'typescript'
  },
  {
    label: 'nodejs',
    value: 'nodejs'
  },
  {
    label: 'css',
    value: 'css'
  },
  {
    label: 'html',
    value: 'html'
  }
]

export default function PopularTags() {
  const { t } = useTranslation()
  return (
    <div className='mt-4 p-2 text-sm border outline-none rounded-md bg-white dark:bg-dark-primary'>
      <h2 className='text-xl font-semibold mb-2'>{t('components.popularTags')}</h2>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
      </div>
    </div>
  )
}
