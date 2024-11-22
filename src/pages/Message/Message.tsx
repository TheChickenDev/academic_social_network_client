import Chatblock from './components/Chatblock'
import Conversations from './components/Conversations'
import { Conversation } from '@/types/conversation.type'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export default function Message() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [mobileSelectedConversation, setMobileSelectedConversation] = useState<Conversation | null>(null)
  const { t } = useTranslation()

  // useEffect(() => {
  //   getMessages({
  //     userEmail: email ?? '',
  //     conversationId: selectedConversation?._id ?? '',
  //     page: 1,
  //     limit: 10
  //   }).then((response) => {
  //     const status = response.status
  //     if (status === 200) {
  //       const data = response.data.data
  //       const temp: Record<string, MessageProps[]> = {}
  //       data?.forEach((msg) => {
  //         const key = dayjs(msg.createdAt).format('D MMM, YYYY')
  //         if (temp[key]) {
  //           temp[key].push(msg)
  //         } else {
  //           temp[key] = [msg]
  //         }
  //       })
  //       setMessages(temp)
  //     }
  //   })
  // }, [selectedConversation])

  return (
    <section className='flex h-full gap-6 mt-20 py-4 lg:px-12 px-2 relative overflow-hidden'>
      {/* Left Side */}
      <Conversations
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        mobileSelectedConversation={mobileSelectedConversation}
        setMobileSelectedConversation={setMobileSelectedConversation}
      />

      {/* Right Side */}
      {selectedConversation ? (
        <Chatblock
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          mobileSelectedConversation={mobileSelectedConversation}
          setMobileSelectedConversation={setMobileSelectedConversation}
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
