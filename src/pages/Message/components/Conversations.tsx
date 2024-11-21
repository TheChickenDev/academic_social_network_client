import { getConversations } from '@/apis/conversation.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AppContext } from '@/contexts/app.context'
import { cn } from '@/lib/utils'
import { Conversation } from '@/types/conversation.type'
import { Edit, MessageCircle, Search } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'

interface ConversationsProps {
  selectedConversation: Conversation | null
  setSelectedConversation: (conversation: Conversation) => void
  mobileSelectedConversation: Conversation | null
  setMobileSelectedConversation: (conversation: Conversation | null) => void
}

export default function Conversations({
  selectedConversation,
  setSelectedConversation,
  setMobileSelectedConversation
}: ConversationsProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { email } = useContext(AppContext)

  useEffect(() => {
    getConversations({
      userEmail: email ?? '',
      page: 1,
      limit: 10
    }).then((response) => {
      const status = response.status
      if (status === 200) {
        setConversations(
          response.data.data?.filter(({ userName }) => userName?.toLowerCase().includes(search.trim().toLowerCase()))
        )
      }
      // setSelectedConversation(response.data.data[0])
      // setMobileSelectedConversation(response.data.data[0])
    })
  }, [])

  const filteredConversations = conversations.filter(({ userName }) =>
    userName?.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
      <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
        <div className='flex items-center justify-between py-2'>
          <div className='flex gap-2'>
            <h1 className='text-2xl font-bold'>Inbox</h1>
            <MessageCircle size={20} />
          </div>

          <Button size='icon' variant='ghost' className='rounded-lg'>
            <Edit size={24} className='stroke-muted-foreground' />
          </Button>
        </div>

        <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
          <Search size={15} className='mr-2 stroke-slate-500' />
          <span className='sr-only'>Search</span>
          <input
            type='text'
            className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
            placeholder={t('chat.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <ScrollArea className='border rounded-md h-[70svh] px-4'>
        <div className='-mx-3 h-full overflow-auto p-3'>
          {filteredConversations.map((chatUsr) => {
            const { _id, avatarImg, userEmail, lastMessage, userName } = chatUsr
            let lastMsg = lastMessage
              ? lastMessage.content
              : t('chat.sayHelloTo', {
                  name: userName ? userName : userEmail
                }) +
                ' ' +
                (userName ? userName : userEmail)
            if (lastMessage) {
              lastMsg =
                userEmail === 'You'
                  ? t('chat.lastMessage', lastMessage?.content)
                  : userName + ': ' + lastMessage?.content
            }
            return (
              <Fragment key={_id}>
                <button
                  type='button'
                  className={cn(
                    `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                    selectedConversation?._id === _id && 'sm:bg-muted'
                  )}
                  onClick={() => {
                    setSelectedConversation(chatUsr)
                    setMobileSelectedConversation(chatUsr)
                  }}
                >
                  <div className='flex gap-2'>
                    <Avatar>
                      <AvatarImage src={avatarImg} alt={userEmail} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div>
                      <span className='col-start-2 row-span-2 font-medium'>{userName ? userName : userEmail}</span>
                      <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 text-ellipsis text-muted-foreground'>
                        {lastMsg}
                      </span>
                    </div>
                  </div>
                </button>
                <Separator className='my-1' />
              </Fragment>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
