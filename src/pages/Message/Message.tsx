import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import dayjs from 'dayjs'
import {
  ArrowLeft,
  EllipsisVertical,
  Edit,
  MessageCircle,
  Paperclip,
  Phone,
  ImagePlus,
  Plus,
  Search,
  Send,
  Video
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const conversations = [
  {
    id: 'conv1',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    username: 'alex_dev',
    fullName: 'Alex John',
    title: 'Senior Backend Dev',
    messages: [
      {
        sender: 'You',
        message: 'See you later, Alex!',
        timestamp: '2024-08-24T11:15:15'
      },
      {
        sender: 'Alex',
        message: 'Alright, talk to you later!',
        timestamp: '2024-08-24T11:11:30'
      },
      {
        sender: 'You',
        message: 'For sure. Anyway, I should get back to reviewing the project.',
        timestamp: '2024-08-23T09:26:50'
      },
      {
        sender: 'Alex',
        message: 'Yeah, let me know what you think.',
        timestamp: '2024-08-23T09:25:15'
      },
      {
        sender: 'You',
        message: "Oh, nice! I've been waiting for that. I'll check it out later.",
        timestamp: '2024-08-23T09:24:30'
      },
      {
        sender: 'Alex',
        message: "They've added a dark mode option! It looks really sleek.",
        timestamp: '2024-08-23T09:23:10'
      },
      {
        sender: 'You',
        message: "No, not yet. What's new?",
        timestamp: '2024-08-23T09:22:00'
      },
      {
        sender: 'Alex',
        message: 'By the way, have you seen the new feature update?',
        timestamp: '2024-08-23T09:21:05'
      },
      {
        sender: 'You',
        message: 'Will do! Thanks, Alex.',
        timestamp: '2024-08-23T09:20:10'
      },
      {
        sender: 'Alex',
        message: 'Great! Let me know if you need any help.',
        timestamp: '2024-08-23T09:19:20'
      },
      {
        sender: 'You',
        message: 'Almost done. Just need to review a few things.',
        timestamp: '2024-08-23T09:18:45'
      },
      {
        sender: 'Alex',
        message: "I'm good, thanks! Did you finish the project?",
        timestamp: '2024-08-23T09:17:10'
      },
      {
        sender: 'You',
        message: "Hey Alex, I'm doing well! How about you?",
        timestamp: '2024-08-23T09:16:30'
      },
      {
        sender: 'Alex',
        message: 'Hey Bob, how are you doing?',
        timestamp: '2024-08-23T09:15:00'
      }
    ]
  },
  {
    id: 'conv2',
    profile: 'https://randomuser.me/api/portraits/women/45.jpg',
    username: 'taylor.codes',
    fullName: 'Taylor Grande',
    title: 'Tech Lead',
    messages: [
      {
        sender: 'Taylor',
        message: "Yeah, it's really well-explained. You should give it a try.",
        timestamp: '2024-08-23T10:35:00'
      },
      {
        sender: 'You',
        message: 'Not yet, is it good?',
        timestamp: '2024-08-23T10:32:00'
      },
      {
        sender: 'Taylor',
        message: 'Hey, did you check out that new tutorial?',
        timestamp: '2024-08-23T10:30:00'
      }
    ]
  },
  {
    id: 'conv3',
    profile: 'https://randomuser.me/api/portraits/men/54.jpg',
    username: 'john_stack',
    fullName: 'John Doe',
    title: 'QA',
    messages: [
      {
        sender: 'You',
        message: 'Yep, see ya. 👋🏼',
        timestamp: '2024-08-22T18:59:00'
      },
      {
        sender: 'John',
        message: 'Great, see you then!',
        timestamp: '2024-08-22T18:55:00'
      },
      {
        sender: 'You',
        message: "Yes, same time as usual. I'll send the invite shortly.",
        timestamp: '2024-08-22T18:50:00'
      },
      {
        sender: 'John',
        message: 'Are we still on for the meeting tomorrow?',
        timestamp: '2024-08-22T18:45:00'
      }
    ]
  },
  {
    id: 'conv4',
    profile: 'https://randomuser.me/api/portraits/women/29.jpg',
    username: 'megan_frontend',
    fullName: 'Megan Flux',
    title: 'Jr Developer',
    messages: [
      {
        sender: 'You',
        message: 'Sure ✌🏼',
        timestamp: '2024-08-23T11:30:00'
      },
      {
        sender: 'Megan',
        message: 'Thanks, appreciate it!',
        timestamp: '2024-08-23T11:30:00'
      },
      {
        sender: 'You',
        message: "Sure thing! I'll take a look in the next hour.",
        timestamp: '2024-08-23T11:25:00'
      },
      {
        sender: 'Megan',
        message: 'Hey! Do you have time to review my PR today?',
        timestamp: '2024-08-23T11:20:00'
      }
    ]
  },
  {
    id: 'conv5',
    profile: 'https://randomuser.me/api/portraits/men/72.jpg',
    username: 'dev_david',
    fullName: 'David Brown',
    title: 'Senior UI/UX Designer',
    messages: [
      {
        sender: 'You',
        message: "Great, I'll review them now!",
        timestamp: '2024-08-23T12:00:00'
      },
      {
        sender: 'David',
        message: 'Just sent you the files. Let me know if you need any changes.',
        timestamp: '2024-08-23T11:58:00'
      },
      {
        sender: 'David',
        message: 'I finished the design for the dashboard. Thoughts?',
        timestamp: '2024-08-23T11:55:00'
      }
    ]
  },
  {
    id: 'conv6',
    profile: 'https://randomuser.me/api/portraits/women/68.jpg',
    username: 'julia.design',
    fullName: 'Julia Carter',
    title: 'Product Designer',
    messages: [
      {
        sender: 'Julia',
        message: "Same here! It's coming together nicely.",
        timestamp: '2024-08-22T14:10:00'
      },
      {
        sender: 'You',
        message: "I'm really excited to see the final product!",
        timestamp: '2024-08-22T14:15:00'
      },
      {
        sender: 'You',
        message: "How's the project looking on your end?",
        timestamp: '2024-08-22T14:05:00'
      }
    ]
  },
  {
    id: 'conv7',
    profile: 'https://randomuser.me/api/portraits/men/24.jpg',
    username: 'brad_dev',
    fullName: 'Brad Wilson',
    title: 'CEO',
    messages: [
      {
        sender: 'Brad',
        message: 'Got it! Thanks for the update.',
        timestamp: '2024-08-23T15:45:00'
      },
      {
        sender: 'You',
        message: 'The release has been delayed to next week.',
        timestamp: '2024-08-23T15:40:00'
      },
      {
        sender: 'Brad',
        message: 'Hey, any news on the release?',
        timestamp: '2024-08-23T15:35:00'
      }
    ]
  },
  {
    id: 'conv8',
    profile: 'https://randomuser.me/api/portraits/women/34.jpg',
    username: 'katie_ui',
    fullName: 'Katie Lee',
    title: 'QA',
    messages: [
      {
        sender: 'Katie',
        message: "I'll join the call in a few minutes.",
        timestamp: '2024-08-23T09:50:00'
      },
      {
        sender: 'You',
        message: "Perfect! We'll start as soon as you're in.",
        timestamp: '2024-08-23T09:48:00'
      },
      {
        sender: 'Katie',
        message: 'Is the meeting still on?',
        timestamp: '2024-08-23T09:45:00'
      }
    ]
  },
  {
    id: 'conv9',
    profile: 'https://randomuser.me/api/portraits/men/67.jpg',
    username: 'matt_fullstack',
    fullName: 'Matt Green',
    title: 'Full-stack Dev',
    messages: [
      {
        sender: 'Matt',
        message: "Sure thing, I'll send over the updates shortly.",
        timestamp: '2024-08-23T10:25:00'
      },
      {
        sender: 'You',
        message: 'Could you update the backend as well?',
        timestamp: '2024-08-23T10:23:00'
      },
      {
        sender: 'Matt',
        message: 'The frontend updates are done. How does it look?',
        timestamp: '2024-08-23T10:20:00'
      }
    ]
  },
  {
    id: 'conv10',
    profile: 'https://randomuser.me/api/portraits/women/56.jpg',
    username: 'sophie_dev',
    fullName: 'Sophie Alex',
    title: 'Jr. Frontend Dev',
    messages: [
      {
        sender: 'You',
        message: "Thanks! I'll review your code and get back to you.",
        timestamp: '2024-08-23T16:10:00'
      },
      {
        sender: 'Sophie',
        message: 'Let me know if you need anything else.',
        timestamp: '2024-08-23T16:05:00'
      },
      {
        sender: 'Sophie',
        message: 'The feature is implemented. Can you review it?',
        timestamp: '2024-08-23T16:00:00'
      }
    ]
  }
]

type ChatUser = (typeof conversations)[number]
type Convo = ChatUser['messages'][number]

export default function Message() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser>(conversations[0])
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(null)

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  )

  const currentMessage = selectedUser.messages.reduce((acc: Record<string, Convo[]>, obj) => {
    const key = dayjs(obj.timestamp).format('D MMM, YYYY')

    // Create an array for the category if it doesn't exist
    if (!acc[key]) {
      acc[key] = []
    }

    // Push the current object to the array
    acc[key].push(obj)

    return acc
  }, {})

  return (
    <section className='flex h-full gap-6 mt-20 py-4 lg:px-12 px-2 relative overflow-hidden'>
      {/* Left Side */}
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
              placeholder='Search chat...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <ScrollArea className='border rounded-md h-[70svh] p-4'>
          <div className='-mx-3 h-full overflow-auto p-3'>
            {filteredChatList.map((chatUsr) => {
              const { id, profile, username, messages, fullName } = chatUsr
              const lastConvo = messages[0]
              const lastMsg = lastConvo.sender === 'You' ? `You: ${lastConvo.message}` : lastConvo.message
              return (
                <Fragment key={id}>
                  <button
                    type='button'
                    className={cn(
                      `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                      selectedUser.id === id && 'sm:bg-muted'
                    )}
                    onClick={() => {
                      setSelectedUser(chatUsr)
                      setMobileSelectedUser(chatUsr)
                    }}
                  >
                    <div className='flex gap-2'>
                      <Avatar>
                        <AvatarImage src={profile} alt={username} />
                        <AvatarFallback>{username}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className='col-start-2 row-span-2 font-medium'>{fullName}</span>
                        <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
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

      {/* Right Side */}
      <div
        className={cn(
          'absolute inset-0 left-full z-50 flex w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
          mobileSelectedUser && 'left-0'
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
              onClick={() => setMobileSelectedUser(null)}
            >
              <ArrowLeft />
            </Button>
            <div className='flex items-center gap-2 lg:gap-4'>
              <Avatar className='size-9 lg:size-11'>
                <AvatarImage src={selectedUser.profile} alt={selectedUser.username} />
                <AvatarFallback>{selectedUser.username}</AvatarFallback>
              </Avatar>
              <div>
                <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>{selectedUser.fullName}</span>
                <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                  {selectedUser.title}
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
            <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
              <div className='chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                {currentMessage &&
                  Object.keys(currentMessage).map((key) => (
                    <Fragment key={key}>
                      {currentMessage[key].map((msg, index) => (
                        <div
                          key={`${msg.sender}-${msg.timestamp}-${index}`}
                          className={cn(
                            'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                            msg.sender === 'You'
                              ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                              : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                          )}
                        >
                          {msg.message}{' '}
                          <span
                            className={cn(
                              'mt-1 block text-xs font-light italic text-muted-foreground',
                              msg.sender === 'You' && 'text-right'
                            )}
                          >
                            {dayjs(msg.timestamp).format('h:mm a')}
                          </span>
                        </div>
                      ))}
                      <div className='text-center text-xs'>{key}</div>
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>
          <form className='flex w-full flex-none gap-2'>
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
                <span className='sr-only'>Chat Text Box</span>
                <input
                  type='text'
                  placeholder='Type your messages...'
                  className='h-8 w-full bg-inherit focus-visible:outline-none'
                />
              </label>
              <Button variant='ghost' size='icon' className='hidden sm:inline-flex'>
                <Send size={20} />
              </Button>
            </div>
            <Button className='h-full sm:hidden'>Send</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
