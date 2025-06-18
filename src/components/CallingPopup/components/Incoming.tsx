import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Video, PhoneOff } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type CallingPopupProps = {
  receiverName: string
  receiverAvatar?: string
  isVideoCall: boolean
  isIncomingCall: boolean
  onAccept: () => void
  onReject: () => void
}

export default function Incoming({
  receiverName,
  receiverAvatar,
  isVideoCall,
  isIncomingCall,
  onAccept,
  onReject
}: CallingPopupProps) {
  console.log('isVideoCall:', isVideoCall)
  return (
    <Card className='w-[350px] text-center shadow-xl rounded-2xl'>
      <CardContent className='p-6 flex flex-col items-center space-y-2'>
        {isIncomingCall ? (
          <>
            <Avatar className='w-16 h-16'>
              <AvatarImage src={receiverAvatar} />
              <AvatarFallback />
            </Avatar>
            <div>
              <h2 className='text-lg font-semibold'>{receiverName}</h2>
              <p className='text-muted-foreground'>is calling you...</p>
            </div>
            <div className='flex items-center justify-center gap-4 mt-2'>
              {isIncomingCall && (
                <Button onClick={onAccept} className='bg-green-500 hover:bg-green-600 text-white rounded-full p-4'>
                  {isVideoCall ? <Video className='w-5 h-5' /> : <Phone className='w-5 h-5' />}
                </Button>
              )}
              <Button onClick={onReject} className='bg-red-500 hover:bg-red-600 text-white rounded-full p-4'>
                <PhoneOff className='w-5 h-5' />
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-muted-foreground'>Calling...</p>
            <Avatar className='w-16 h-16'>
              <AvatarImage src={receiverAvatar} />
              <AvatarFallback />
            </Avatar>
            <div>
              <h2 className='text-lg font-semibold'>{receiverName}</h2>
            </div>
            <div className='flex items-center justify-center gap-4 mt-2'>
              <Button onClick={onReject} className='bg-red-500 hover:bg-red-600 text-white rounded-full p-4'>
                <PhoneOff className='w-5 h-5' />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
