import Chatblock from './components/Chatblock'
import { Conversation } from '@/types/conversation.type'
import { Fragment, useContext, useEffect, useState } from 'react'
import { Edit, MessageCircle, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { AppContext } from '@/contexts/app.context'
import { getConversations } from '@/apis/conversation.api'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getSocket, initializeSocket } from '@/utils/socket'
import { Message as MessageProps } from '@/types/message.type'

export default function Message() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [mobileSelectedConversation, setMobileSelectedConversation] = useState<Conversation | null>(null)
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { userId: currentUserId } = useContext(AppContext)

  let socket = getSocket()
  if (!socket && currentUserId) {
    socket = initializeSocket(currentUserId)
  }

  useEffect(() => {
    getConversations({
      userId: currentUserId ?? '',
      page: 1,
      limit: 10
    })
      .then((response) => {
        const status = response.status
        if (status === 200) {
          setConversations(
            response.data.data?.filter(({ userName }) => userName?.toLowerCase().includes(search.trim().toLowerCase()))
          )
        }
        // setSelectedConversation(response.data.data[0])
        // setMobileSelectedConversation(response.data.data[0])
      })
      .finally(() => {
        if (currentUserId && socket) {
          socket.on('chat message', (response) => {
            const msg: MessageProps = response
            if (!msg) {
              return
            }
            setConversations((prev) => {
              const temp = [...prev]
              const index = temp.findIndex((conv) => conv._id === msg.conversationId)
              if (index > -1) {
                temp[index].lastMessage = { ...msg.message, senderId: msg.senderId }
              }
              return temp
            })
            setSelectedConversation((prev) =>
              prev
                ? {
                    ...prev,
                    lastMessage: { ...msg.message, senderId: msg.senderId },
                    _id: msg.conversationId,
                    userId: prev.userId,
                    userRank: prev.userRank,
                    userName: prev.userName,
                    avatarImg: prev.avatarImg
                  }
                : null
            )
            setSelectedConversation((prev) => {
              if (prev) {
                return {
                  ...prev,
                  lastMessage: { ...msg.message, senderId: msg.senderId },
                  _id: msg.conversationId
                }
              }
              return prev
            })
            setMobileSelectedConversation((prev) => {
              if (prev) {
                return {
                  ...prev,
                  lastMessage: { ...msg.message, senderId: msg.senderId },
                  _id: msg.conversationId
                }
              }
              return prev
            })
          })

          return () => {
            socket.off('chat message')
          }
        }
      })
  }, [])

  const filteredConversations = conversations.filter(({ userName }) =>
    userName?.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <section className='flex h-full gap-6 mt-20 py-4 lg:px-12 px-2 relative overflow-hidden'>
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
              const { _id, avatarImg, userId, lastMessage, userName } = chatUsr
              let lastMsg = lastMessage
                ? lastMessage.content
                : t('chat.sayHelloTo', {
                    name: userName ? userName : userId
                  }) +
                  ' ' +
                  (userName ? userName : userId)
              if (lastMessage) {
                lastMsg =
                  lastMessage.senderId === currentUserId
                    ? t('chat.lastMessage', { message: lastMessage?.content })
                    : `${userName}: ${lastMessage?.content}`
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
                        <AvatarImage src={avatarImg} alt={userId} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div>
                        <span className='col-start-2 row-span-2 font-medium'>{userName}</span>
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

      {selectedConversation ? (
        <Chatblock
          setConversations={setConversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          mobileSelectedConversation={mobileSelectedConversation}
          setMobileSelectedConversation={setMobileSelectedConversation}
          socket={socket}
        />
      ) : (
        <div
          className={cn(
            'absolute inset-0 left-full z-50 flex w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
            mobileSelectedConversation && 'left-0'
          )}
        >
          <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
            <MessageCircle size={48} className='mb-4 text-muted-foreground' />
            <p className='text-lg'>{t('chat.selectAConversation')}</p>
          </div>
        </div>
      )}
    </section>
  )
}
