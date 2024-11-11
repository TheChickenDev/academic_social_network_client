import { Languages } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/hooks/useLanguage'
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
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{t('theme')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={language === 'en'} onCheckedChange={() => setLanguage('en')}>
          {t('enLocale')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={language === 'vi'} onCheckedChange={() => setLanguage('vi')}>
          {t('viLocale')}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
