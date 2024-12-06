import {
  ArrowLeft,
  EllipsisVertical,
  Paperclip,
  Phone,
  ImagePlus,
  Plus,
  Send,
  Video,
  MessageCircle
} from 'lucide-react'
import { Dispatch, Fragment, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Conversation } from '@/types/conversation.type'
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/app.context'
import { getMessages } from '@/apis/message.api'
import { Message as MessageProps } from '@/types/message.type'
import dayjs from 'dayjs'
import { Socket } from 'socket.io-client'

interface ChatBlockProps {
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  selectedConversation: Conversation | null
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
  mobileSelectedConversation: Conversation | null
  setMobileSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
  socket: Socket | null
}

export default function Chatblock({
  setConversations,
  selectedConversation,
  setSelectedConversation,
  mobileSelectedConversation,
  setMobileSelectedConversation,
  socket
}: ChatBlockProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Record<string, MessageProps[]>>({})
  const { userId } = useContext(AppContext)
  const [input, setInput] = useState<string>('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const fetchMessages = (page: number) => {
    getMessages({
      userId: userId ?? '',
      conversationId: selectedConversation?._id ?? '',
      page,
      limit: 10
    }).then((response) => {
      if (response.status === 200) {
        const data = response.data.data
        setMessages((prev) => {
          const temp: Record<string, MessageProps[]> = { ...prev }
          data?.forEach((msg) => {
            const key = dayjs(msg.createdAt).format('D MMM, YYYY')
            if (temp[key]) {
              temp[key].push(msg)
            } else {
              temp[key] = [msg]
            }
          })
          return { ...temp }
        })
        setHasMore(data.length > 0)
      }
    })
  }

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
        setPage((prev) => prev + 1)
      }
    },
    [hasMore]
  )

  useEffect(() => {
    fetchMessages(page)
  }, [page])

  useEffect(() => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(handleObserver)
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current)
  }, [handleObserver])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedConversation && input) {
      if (socket) {
        const message = {
          conversationId: selectedConversation?._id,
          senderId: userId,
          receiverId: selectedConversation?.userId,
          type: 'text',
          content: input
        }
        socket.emit('chat message', message)
        setInput('')
      }
    }
  }

  useEffect(() => {
    if (userId && socket) {
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
        setMessages((prev) => {
          const temp = { ...prev }
          const key = dayjs(msg.createdAt).format('D MMM, YYYY')
          if (temp[key]) {
            temp[key].unshift({
              _id: msg._id,
              conversationId: msg.conversationId,
              senderId: msg.senderId === userId ? 'You' : msg.senderId,
              senderAvatar: msg.senderAvatar,
              message: msg.message,
              createdAt: msg.createdAt
            })
          } else {
            temp[key] = [
              {
                _id: msg._id,
                conversationId: msg.conversationId,
                senderId: msg.senderId === userId ? 'You' : msg.senderId,
                senderAvatar: msg.senderAvatar,
                message: msg.message,
                createdAt: msg.createdAt
              }
            ]
          }
          return temp
        })
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
  }, [userId])

  return (
    <div
      className={cn(
        'absolute inset-0 left-full z-50 flex w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
        mobileSelectedConversation && 'left-0'
      )}
    >
      {/* Top Part */}
      <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
        {/* Left */}
        <div className='flex gap-3'>
          <Button
            size='icon'
            variant='ghost'
            className='-ml-2 h-full sm:hidden'
            onClick={() => setMobileSelectedConversation(null)}
          >
            <ArrowLeft />
          </Button>
          <div className='flex items-center gap-2 lg:gap-4'>
            <Avatar className='size-9 lg:size-11'>
              <AvatarImage src={selectedConversation?.avatarImg} alt={selectedConversation?.userId} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
              <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                {selectedConversation?.userName}
              </span>
              <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                {selectedConversation?.userRank}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
          <Button size='icon' variant='ghost' className='hidden size-8 rounded-full sm:inline-flex lg:size-10'>
            <Video size={22} className='stroke-muted-foreground' />
          </Button>
          <Button size='icon' variant='ghost' className='hidden size-8 rounded-full sm:inline-flex lg:size-10'>
            <Phone size={22} className='stroke-muted-foreground' />
          </Button>
          <Button size='icon' variant='ghost' className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'>
            <EllipsisVertical className='stroke-muted-foreground sm:size-5' />
          </Button>
        </div>
      </div>

      {/* Conversation */}
      <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0'>
        <div className='flex size-full flex-1'>
          <div className='relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
            <div className='flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
              {Object.keys(messages)?.length > 0 ? (
                <>
                  {Object.keys(messages).map((key) => (
                    <Fragment key={key}>
                      {messages[key].map((msg, index) => (
                        <div
                          key={`${msg.senderId}-${msg.createdAt}-${index}`}
                          className={cn(
                            'max-w-72 break-words px-3 py-2 shadow-lg',
                            msg.senderId === 'You'
                              ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                              : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                          )}
                        >
                          {msg?.message?.content}{' '}
                          <span
                            className={cn(
                              'mt-1 block text-xs font-light italic text-muted-foreground',
                              msg.senderId === 'You' && 'text-right'
                            )}
                          >
                            {dayjs(msg.createdAt).format('h:mm a')}
                          </span>
                        </div>
                      ))}
                      <div className='text-center text-xs'>{key}</div>
                    </Fragment>
                  ))}
                </>
              ) : (
                <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
                  <MessageCircle size={48} className='mb-4 text-muted-foreground' />
                  <p className='text-lg'>{t('chat.noMessage')}</p>
                </div>
              )}
              <div ref={loadMoreRef} id='loading' />
            </div>
          </div>
        </div>
        <form onSubmit={handleSendMessage} className='flex w-full flex-none gap-2'>
          <div className='flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
            <div className='space-x-1'>
              <Button size='icon' type='button' variant='ghost' className='h-8 rounded-md'>
                <Plus size={20} className='stroke-muted-foreground' />
              </Button>
              <Button size='icon' type='button' variant='ghost' className='hidden h-8 rounded-md lg:inline-flex'>
                <ImagePlus size={20} className='stroke-muted-foreground' />
              </Button>
              <Button size='icon' type='button' variant='ghost' className='hidden h-8 rounded-md lg:inline-flex'>
                <Paperclip size={20} className='stroke-muted-foreground' />
              </Button>
            </div>
            <label className='flex-1'>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type='text'
                placeholder={t('chat.messagePlaceholder')}
                className='h-8 w-full bg-inherit focus-visible:outline-none'
              />
            </label>
            <Button type='submit' variant='ghost' size='icon' className='hidden sm:inline-flex'>
              <Send size={20} />
            </Button>
          </div>
          <Button type='submit' className='h-full sm:hidden'>
            {t('action.send')}
          </Button>
        </form>
      </div>
    </div>
  )
}
