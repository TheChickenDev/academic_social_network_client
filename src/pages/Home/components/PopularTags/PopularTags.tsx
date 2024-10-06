import { useTranslation } from 'react-i18next'

const tags = ['reactjs', 'java', 'javascript', 'typescript', 'nodejs', 'css', 'html']

export default function PopularTags() {
  const { t } = useTranslation()
  return (
    <div className='mt-4 p-2 text-sm border border-gray-300 outline-none rounded-md bg-white dark:bg-background-dark'>
      <h2 className='text-xl font-semibold mb-2'>{t('popular-tags')}</h2>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <span
            key={index}
            className='inline-block bg-gray-100 rounded-sm text-md font-medium mr-2 px-3 py-1 dark:bg-blue-900'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
