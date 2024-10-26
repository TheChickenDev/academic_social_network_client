import { Languages } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/components/LanguageProvider'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='h-10 w-10 rounded-full border flex justify-center items-center outline-none'>
          <Languages className='h-[1.2rem] w-[1.2rem]' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'text-red-600' : ''}>
          {t('enLocale')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'text-red-600' : ''}>
          {t('viLocale')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
