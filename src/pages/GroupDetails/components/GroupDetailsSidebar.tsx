import { FileUser, LayoutList, ContactRound, Settings, Github, BadgePlus } from 'lucide-react'
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
import { useNavigate, useParams } from 'react-router-dom'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import { GroupProps } from '@/types/group.type'
import Information from './Information'
import Posts from './Posts'
import Members from './Members'
import { getGroups, removeMember, requestToJoin } from '@/apis/group.api'
import EditInformationForm from './EditInformationForm'
import { toast } from 'sonner'

type SidebarItem = 'Information' | 'Posts' | 'Members' | 'Settings'

export function GroupDetailsSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState<SidebarItem>('Posts')
  const { setOpen } = useSidebar()
  const { t } = useTranslation()
  const [groupDetails, setGroupDetails] = useState<GroupProps | null>(null)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, email } = useContext(AppContext)

  useEffect(() => {
    getGroups({ id, userEmail: email }).then((response) => {
      const groupData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data
      setGroupDetails(groupData)
    })
  }, [])

  const handleJoinGroup = () => {
    requestToJoin({ id, userEmail: email }).then((response) => {
      const status = response.status
      if (status === 200) {
        if (groupDetails?.isPrivate) {
          toast.success(t('group.haveSendJoinRequest'))
        } else {
          toast.success(t('group.haveJoinedGroup'))
        }
        setGroupDetails((prevDetails) =>
          prevDetails ? { ...prevDetails, canJoin: !prevDetails.canJoin, canPost: !prevDetails.canPost } : prevDetails
        )
      }
    })
  }

  const handleLeaveGroup = () => {
    removeMember({ id, userEmail: email }).then((response) => {
      const status = response.status
      if (status === 200) {
        toast.success(t('group.haveLeftGroup'))
        setGroupDetails((prevDetails) =>
          prevDetails ? { ...prevDetails, canJoin: !prevDetails.canJoin, canPost: !prevDetails.isPrivate } : prevDetails
        )
      }
    })
  }

  useEffect(() => {
    if (groupDetails?.isPrivate) {
      setActiveItem('Information')
    }
  }, [groupDetails])

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
                      children: t('group.information'),
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
                    <span>{t('group.information')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isAuthenticated && !groupDetails?.isPrivate && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={{
                          children: t('group.posts'),
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
                        <span>{t('group.posts')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={{
                          children: t('group.members'),
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
                        <span>{t('group.members')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
                {isAuthenticated && email === groupDetails?.ownerEmail && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={{
                        children: t('group.settings'),
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
                      <span>{t('group.settings')}</span>
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
                  <BreadcrumbLink href='#'>{t('pages.group')}</BreadcrumbLink>
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
                groupDetails.canJoin ? (
                  <Button onClick={handleJoinGroup}>
                    {groupDetails.isPrivate ? t('group.requestToJoin') : t('group.join')}
                  </Button>
                ) : (
                  groupDetails.ownerEmail !== email && <Button onClick={handleLeaveGroup}>{t('action.leave')}</Button>
                )
              ) : activeItem === 'Posts' && groupDetails?.canPost ? (
                <Button onClick={() => navigate(`${paths.postEditor}?groupId=${id}`)}>
                  <BadgePlus className='mr-2' />
                  {t('group.createAPost')}
                </Button>
              ) : null}
            </div>
          )}
        </header>
        <div className='p-4'>
          {activeItem === 'Information' ? (
            <Information group={groupDetails} />
          ) : activeItem === 'Posts' ? (
            <Posts canEdit={groupDetails?.canEdit ?? false} />
          ) : activeItem === 'Members' ? (
            <Members groupDetails={groupDetails} />
          ) : groupDetails?.ownerEmail === email && activeItem === 'Settings' ? (
            <EditInformationForm groupDetails={groupDetails} setGroupDetails={setGroupDetails} />
          ) : null}
        </div>
      </SidebarInset>
    </>
  )
}
