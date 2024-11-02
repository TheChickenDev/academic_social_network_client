import { Moon, Sun } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/ThemeProvider'
import { useTranslation } from 'react-i18next'

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='h-10 w-10 rounded-full border flex justify-center items-center outline-none'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem className={theme === 'light' ? 'text-red-600' : ''} onClick={() => setTheme('light')}>
          {t('lightMode')}
        </DropdownMenuItem>
        <DropdownMenuItem className={theme === 'dark' ? 'text-red-600' : ''} onClick={() => setTheme('dark')}>
          {t('darkMode')}
        </DropdownMenuItem>
        <DropdownMenuItem className={theme === 'system' ? 'text-red-600' : ''} onClick={() => setTheme('system')}>
          {t('systemMode')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
