import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import ModeToggle from '../ModeToggle'
import paths from '@/constants/paths'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { avatarImg, logoImg } from '@/assets/images'
import { Home, Group } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import LanguageToggle from '../LanguageToggle'
import { useTranslation } from 'react-i18next'
import { removeDataFromLocalStorage } from '@/utils/auth'
import { MessageCircleCode, Bell } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated, setIsAuthenticated, fullName, avatar } = useContext(AppContext)

  const signInClick = () => {
    navigate({
      pathname: paths.login
    })
  }

  const signUpClick = () => {
    navigate({
      pathname: paths.register
    })
  }

  const handleSignOutClick = () => {
    removeDataFromLocalStorage()
    setIsAuthenticated(false)
  }

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8'>
      <header className='flex h-20 w-full shrink-0 justify-between items-center px-4 md:px-6'>
        <Link to={paths.home} className='mr-6'>
          <img src={logoImg} alt='Logo' className='h-10 w-auto' />
        </Link>
        <div className='flex gap-2'>
          <Link
            to={paths.home}
            className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
          >
            <Home size={30} />
          </Link>
          <Link
            to='#'
            className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
          >
            <Group size={30} />
          </Link>
        </div>
        <div className='flex gap-2'>
          <ModeToggle />
          <LanguageToggle />
          {isAuthenticated ? (
            <>
              <Link to='#' className='h-10 w-10 rounded-full border flex justify-center items-center outline-none'>
                <MessageCircleCode className='h-[1.2rem] w-[1.2rem]' />
              </Link>
              <Link to='#' className='h-10 w-10 rounded-full border flex justify-center items-center outline-none'>
                <Bell className='h-[1.2rem] w-[1.2rem]' />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                  <img src={avatar ?? avatarImg} alt='Avatar' className='h-10 w-10 rounded-full border' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{fullName || 'My account'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{t('personal-page')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('contribute-ideas')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSignOutClick()}>{t('sign-out')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant='outline' className='justify-self-end' onClick={() => signInClick()}>
                {t('sign-in')}
              </Button>
              <Button className='justify-self-end' onClick={() => signUpClick()}>
                {t('sign-up')}
              </Button>
            </>
          )}
        </div>
      </header>
    </div>
  )
}
