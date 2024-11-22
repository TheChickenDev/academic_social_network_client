import useQueryParams from '@/hooks/useQueryParams'
import { ComponentProps, useEffect, useState } from 'react'
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
import { AppWindow, BookCopy, Github, User, Users } from 'lucide-react'
import paths from '@/constants/paths'

type Type = 'posts' | 'users' | 'groups' | 'all'
type PostsFilter = 'newest' | 'liked' | 'disliked' | 'commented' | null
type UsersFilter = 'rank' | 'posts' | null
type GroupsFilter = 'newest' | 'members' | 'posts' | null

export default function SearchSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const { q, type, filter } = useQueryParams()
  const [input, setInput] = useState<string>(q)
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState<Type>((type as Type) || 'all')
  const { setOpen } = useSidebar()

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
      navigate(`${paths.search}?q=${input}${type ? `&type=${type}` : ''}`)
    }
  }, [activeItem])

  const handleFilterChange = (value: PostsFilter | GroupsFilter | UsersFilter) => {
    if (!input) {
      navigate(`${paths.search}?type=${activeItem}${value ? `&filter=${value}` : ''}`)
    } else {
      navigate(`${paths.search}?q=${input}&type=${activeItem}${value ? `&filter=${value}` : ''}`)
    }
  }

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
                    <Users />
                    <span>{t('search.groups')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className='sticky top-20 flex shrink-0 justify-between items-center gap-2 border-b p-4 bg-white dark:bg-dark-primary'>
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
              <Select onValueChange={(value) => handleFilterChange(value as PostsFilter)}>
                <SelectTrigger className='w-fit'>
                  <SelectValue placeholder={t('search.filterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('search.filterPosts')}</SelectLabel>
                    <SelectItem value='newest'>{t('search.newest')}</SelectItem>
                    <SelectItem value='liked'>{t('search.mostLiked')}</SelectItem>
                    <SelectItem value='disliked'>{t('search.mostDisliked')}</SelectItem>
                    <SelectItem value='commented'>{t('search.mostCommented')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : activeItem === 'users' ? (
              <Select onValueChange={(value) => handleFilterChange(value as UsersFilter)}>
                <SelectTrigger className='w-fit'>
                  <SelectValue placeholder={t('search.filterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('search.filterUsers')}</SelectLabel>
                    <SelectItem value='posts'>{t('search.mostPosts')}</SelectItem>
                    <SelectItem value='rank'>{t('search.highestRank')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : activeItem === 'groups' ? (
              <Select onValueChange={(value) => handleFilterChange(value as GroupsFilter)}>
                <SelectTrigger className='w-fit'>
                  <SelectValue placeholder={t('search.filterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('search.filterPosts')}</SelectLabel>
                    <SelectItem value='newest'>{t('search.newest')}</SelectItem>
                    <SelectItem value='members'>{t('search.mostMembers')}</SelectItem>
                    <SelectItem value='posts'>{t('search.mostPosts')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </header>
        <div className='p-4'>
          {activeItem === 'posts' ? (
            <div>posts</div>
          ) : activeItem === 'users' ? (
            <div>users</div>
          ) : activeItem === 'groups' ? (
            <div>Groups</div>
          ) : (
            <div>all</div>
          )}
        </div>
      </SidebarInset>
    </>
  )
}
