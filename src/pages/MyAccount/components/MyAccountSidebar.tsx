import {
  FileUser,
  LayoutList,
  Bookmark,
  ContactRound,
  History,
  Settings,
  Github,
  BadgePlus,
  UserRoundPen
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { useState, ComponentProps, useEffect, useContext } from 'react'
import { User, UserProfileData } from '@/types/user.type'
import { Button } from '@/components/ui/button'
import { getUser } from '@/apis/user.api'
import EditProfileForm from './EditProfileForm'
import Profile from './Profile'
import Posts from './Posts'
import { useNavigate, useParams } from 'react-router-dom'
import paths from '@/constants/paths'
import Saved from './Saved'
import { decodeIdToEmail } from '@/utils/utils'
import { AppContext } from '@/contexts/app.context'

type SidebarItem = 'Profile' | 'Posts' | 'Saved' | 'Friends' | 'Activities' | 'Settings'

export function MyAccountSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState<SidebarItem>('Profile')
  const { setOpen } = useSidebar()
  const { t } = useTranslation()
  const [userDetails, setUserDetails] = useState<(User & UserProfileData) | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, email } = useContext(AppContext)

  useEffect(() => {
    getUser({ email: decodeIdToEmail(id ?? '') }).then((response) => {
      setUserDetails(response.data.data)
    })
  }, [])

  return (
    <>
      <Sidebar collapsible='icon' className='mt-20 overflow-hidden' {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild className='md:h-8 md:p-0'>
                <a href='#'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                    <Github className='size-4' />
                  </div>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>Eurekas</span>
                    <span className='truncate text-xs'>Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className='px-1.5 md:px-0'>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: t('Profile'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('Profile')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'Profile'}
                    className='px-2.5 md:px-2'
                  >
                    <FileUser />
                    <span>{t('Profile')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: t('Posts'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('Posts')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'Posts'}
                    className='px-2.5 md:px-2'
                  >
                    <LayoutList />
                    <span>{t('Posts')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: t('Friends'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('Friends')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'Friends'}
                    className='px-2.5 md:px-2'
                  >
                    <ContactRound />
                    <span>{t('Friends')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isAuthenticated && email === userDetails?.email && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={{
                          children: t('Saved'),
                          hidden: false
                        }}
                        onClick={() => {
                          setActiveItem('Saved')
                          setOpen(true)
                        }}
                        isActive={activeItem === 'Saved'}
                        className='px-2.5 md:px-2'
                      >
                        <Bookmark />
                        <span>{t('Saved')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={{
                          children: t('Activities'),
                          hidden: false
                        }}
                        onClick={() => {
                          setActiveItem('Activities')
                          setOpen(true)
                        }}
                        isActive={activeItem === 'Activities'}
                        className='px-2.5 md:px-2'
                      >
                        <History />
                        <span>{t('Activities')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={{
                          children: t('Settings'),
                          hidden: false
                        }}
                        onClick={() => {
                          setActiveItem('Settings')
                          setOpen(true)
                        }}
                        isActive={activeItem === 'Settings'}
                        className='px-2.5 md:px-2'
                      >
                        <Settings />
                        <span>{t('Settings')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className='sticky flex shrink-0 justify-between items-center gap-2 border-b p-4'>
          <div className='flex shrink-0 items-center'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>{t('pages.myAccount')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t(activeItem)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {isAuthenticated && (
            <div className='max-h-6 flex justify-center items-center gap-2'>
              {userDetails && activeItem === 'Profile' ? (
                editMode ? (
                  <Button variant='destructive' onClick={() => setEditMode(false)}>
                    {t('action.cancel')}
                  </Button>
                ) : (
                  <Button onClick={() => setEditMode(true)}>
                    <UserRoundPen className='mr-2' />
                    {t('myAccount.editProfile')}
                  </Button>
                )
              ) : activeItem === 'Posts' ? (
                <Button onClick={() => navigate(paths.postEditor)}>
                  <BadgePlus className='mr-2' />
                  {t('myAccount.createAPost')}
                </Button>
              ) : null}
            </div>
          )}
        </header>
        <div className='p-4'>
          {activeItem === 'Profile' ? (
            editMode ? (
              <EditProfileForm userDetails={userDetails} setUserDetails={setUserDetails} setEditMode={setEditMode} />
            ) : (
              <Profile user={userDetails} />
            )
          ) : activeItem === 'Posts' ? (
            <Posts />
          ) : activeItem === 'Saved' ? (
            <Saved />
          ) : activeItem === 'Friends' ? (
            <div className='p-4 space-y-4'>
              <h1 className='text-xl font-semibold'>{t('Friends')}</h1>
              <p className='text-sm text-secondary'>{t('pages.myAccount.friends')}</p>
            </div>
          ) : null}
        </div>
      </SidebarInset>
    </>
  )
}
