import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import ModeToggle from '../ModeToggle'
import paths from '@/constants/paths'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/app.context'
import { avatarImg } from '@/assets/images'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import LanguageToggle from '../LanguageToggle'
import { useTranslation } from 'react-i18next'
import { removeDataFromLocalStorage } from '@/utils/auth'
import { ChevronDown, Search, Menu } from 'lucide-react'
import classNames from 'classnames'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useTheme } from '../ThemeProvider'
import useWindowDimensions from '@/hooks/useWindowDimensions'
import { useLanguage } from '../LanguageProvider'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { width } = useWindowDimensions()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const { isAuthenticated, setIsAuthenticated, fullName, avatar } = useContext(AppContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const handleSignInClick = () => {
    navigate({
      pathname: paths.login
    })
  }

  const handleSignOutClick = () => {
    removeDataFromLocalStorage()
    setIsAuthenticated(false)
  }

  const handleMobileMenuLinkClick = (path: string) => {
    navigate({
      pathname: path
    })
    setMobileMenuOpen(false)
  }

  const handleMobileChangeThemeClick = (theme: 'dark' | 'light' | 'system') => {
    setTheme(theme)
    setMobileMenuOpen(false)
  }

  const handleMobileChangeLanguageClick = (language: 'vi' | 'en') => {
    setLanguage(language)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    if (width > 768) {
      setMobileMenuOpen(false)
    }
  }, [width])

  return (
    <div className='container'>
      <header className='fixed border-b top-0 left-0 right-0 z-50 flex h-20 w-full shrink-0 justify-between items-center px-2 lg:px-12 bg-white dark:bg-dark-primary'>
        <Link to={paths.home} className='mr-6'>
          <svg
            className='dark:fill-white'
            width='177'
            height='32'
            viewBox='0 0 177 32'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M7.43196 26.151C13.2995 43.9554 -3.8147e-06 7 -3.8147e-06 7C-3.8147e-06 7 22.4035 7 14.7824 7C7.16143 7 1.56439 8.34663 7.43196 26.151Z' />
            <path d='M168.932 12.849C163.064 -4.9554 176.364 32 176.364 32C176.364 32 153.96 32 161.581 32C169.202 32 174.799 30.6534 168.932 12.849Z' />
            <path d='M21.6023 32C19.1458 32 17.0256 31.5121 15.2418 30.5364C13.4682 29.5503 12.1023 28.1483 11.1442 26.3303C10.1962 24.502 9.72223 22.3296 9.72223 19.8132C9.72223 17.3686 10.2013 15.2322 11.1595 13.4039C12.1176 11.5654 13.4682 10.1377 15.2112 9.12085C16.9543 8.09373 19.0082 7.58016 21.373 7.58016C23.0447 7.58016 24.5736 7.84208 25.9599 8.36591C27.3462 8.88974 28.5439 9.66522 29.553 10.6923C30.5621 11.7195 31.347 12.988 31.9076 14.4978C32.4682 15.9974 32.7486 17.7179 32.7486 19.6591V21.5388H12.3368V17.1632H25.7917C25.7815 16.3621 25.593 15.6482 25.226 15.0217C24.8591 14.3951 24.3545 13.9072 23.7123 13.558C23.0804 13.1985 22.3515 13.0188 21.5259 13.0188C20.6901 13.0188 19.9409 13.2088 19.2783 13.5888C18.6158 13.9586 18.0908 14.467 17.7035 15.1141C17.3161 15.7509 17.1123 16.475 17.0919 17.2865V21.739C17.0919 22.7045 17.2804 23.5519 17.6576 24.2812C18.0347 25.0002 18.5699 25.5599 19.263 25.9605C19.9562 26.3611 20.7818 26.5614 21.74 26.5614C22.4025 26.5614 23.0039 26.4689 23.5441 26.2841C24.0844 26.0992 24.5482 25.827 24.9355 25.4675C25.3228 25.108 25.6134 24.6663 25.807 24.1425L32.6721 24.3428C32.3867 25.8938 31.7598 27.2444 30.7915 28.3948C29.8333 29.5349 28.5745 30.4234 27.0149 31.0602C25.4554 31.6867 23.6512 32 21.6023 32ZM28.7885 0V3.72845H13.6976V0H28.7885Z' />
            <path d='M49.4195 21.3385V7.8883H56.8808V32H49.7558V27.1468H49.5112C48.9913 28.5951 48.1045 29.7455 46.8508 30.598C45.6072 31.4402 44.2634 32 42.5 32C40.8997 32 39.3333 31.4916 38.1203 30.752C36.9074 30.0125 35.9645 28.9803 35.2917 27.6553C34.619 26.32 34.2775 24.7588 34.2673 22.9716V7.8883H41.744V21.4925C41.7542 22.7764 42.0906 23.7882 42.7531 24.5277C43.4157 25.2672 44.3178 25.637 45.4594 25.637C46.2035 25.637 46.8712 25.4726 47.4624 25.144C48.0638 24.805 48.5378 24.3171 48.8843 23.6803C49.2411 23.0332 49.4195 22.2526 49.4195 21.3385Z' />
            <path d='M59 32L58.9348 7.8883H66.1974V12.2022H66.442C66.8701 10.641 67.5684 9.48034 68.5367 8.72027C69.5051 7.94993 70.6314 7.56476 71.9157 7.56476C72.2623 7.56476 72.6191 7.59044 72.986 7.64179C73.353 7.68288 73.6944 7.74964 74.0104 7.84208V14.39C73.6537 14.2667 73.1848 14.1692 72.6038 14.0973C72.033 14.0254 71.5233 13.9894 71.0748 13.9894C70.188 13.9894 69.3878 14.1897 68.6743 14.5903C67.971 14.9806 67.4155 15.5301 67.0077 16.2388C66.6102 16.9373 66.4114 17.7589 66.4114 18.7039V32H59Z' />
            <path d='M86.0638 32C83.6073 32 81.4871 31.5121 79.7033 30.5364C77.9297 29.5503 76.5638 28.1483 75.6057 26.3303C74.6577 24.502 74.1837 22.3296 74.1837 19.8132C74.1837 17.3686 74.6628 15.2322 75.6209 13.4039C76.5791 11.5654 77.9297 10.1377 79.6727 9.12085C81.4157 8.09373 83.4697 7.58016 85.8345 7.58016C87.5062 7.58016 89.0351 7.84208 90.4214 8.36591C91.8077 8.88974 93.0054 9.66522 94.0145 10.6923C95.0236 11.7195 95.8085 12.988 96.3691 14.4978C96.9297 15.9974 97.21 17.7179 97.21 19.6591V21.5388H76.7983V17.1632H90.2532C90.243 16.3621 90.0545 15.6482 89.6875 15.0217C89.3205 14.3951 88.816 13.9072 88.1738 13.558C87.5418 13.1985 86.813 13.0188 85.9874 13.0188C85.1515 13.0188 84.4024 13.2088 83.7398 13.5888C83.0772 13.9586 82.5523 14.467 82.165 15.1141C81.7776 15.7509 81.5737 16.475 81.5534 17.2865V21.739C81.5534 22.7045 81.7419 23.5519 82.1191 24.2812C82.4962 25.0002 83.0314 25.5599 83.7245 25.9605C84.4176 26.3611 85.2433 26.5614 86.2014 26.5614C86.864 26.5614 87.4654 26.4689 88.0056 26.2841C88.5459 26.0992 89.0097 25.827 89.397 25.4675C89.7843 25.108 90.0748 24.6663 90.2685 24.1425L97.1336 24.3428C96.8482 25.8938 96.2213 27.2444 95.253 28.3948C94.2948 29.5349 93.0359 30.4234 91.4764 31.0602C89.9168 31.6867 88.1126 32 86.0638 32Z' />
            <path d='M106.266 25.3442L106.297 16.3621H107.337L113.942 7.8883H122.412L112.596 20.0289H110.624L106.266 25.3442ZM99.5236 32V0H107V32H99.5236ZM114.463 32L107.964 21.7236L112.887 16.3775L122.986 32H114.463Z' />
            <path d='M129.042 32C127.544 32 126.388 31.7021 125.226 31.1988C124.074 30.6853 123.162 29.9149 122.489 28.8878C121.826 27.8504 121.495 26.5511 121.495 24.9899C121.495 23.6752 121.725 22.5659 122.183 21.662C122.642 20.7581 123.274 20.0238 124.079 19.4588C124.884 18.8939 125.812 18.4677 126.862 18.1801C127.912 17.8822 129.033 17.6819 130.226 17.5792C131.561 17.4559 132.636 17.3276 133.452 17.194C134.267 17.0502 134.858 16.8499 135.225 16.5932C135.603 16.3261 135.791 15.9512 135.791 15.4685V15.3914C135.791 14.6005 135.521 13.9894 134.981 13.558C134.441 13.1266 133.712 12.9109 132.794 12.9109C131.806 12.9109 131.011 13.1266 130.409 13.558C129.808 13.9894 129.425 14.5851 129.262 15.3452L122.367 15.0987C122.571 13.6607 123.096 12.3768 123.942 11.247C124.798 10.1069 125.97 9.21329 127.458 8.5662C128.957 7.90884 130.756 7.58016 132.855 7.58016C134.354 7.58016 135.735 7.75991 136.999 8.1194C138.263 8.46863 139.364 8.98219 140.302 9.66009C141.239 10.3277 141.963 11.1494 142.473 12.1252C142.993 13.1009 143.253 14.2154 143.253 15.4685V32H136.219V28.2561H136.036C135.618 29.0573 135.083 29.7352 134.43 30.2898C133.788 30.8445 133.029 31.2605 132.152 31.5378C131.286 31.8151 130.133 32 129.042 32ZM131.525 27.0236C132.331 27.0236 133.054 26.8593 133.696 26.5306C134.349 26.2019 134.869 25.75 135.256 25.1748C135.643 24.5893 135.837 23.9114 135.837 23.1411V20.8917C135.623 21.0047 135.363 21.1074 135.057 21.1998C134.762 21.2922 134.435 21.3796 134.079 21.4617C133.722 21.5439 133.355 21.6158 132.978 21.6774C132.601 21.739 132.239 21.7955 131.892 21.8469C131.189 21.9599 130.588 22.1345 130.088 22.3707C129.599 22.607 129.222 22.9151 128.957 23.2951C128.702 23.6649 128.574 24.1066 128.574 24.6201C128.574 25.4007 128.85 25.9965 129.4 26.4073C129.961 26.8182 130.669 27.0236 131.525 27.0236Z' />
            <path d='M166.141 15.1141L159.276 15.299C159.205 14.806 159.011 14.3694 158.695 13.9894C158.379 13.5991 157.966 13.2961 157.457 13.0804C156.957 12.8544 156.376 12.7415 155.714 12.7415C154.847 12.7415 154.108 12.9161 153.497 13.2653C152.895 13.6145 152.6 14.087 152.61 14.6827C152.6 15.1449 152.783 15.5455 153.16 15.8844C153.548 16.2234 154.236 16.4956 155.224 16.701L159.75 17.5638C162.095 18.0157 163.838 18.7655 164.979 19.8132C166.131 20.8609 166.712 22.2475 166.722 23.973C166.712 25.5959 166.233 27.0082 165.285 28.2099C164.347 29.4116 163.063 30.3463 161.432 31.014C159.801 31.6713 157.936 32 155.836 32C152.482 32 149.837 31.3067 147.901 29.9201C145.974 28.5232 144.873 26.6538 144.598 24.312L151.983 24.1271C152.146 24.9899 152.569 25.6472 153.252 26.0992C153.935 26.5511 154.806 26.7771 155.867 26.7771C156.825 26.7771 157.604 26.5973 158.206 26.2378C158.807 25.8783 159.113 25.4007 159.123 24.805C159.113 24.2709 158.879 23.8446 158.42 23.5262C157.961 23.1976 157.243 22.9408 156.264 22.7559L152.166 21.9701C149.812 21.5388 148.059 20.7427 146.907 19.5821C145.755 18.4112 145.184 16.9218 145.194 15.1141C145.184 13.5323 145.602 12.1817 146.448 11.0621C147.294 9.93227 148.497 9.06949 150.056 8.47376C151.616 7.87803 153.456 7.58016 155.576 7.58016C158.756 7.58016 161.264 8.25293 163.099 9.59846C164.933 10.9337 165.948 12.7723 166.141 15.1141Z' />
          </svg>
        </Link>
        <div className='md:flex items-center justify-evenly gap-2 hidden'>
          <Link
            to={paths.home}
            className={classNames(
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-800',
              {
                'text-black dark:bg-dark-secondary': location.pathname === paths.home,
                'text-gray-400': location.pathname !== paths.home
              }
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('pages.home')}
          </Link>
          <Link
            to={paths.community}
            className={classNames(
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-800',
              {
                'text-black dark:bg-dark-secondary': location.pathname === paths.community,
                'text-gray-400': location.pathname !== paths.community
              }
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('pages.community')}
          </Link>
          <Link
            to={paths.message}
            className={classNames(
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-800',
              {
                'text-black dark:bg-dark-secondary': location.pathname === paths.message,
                'text-gray-400': location.pathname !== paths.message
              }
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('pages.message')}
          </Link>
          <Link
            to={paths.message}
            className={classNames(
              'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-800',
              {
                'text-black dark:bg-dark-secondary': location.pathname === paths.message,
                'text-gray-400': location.pathname !== paths.message
              }
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('pages.notification')}
          </Link>
        </div>
        <div className='md:flex items-center gap-2 hidden'>
          <ModeToggle />
          <LanguageToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='h-10 outline-none flex justify-center items-center border rounded-full p-1'>
                <Avatar className='w-8 h-8'>
                  <AvatarImage src={avatar ?? avatarImg} />
                  <AvatarFallback />
                </Avatar>
                <ChevronDown size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{fullName || 'My account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('pages.profile')}</DropdownMenuItem>
                <DropdownMenuItem>{t('pages.contributeIdeas')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSignOutClick()}>{t('action.signOut')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className='justify-self-end' onClick={() => handleSignInClick()}>
              {t('action.signIn')}
            </Button>
          )}
        </div>
        <div className='flex md:hidden'>
          <Button variant={'ghost'}>
            <Search size={20}></Search>
          </Button>

          <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
            <SheetTrigger>
              <Menu size={20}></Menu>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className='hidden'>Menu</SheetTitle>
              <SheetHeader className='text-left mb-4'>
                {isAuthenticated ? (
                  <Link to={paths.profile} className='flex justify-left items-center gap-4'>
                    <Avatar>
                      <AvatarImage src={avatar} />
                      <AvatarFallback />
                    </Avatar>
                    <p className='font-semibold'>{fullName}</p>
                  </Link>
                ) : (
                  <>
                    <SheetTitle>{t('header.sheetTitle')}</SheetTitle>
                    <SheetDescription>{t('header.sheetSubtitle')}</SheetDescription>
                    <Button>{t('header.joinUs')}</Button>
                  </>
                )}
              </SheetHeader>
              <hr />
              <div>
                <button
                  onClick={() => handleMobileMenuLinkClick(paths.home)}
                  className={classNames('w-full text-left py-3', {
                    'text-black dark:text-white': location.pathname === paths.home,
                    'text-gray-500': location.pathname !== paths.home
                  })}
                >
                  {t('pages.home')}
                </button>
                <button
                  onClick={() => handleMobileMenuLinkClick(paths.community)}
                  className={classNames('w-full text-left py-3', {
                    'text-black dark:text-white': location.pathname === paths.community,
                    'text-gray-500': location.pathname !== paths.community
                  })}
                >
                  {t('pages.community')}
                </button>
                <button
                  onClick={() => handleMobileMenuLinkClick(paths.message)}
                  className={classNames('w-full text-left py-3', {
                    'text-black dark:text-white': location.pathname === paths.message,
                    'text-gray-500': location.pathname !== paths.message
                  })}
                >
                  {t('pages.message')}
                </button>
                <button
                  onClick={() => handleMobileMenuLinkClick(paths.notification)}
                  className={classNames('w-full text-left py-3', {
                    'text-black dark:text-white': location.pathname === paths.notification,
                    'text-gray-500': location.pathname !== paths.notification
                  })}
                >
                  {t('pages.notification')}
                </button>
              </div>
              <hr />
              {isAuthenticated && (
                <>
                  <div>
                    <button onClick={() => handleMobileMenuLinkClick(paths.post)} className={'w-full text-left py-3'}>
                      {t('action.post')}
                    </button>
                    <button onClick={() => handleMobileMenuLinkClick(paths.post)} className={'w-full text-left py-3'}>
                      {t('components.todayPosts')}
                    </button>
                    <button onClick={() => handleMobileMenuLinkClick(paths.post)} className={'w-full text-left py-3'}>
                      {t('components.discoverySpace')}
                    </button>
                  </div>
                  <hr />
                </>
              )}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className='w-full text-left py-3'>{t('theme')}</button>
                </CollapsibleTrigger>
                <CollapsibleContent className='rounded-md border-r border-b border-l'>
                  <button
                    className={classNames('w-full text-left text-sm py-2 px-4', {
                      'text-red-600': theme === 'light'
                    })}
                    onClick={() => handleMobileChangeThemeClick('light')}
                  >
                    {t('lightMode')}
                  </button>
                  <button
                    className={classNames('w-full text-left text-sm py-2 px-4', {
                      'text-red-600': theme === 'dark'
                    })}
                    onClick={() => handleMobileChangeThemeClick('dark')}
                  >
                    {t('darkMode')}
                  </button>
                  <button
                    className={classNames('w-full text-left text-sm py-2 px-4', {
                      'text-red-600': theme === 'system'
                    })}
                    onClick={() => handleMobileChangeThemeClick('system')}
                  >
                    {t('systemMode')}
                  </button>
                </CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className='w-full text-left py-3'>{t('language')}</button>
                </CollapsibleTrigger>
                <CollapsibleContent className='rounded-md border-r border-b border-l'>
                  <button
                    className={classNames('w-full text-left text-sm py-2 px-4', {
                      'text-red-600': language === 'en'
                    })}
                    onClick={() => handleMobileChangeLanguageClick('en')}
                  >
                    {t('enLocale')}
                  </button>
                  <button
                    className={classNames('w-full text-left text-sm py-2 px-4', {
                      'text-red-600': language === 'vi'
                    })}
                    onClick={() => handleMobileChangeLanguageClick('vi')}
                  >
                    {t('viLocale')}
                  </button>
                </CollapsibleContent>
              </Collapsible>
              <button onClick={() => handleMobileMenuLinkClick(paths.post)} className={'w-full text-left py-3'}>
                {t('action.feedback')}
              </button>
              <button
                onClick={() => handleMobileMenuLinkClick(paths.post)}
                className={'w-full text-left py-3 text-red-500'}
              >
                {t('action.signOut')}
              </button>
              <div className='mt-6 flex justify-around items-center text-xs font-semibold'>
                <Link to={'#'}>{t('introduction.privacyTerms')}</Link>
                <Link to={'#'}>{t('introduction.about')}</Link>
                <Link to={'#'}>{t('introduction.helpCenter')}</Link>
              </div>
              <div className='mt-2 flex justify-center items-center gap-2'>
                <svg
                  className='dark:fill-white'
                  width='118'
                  height='21'
                  viewBox='0 0 177 32'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M7.43196 26.151C13.2995 43.9554 -3.8147e-06 7 -3.8147e-06 7C-3.8147e-06 7 22.4035 7 14.7824 7C7.16143 7 1.56439 8.34663 7.43196 26.151Z' />
                  <path d='M168.932 12.849C163.064 -4.9554 176.364 32 176.364 32C176.364 32 153.96 32 161.581 32C169.202 32 174.799 30.6534 168.932 12.849Z' />
                  <path d='M21.6023 32C19.1458 32 17.0256 31.5121 15.2418 30.5364C13.4682 29.5503 12.1023 28.1483 11.1442 26.3303C10.1962 24.502 9.72223 22.3296 9.72223 19.8132C9.72223 17.3686 10.2013 15.2322 11.1595 13.4039C12.1176 11.5654 13.4682 10.1377 15.2112 9.12085C16.9543 8.09373 19.0082 7.58016 21.373 7.58016C23.0447 7.58016 24.5736 7.84208 25.9599 8.36591C27.3462 8.88974 28.5439 9.66522 29.553 10.6923C30.5621 11.7195 31.347 12.988 31.9076 14.4978C32.4682 15.9974 32.7486 17.7179 32.7486 19.6591V21.5388H12.3368V17.1632H25.7917C25.7815 16.3621 25.593 15.6482 25.226 15.0217C24.8591 14.3951 24.3545 13.9072 23.7123 13.558C23.0804 13.1985 22.3515 13.0188 21.5259 13.0188C20.6901 13.0188 19.9409 13.2088 19.2783 13.5888C18.6158 13.9586 18.0908 14.467 17.7035 15.1141C17.3161 15.7509 17.1123 16.475 17.0919 17.2865V21.739C17.0919 22.7045 17.2804 23.5519 17.6576 24.2812C18.0347 25.0002 18.5699 25.5599 19.263 25.9605C19.9562 26.3611 20.7818 26.5614 21.74 26.5614C22.4025 26.5614 23.0039 26.4689 23.5441 26.2841C24.0844 26.0992 24.5482 25.827 24.9355 25.4675C25.3228 25.108 25.6134 24.6663 25.807 24.1425L32.6721 24.3428C32.3867 25.8938 31.7598 27.2444 30.7915 28.3948C29.8333 29.5349 28.5745 30.4234 27.0149 31.0602C25.4554 31.6867 23.6512 32 21.6023 32ZM28.7885 0V3.72845H13.6976V0H28.7885Z' />
                  <path d='M49.4195 21.3385V7.8883H56.8808V32H49.7558V27.1468H49.5112C48.9913 28.5951 48.1045 29.7455 46.8508 30.598C45.6072 31.4402 44.2634 32 42.5 32C40.8997 32 39.3333 31.4916 38.1203 30.752C36.9074 30.0125 35.9645 28.9803 35.2917 27.6553C34.619 26.32 34.2775 24.7588 34.2673 22.9716V7.8883H41.744V21.4925C41.7542 22.7764 42.0906 23.7882 42.7531 24.5277C43.4157 25.2672 44.3178 25.637 45.4594 25.637C46.2035 25.637 46.8712 25.4726 47.4624 25.144C48.0638 24.805 48.5378 24.3171 48.8843 23.6803C49.2411 23.0332 49.4195 22.2526 49.4195 21.3385Z' />
                  <path d='M59 32L58.9348 7.8883H66.1974V12.2022H66.442C66.8701 10.641 67.5684 9.48034 68.5367 8.72027C69.5051 7.94993 70.6314 7.56476 71.9157 7.56476C72.2623 7.56476 72.6191 7.59044 72.986 7.64179C73.353 7.68288 73.6944 7.74964 74.0104 7.84208V14.39C73.6537 14.2667 73.1848 14.1692 72.6038 14.0973C72.033 14.0254 71.5233 13.9894 71.0748 13.9894C70.188 13.9894 69.3878 14.1897 68.6743 14.5903C67.971 14.9806 67.4155 15.5301 67.0077 16.2388C66.6102 16.9373 66.4114 17.7589 66.4114 18.7039V32H59Z' />
                  <path d='M86.0638 32C83.6073 32 81.4871 31.5121 79.7033 30.5364C77.9297 29.5503 76.5638 28.1483 75.6057 26.3303C74.6577 24.502 74.1837 22.3296 74.1837 19.8132C74.1837 17.3686 74.6628 15.2322 75.6209 13.4039C76.5791 11.5654 77.9297 10.1377 79.6727 9.12085C81.4157 8.09373 83.4697 7.58016 85.8345 7.58016C87.5062 7.58016 89.0351 7.84208 90.4214 8.36591C91.8077 8.88974 93.0054 9.66522 94.0145 10.6923C95.0236 11.7195 95.8085 12.988 96.3691 14.4978C96.9297 15.9974 97.21 17.7179 97.21 19.6591V21.5388H76.7983V17.1632H90.2532C90.243 16.3621 90.0545 15.6482 89.6875 15.0217C89.3205 14.3951 88.816 13.9072 88.1738 13.558C87.5418 13.1985 86.813 13.0188 85.9874 13.0188C85.1515 13.0188 84.4024 13.2088 83.7398 13.5888C83.0772 13.9586 82.5523 14.467 82.165 15.1141C81.7776 15.7509 81.5737 16.475 81.5534 17.2865V21.739C81.5534 22.7045 81.7419 23.5519 82.1191 24.2812C82.4962 25.0002 83.0314 25.5599 83.7245 25.9605C84.4176 26.3611 85.2433 26.5614 86.2014 26.5614C86.864 26.5614 87.4654 26.4689 88.0056 26.2841C88.5459 26.0992 89.0097 25.827 89.397 25.4675C89.7843 25.108 90.0748 24.6663 90.2685 24.1425L97.1336 24.3428C96.8482 25.8938 96.2213 27.2444 95.253 28.3948C94.2948 29.5349 93.0359 30.4234 91.4764 31.0602C89.9168 31.6867 88.1126 32 86.0638 32Z' />
                  <path d='M106.266 25.3442L106.297 16.3621H107.337L113.942 7.8883H122.412L112.596 20.0289H110.624L106.266 25.3442ZM99.5236 32V0H107V32H99.5236ZM114.463 32L107.964 21.7236L112.887 16.3775L122.986 32H114.463Z' />
                  <path d='M129.042 32C127.544 32 126.388 31.7021 125.226 31.1988C124.074 30.6853 123.162 29.9149 122.489 28.8878C121.826 27.8504 121.495 26.5511 121.495 24.9899C121.495 23.6752 121.725 22.5659 122.183 21.662C122.642 20.7581 123.274 20.0238 124.079 19.4588C124.884 18.8939 125.812 18.4677 126.862 18.1801C127.912 17.8822 129.033 17.6819 130.226 17.5792C131.561 17.4559 132.636 17.3276 133.452 17.194C134.267 17.0502 134.858 16.8499 135.225 16.5932C135.603 16.3261 135.791 15.9512 135.791 15.4685V15.3914C135.791 14.6005 135.521 13.9894 134.981 13.558C134.441 13.1266 133.712 12.9109 132.794 12.9109C131.806 12.9109 131.011 13.1266 130.409 13.558C129.808 13.9894 129.425 14.5851 129.262 15.3452L122.367 15.0987C122.571 13.6607 123.096 12.3768 123.942 11.247C124.798 10.1069 125.97 9.21329 127.458 8.5662C128.957 7.90884 130.756 7.58016 132.855 7.58016C134.354 7.58016 135.735 7.75991 136.999 8.1194C138.263 8.46863 139.364 8.98219 140.302 9.66009C141.239 10.3277 141.963 11.1494 142.473 12.1252C142.993 13.1009 143.253 14.2154 143.253 15.4685V32H136.219V28.2561H136.036C135.618 29.0573 135.083 29.7352 134.43 30.2898C133.788 30.8445 133.029 31.2605 132.152 31.5378C131.286 31.8151 130.133 32 129.042 32ZM131.525 27.0236C132.331 27.0236 133.054 26.8593 133.696 26.5306C134.349 26.2019 134.869 25.75 135.256 25.1748C135.643 24.5893 135.837 23.9114 135.837 23.1411V20.8917C135.623 21.0047 135.363 21.1074 135.057 21.1998C134.762 21.2922 134.435 21.3796 134.079 21.4617C133.722 21.5439 133.355 21.6158 132.978 21.6774C132.601 21.739 132.239 21.7955 131.892 21.8469C131.189 21.9599 130.588 22.1345 130.088 22.3707C129.599 22.607 129.222 22.9151 128.957 23.2951C128.702 23.6649 128.574 24.1066 128.574 24.6201C128.574 25.4007 128.85 25.9965 129.4 26.4073C129.961 26.8182 130.669 27.0236 131.525 27.0236Z' />
                  <path d='M166.141 15.1141L159.276 15.299C159.205 14.806 159.011 14.3694 158.695 13.9894C158.379 13.5991 157.966 13.2961 157.457 13.0804C156.957 12.8544 156.376 12.7415 155.714 12.7415C154.847 12.7415 154.108 12.9161 153.497 13.2653C152.895 13.6145 152.6 14.087 152.61 14.6827C152.6 15.1449 152.783 15.5455 153.16 15.8844C153.548 16.2234 154.236 16.4956 155.224 16.701L159.75 17.5638C162.095 18.0157 163.838 18.7655 164.979 19.8132C166.131 20.8609 166.712 22.2475 166.722 23.973C166.712 25.5959 166.233 27.0082 165.285 28.2099C164.347 29.4116 163.063 30.3463 161.432 31.014C159.801 31.6713 157.936 32 155.836 32C152.482 32 149.837 31.3067 147.901 29.9201C145.974 28.5232 144.873 26.6538 144.598 24.312L151.983 24.1271C152.146 24.9899 152.569 25.6472 153.252 26.0992C153.935 26.5511 154.806 26.7771 155.867 26.7771C156.825 26.7771 157.604 26.5973 158.206 26.2378C158.807 25.8783 159.113 25.4007 159.123 24.805C159.113 24.2709 158.879 23.8446 158.42 23.5262C157.961 23.1976 157.243 22.9408 156.264 22.7559L152.166 21.9701C149.812 21.5388 148.059 20.7427 146.907 19.5821C145.755 18.4112 145.184 16.9218 145.194 15.1141C145.184 13.5323 145.602 12.1817 146.448 11.0621C147.294 9.93227 148.497 9.06949 150.056 8.47376C151.616 7.87803 153.456 7.58016 155.576 7.58016C158.756 7.58016 161.264 8.25293 163.099 9.59846C164.933 10.9337 165.948 12.7723 166.141 15.1141Z' />
                </svg>
                <p className='text-xs'>Copyright ©️ 2024</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  )
}
