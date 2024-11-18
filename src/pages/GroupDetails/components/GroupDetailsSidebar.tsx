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
import { Button } from '@/components/ui/button'
import { getUser } from '@/apis/user.api'
import { useNavigate, useParams } from 'react-router-dom'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import { GroupProps } from '@/types/group.type'
import EditInformationForm from './EditInformationForm'
import Information from './Information'
import Posts from './Posts'
import Members from './Members'
import { getGroups } from '@/apis/group.api'

type SidebarItem = 'Information' | 'Posts' | 'Members' | 'Settings'

export function GroupDetailsSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState<SidebarItem>('Information')
  const { setOpen } = useSidebar()
  const { t } = useTranslation()
  const [groupDetails, setGroupDetails] = useState<GroupProps | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, email } = useContext(AppContext)

  useEffect(() => {
    getGroups({ id }).then((response) => {
      const groupData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data
      setGroupDetails(groupData)
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
                      children: t('Information'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('Information')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'Information'}
                    className='px-2.5 md:px-2'
                  >
                    <FileUser />
                    <span>{t('Information')}</span>
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
                      children: t('Members'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('Members')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'Members'}
                    className='px-2.5 md:px-2'
                  >
                    <ContactRound />
                    <span>{t('Members')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isAuthenticated && email === groupDetails?.ownerEmail && (
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
              {groupDetails && activeItem === 'Information' ? (
                editMode ? (
                  <Button variant='destructive' onClick={() => setEditMode(false)}>
                    {t('action.cancel')}
                  </Button>
                ) : (
                  <Button onClick={() => setEditMode(true)}>
                    <UserRoundPen className='mr-2' />
                    {t('group.editGroup')}
                  </Button>
                )
              ) : activeItem === 'Posts' ? (
                <Button onClick={() => navigate(paths.postEditor)}>
                  <BadgePlus className='mr-2' />
                  {t('group.createAPost')}
                </Button>
              ) : null}
            </div>
          )}
        </header>
        <div className='p-4'>
          {activeItem === 'Information' ? (
            editMode ? (
              <EditInformationForm />
            ) : (
              <Information />
            )
          ) : activeItem === 'Posts' ? (
            <Posts />
          ) : activeItem === 'Members' ? (
            <Members />
          ) : null}
        </div>
      </SidebarInset>
    </>
  )
}