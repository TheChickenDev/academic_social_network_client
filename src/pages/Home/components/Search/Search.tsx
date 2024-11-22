import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Search() {
  const { t } = useTranslation()
  const [input, setInput] = useState<string>('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(input)
    if (!input) return
    navigate(`/search?q=${input}`)
  }

  return (
    <form onSubmit={handleSearchSubmit} className='max-w-md mx-auto'>
      <div className='relative'>
        <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
          </svg>
        </div>
        <input
          type='search'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='block w-full px-4 py-2 ps-10 text-sm border outline-none rounded-md bg-white dark:bg-dark-primary'
          placeholder={t('action.search')}
        />
      </div>
    </form>
  )
}
