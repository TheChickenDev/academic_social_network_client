import { FileUser, LayoutList, ContactRound, Settings, BadgePlus } from 'lucide-react'
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
  const { isAuthenticated, userId, isAdmin } = useContext(AppContext)

  useEffect(() => {
    getGroups({ id, userId, type: 'byId' }).then((response) => {
      const groupData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data
      setGroupDetails(groupData)
    })
  }, [])

  const handleJoinGroup = () => {
    requestToJoin({ id, userId }).then((response) => {
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
    removeMember({ id, userId }).then((response) => {
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
                    <svg
                      className='dark:fill-white fill-black'
                      width='49'
                      height='37'
                      viewBox='0 0 49 37'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M8.90841 28.6561C15.4033 48.3641 0.681831 7.45751 0.681831 7.45751C0.681831 7.45751 25.4806 7.45751 17.0448 7.45751C8.60896 7.45751 2.41349 8.94812 8.90841 28.6561Z' />
                      <path d='M40.4552 15.0388C33.9603 -4.66919 48.6818 36.2374 48.6818 36.2374C48.6818 36.2374 23.883 36.2374 32.3188 36.2374C40.7547 36.2374 46.9502 34.7468 40.4552 15.0388Z' />
                      <path d='M24.5939 35.684C21.8747 35.684 19.5278 35.1439 17.5533 34.0638C15.59 32.9724 14.0781 31.4204 13.0175 29.4081C11.9682 27.3843 11.4435 24.9797 11.4435 22.1942C11.4435 19.4882 11.9738 17.1234 13.0344 15.0997C14.095 13.0645 15.59 11.4842 17.5194 10.3586C19.4488 9.22167 21.7223 8.6532 24.34 8.6532C26.1904 8.6532 27.8829 8.94312 29.4173 9.52296C30.9518 10.1028 32.2776 10.9612 33.3946 12.0981C34.5116 13.2351 35.3804 14.6392 36.001 16.3105C36.6215 17.9704 36.9318 19.8748 36.9318 22.0236V24.1042H14.3376V19.2609H29.2312C29.2199 18.374 29.0112 17.5839 28.605 16.8903C28.1988 16.1968 27.6403 15.6568 26.9294 15.2702C26.2299 14.8723 25.4232 14.6733 24.5092 14.6733C23.584 14.6733 22.7547 14.8836 22.0213 15.3043C21.2879 15.7136 20.7069 16.2764 20.2781 16.9927C19.8494 17.6976 19.6237 18.4991 19.6011 19.3973V24.3259C19.6011 25.3947 19.8099 26.3326 20.2273 27.1399C20.6448 27.9357 21.2372 28.5553 22.0044 28.9988C22.7717 29.4422 23.6856 29.6639 24.7462 29.6639C25.4796 29.6639 26.1453 29.5615 26.7433 29.3569C27.3413 29.1522 27.8546 28.851 28.2834 28.453C28.7122 28.0551 29.0337 27.5662 29.2481 26.9864L36.8472 27.2081C36.5313 28.9249 35.8374 30.4199 34.7655 31.6933C33.7049 32.9553 32.3114 33.9388 30.5851 34.6437C28.8588 35.3372 26.8617 35.684 24.5939 35.684ZM32.5484 0.262573V4.38967H15.8439V0.262573H32.5484Z' />
                    </svg>
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
                {isAuthenticated && !isAdmin && (
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
                {isAuthenticated && !isAdmin && userId === groupDetails?.ownerId && (
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
          {isAuthenticated && !isAdmin && (
            <div className='max-h-6 flex justify-center items-center gap-2'>
              {groupDetails && activeItem === 'Information' ? (
                groupDetails.canJoin ? (
                  <Button onClick={handleJoinGroup}>
                    {groupDetails.isPrivate ? t('group.requestToJoin') : t('group.join')}
                  </Button>
                ) : (
                  groupDetails.ownerId !== userId && <Button onClick={handleLeaveGroup}>{t('action.leave')}</Button>
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
          ) : groupDetails?.ownerId === userId && activeItem === 'Settings' ? (
            <EditInformationForm groupDetails={groupDetails} setGroupDetails={setGroupDetails} />
          ) : null}
        </div>
      </SidebarInset>
    </>
  )
}
