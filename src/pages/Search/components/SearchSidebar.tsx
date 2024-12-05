import useQueryParams from '@/hooks/useQueryParams'
import { ComponentProps, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AppWindow, BookCopy, User, Users as UsersIcon } from 'lucide-react'
import UsersComponent from './Users'
import paths from '@/constants/paths'
import All from './All'
import Posts from './Posts'
import { useQueryClient } from '@tanstack/react-query'
import { AppContext } from '@/contexts/app.context'
import Groups from './Groups'

type Type = 'posts' | 'users' | 'groups' | 'all'
type PostsFilter = 'newest' | 'liked' | 'disliked' | 'all'
type UsersFilter = 'rank' | 'all'
type GroupsFilter = 'newest' | 'all'

export default function SearchSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const { q, type, filter } = useQueryParams()
  const [input, setInput] = useState<string>(q ?? '')
  const [searchFilter, setSearchFilter] = useState<PostsFilter | UsersFilter | GroupsFilter | null>(
    filter as PostsFilter
  )
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState<Type>((type as Type) || 'all')
  const { setOpen } = useSidebar()
  const queryClient = useQueryClient()
  const { userId } = useContext(AppContext)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input) {
      navigate(`${paths.search}?type=${activeItem}${filter ? `&filter=${filter}` : ''}`)
    } else {
      navigate(`${paths.search}?q=${input}&type=${activeItem}${filter ? `&filter=${filter}` : ''}`)
    }
  }

  useEffect(() => {
    if (!input) {
      navigate(`${paths.search}?type=${activeItem}`)
    } else {
      navigate(`${paths.search}?q=${input}${activeItem ? `&type=${activeItem}` : ''}`)
    }
    setSearchFilter('all')
  }, [activeItem])

  useEffect(() => {
    if (!input) {
      navigate(`${paths.search}?type=${activeItem}${searchFilter ? `&filter=${searchFilter}` : ''}`)
    } else {
      navigate(`${paths.search}?q=${input}&type=${activeItem}${searchFilter ? `&filter=${searchFilter}` : ''}`)
    }
  }, [searchFilter])

  useEffect(() => {
    setInput(q || '')
    queryClient.invalidateQueries({
      queryKey: ['searchPosts']
    })
    queryClient.invalidateQueries({
      queryKey: ['searchUsers']
    })
    queryClient.invalidateQueries({
      queryKey: ['searchGroups']
    })
  }, [q, type, filter])

  return (
    <>
      <Sidebar collapsible='icon' className='mt-20 overflow-hidden' {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild className='md:h-8 md:p-0'>
                <a href='#'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
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
                      children: t('search.all'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('all')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'all'}
                    className='px-2.5 md:px-2'
                  >
                    <BookCopy />
                    <span>{t('search.all')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: t('search.posts'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('posts')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'posts'}
                    className='px-2.5 md:px-2'
                  >
                    <AppWindow />
                    <span>{t('search.posts')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: t('search.users'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('users')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'users'}
                    className='px-2.5 md:px-2'
                  >
                    <User />
                    <span>{t('search.users')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: t('search.groups'),
                      hidden: false
                    }}
                    onClick={() => {
                      setActiveItem('groups')
                      setOpen(true)
                    }}
                    isActive={activeItem === 'groups'}
                    className='px-2.5 md:px-2'
                  >
                    <UsersIcon />
                    <span>{t('search.groups')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className='sticky top-20 z-50 flex shrink-0 justify-between items-center gap-2 border-b p-4 bg-white dark:bg-dark-primary'>
          <div className='flex w-full shrink-0 items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='-ml-1 h-4' />
            <form onSubmit={handleSearchSubmit} className='flex-1'>
              <div className='relative'>
                <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                  <svg
                    className='w-4 h-4 text-gray-500 dark:text-gray-400'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 20'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                    />
                  </svg>
                </div>
                <input
                  type='search'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className='block w-full px-4 py-2 ps-10 text-sm border outline-none rounded-md bg-white dark:bg-dark-primary'
                  placeholder={t('action.search')}
                />
              </div>
            </form>
            {activeItem === 'posts' ? (
              <Select value={searchFilter as string} onValueChange={(value) => setSearchFilter(value as PostsFilter)}>
                <SelectTrigger className='w-fit'>
                  <SelectValue placeholder={t('search.filterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('search.filterPosts')}</SelectLabel>
                    <SelectItem value='all'>{t('search.noFilter')}</SelectItem>
                    <SelectItem value='newest'>{t('search.newest')}</SelectItem>
                    <SelectItem value='liked'>{t('search.mostLiked')}</SelectItem>
                    <SelectItem value='disliked'>{t('search.mostDisliked')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : activeItem === 'users' ? (
              <Select value={searchFilter as string} onValueChange={(value) => setSearchFilter(value as UsersFilter)}>
                <SelectTrigger className='w-fit'>
                  <SelectValue placeholder={t('search.filterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('search.filterUsers')}</SelectLabel>
                    <SelectItem value='all'>{t('search.noFilter')}</SelectItem>
                    <SelectItem value='rank'>{t('search.highestRank')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : activeItem === 'groups' ? (
              <Select value={searchFilter as string} onValueChange={(value) => setSearchFilter(value as GroupsFilter)}>
                <SelectTrigger className='w-fit'>
                  <SelectValue placeholder={t('search.filterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('search.filterPosts')}</SelectLabel>
                    <SelectItem value='all'>{t('search.noFilter')}</SelectItem>
                    <SelectItem value='newest'>{t('search.newest')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </header>
        <div className='p-4'>
          {activeItem === 'posts' ? (
            <Posts q={q} type={activeItem} filter={searchFilter as string} />
          ) : activeItem === 'users' ? (
            <UsersComponent q={q} type={activeItem} filter={searchFilter as string} userId={userId} />
          ) : activeItem === 'groups' ? (
            <Groups q={q} type={activeItem} filter={searchFilter as string} userId={userId} />
          ) : (
            <All q={q} type={activeItem} filter={searchFilter as string} />
          )}
        </div>
      </SidebarInset>
    </>
  )
}
