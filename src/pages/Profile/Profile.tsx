import { avatarImg } from '@/assets/images'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'
import { UserRoundPen, EllipsisVertical } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Posts from '../Home/components/Posts'

export default function Profile() {
  const { t } = useTranslation()
  const { avatar, fullName } = useContext(AppContext)

  return (
    <div className='min-h-screen px-2 md:px-6 lg:px-12 bg-background-light dark:bg-dark-primary'>
      <Helmet>
        <title>{t('pages.home')}</title>
      </Helmet>
      <div className='w-full h-96 overflow-hidden rounded-md py-28'>
        <img
          src='https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/273444640_1362330887529533_7827482813592936967_n.jpg?stp=dst-jpg_s960x960&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=x0xZffuhHbEQ7kNvgEECsQe&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=Am5q7xdYTUnXGIm7UlfCeCZ&oh=00_AYDzgoTDiTidiDSJ8XkrdyLiMkymP8BzSUBuo-xGXwDkow&oe=6737F384'
          alt='avatar'
          className='w-full block'
        />
      </div>
      <div className='flex justify-between items-center py-2'>
        <div className='flex justify-center items-center'>
          <Avatar className='md:w-32 md:h-32 w-24 h-24 border'>
            <AvatarImage src={avatar ?? avatarImg} />
            <AvatarFallback />
          </Avatar>
          <div className='pl-4'>
            <h1 className='md:text-3xl text-xl font-bold'>{fullName}</h1>
            <p className='text-sm text-gray-500'>XXX Người theo dõi</p>
          </div>
        </div>
        <div className='flex justify-center items-center gap-2'>
          <Button>{t('action.post')}</Button>
          <Button variant='outline'>
            <UserRoundPen className='mr-2' />
            {t('profile.editProfile')}
          </Button>
        </div>
      </div>
      <Tabs defaultValue='posts'>
        <div className='flex justify-between items-center'>
          <TabsList>
            <TabsTrigger value='posts'>{t('profile.posts')}</TabsTrigger>
            <TabsTrigger value='introduction'>{t('profile.introduction')}</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary'>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabsContent value='posts'>
          <Posts />
        </TabsContent>
        <TabsContent value='introduction'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}
