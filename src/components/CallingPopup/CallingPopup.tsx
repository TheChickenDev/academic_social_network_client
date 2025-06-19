import { useContext, useEffect, useRef, useState } from 'react'
import Incoming from './components/Incoming'
import { AppContext } from '@/contexts/app.context'
import VideoContainer from './components/VideoContainer'
import { getSocket, initializeSocket } from '@/utils/socket'
import Peer from 'simple-peer'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { t } from 'i18next'

export default function CallingPopup() {
  const [onCall, setOnCall] = useState(false)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const { userId, localStream, setLocalStream, socketCallInfo, setSocketCallInfo } = useContext(AppContext)

  const peerRef = useRef<Peer.Instance | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  // useEffect(() => {
  //   if (!socketCallInfo || !userId) return

  //   const isCaller = socketCallInfo.senderId === userId
  //   if (isCaller && !peerRef.current && !onCall) {
  //     createPeer(true, socketCallInfo.receiverId)
  //   }
  // }, [socketCallInfo, userId])

  useEffect(() => {
    let socket = getSocket()
    if (!socket && userId) {
      socket = initializeSocket(userId)
    }
    if (!socket) return

    socket.on('incoming call', async (response) => {
      if (!setSocketCallInfo) return

      setSocketCallInfo({
        isVideoCall: response.isVideoCall,
        receiverId: response.receiverId,
        receiverName: response.receiverName,
        receiverAvatar: response.receiverAvatar,
        senderId: response.senderId
      })
    })

    socket.on('reject call', () => {
      cleanupCall()
    })

    socket.on('hangup call', () => {
      cleanupCall()
    })

    socket.on('signal', async ({ signal, from }) => {
      if (!peerRef.current) {
        await createPeer(false, from)
      }
      peerRef.current?.signal(signal)
      setOnCall(true)
    })

    return () => {
      socket.off('incoming call')
      socket.off('reject call')
      socket.off('signal')
    }
  }, [socketCallInfo])

  const getMedia = async () => {
    const constraints = socketCallInfo?.isVideoCall ? { video: true, audio: true } : { video: false, audio: true }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    setLocalStream?.(stream)
    localStreamRef.current = stream
    return stream
  }

  const createPeer = async (initiator: boolean, remoteUserId: string) => {
    const stream = await getMedia()
    const socket = getSocket()

    const peer = new Peer({
      initiator,
      trickle: false,
      stream
    })

    peer.on('signal', (data) => {
      if (!socket || !userId) return
      socket.emit('signal', {
        signal: data,
        from: userId,
        to: remoteUserId
      })
    })

    peer.on('stream', (stream) => {
      setRemoteStream(stream)
    })

    peer.on('close', cleanupCall)

    peerRef.current = peer
  }

  const handleAcceptCall = async () => {
    if (!socketCallInfo) return
    setOnCall(true)
    await createPeer(true, socketCallInfo.senderId)
  }

  const handleRejectCall = () => {
    const socket = getSocket()
    if (!socketCallInfo || !socket) return
    socket.emit('reject call', {
      senderId: userId,
      receiverId: userId === socketCallInfo.senderId ? socketCallInfo.receiverId : socketCallInfo.senderId
    })
    cleanupCall()
  }

  const handleHangupCall = () => {
    peerRef.current?.destroy()

    const socket = getSocket()
    if (!socketCallInfo || !socket) return
    socket.emit('hangup call', {
      senderId: userId,
      receiverId: userId === socketCallInfo.senderId ? socketCallInfo.receiverId : socketCallInfo.senderId
    })

    cleanupCall()
  }

  const cleanupCall = () => {
    setOnCall(false)
    setRemoteStream(null)
    peerRef.current?.destroy()
    peerRef.current = null

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    setLocalStream?.(null)
    setSocketCallInfo?.(null)
  }

  return (
    <>
      {socketCallInfo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          {onCall ? (
            remoteStream ? (
              <div
                className={cn(
                  'relative bg-white rounded-lg shadow-lg flex flex-col items-center justify-center',
                  socketCallInfo?.isVideoCall ? 'mx-16 w-fit h-fit' : 'w-80 h-48'
                )}
              >
                {socketCallInfo?.isVideoCall ? (
                  <>
                    {localStream && (
                      <VideoContainer stream={localStream} isLocalStream={true} isVideo={socketCallInfo?.isVideoCall} />
                    )}
                    {remoteStream && (
                      <VideoContainer
                        stream={remoteStream}
                        isLocalStream={false}
                        isVideo={socketCallInfo?.isVideoCall}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className='w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold'>
                      📞
                    </div>
                    <p className='text-gray-800 text-lg font-semibold'>{t('chat.audioCalling')}</p>
                    <p className='text-gray-500 text-sm text-center mb-4'>
                      {t('chat.onAudioCall')} <span className='font-medium'>{socketCallInfo.receiverName}</span>
                    </p>
                    {localStream && (
                      <VideoContainer stream={localStream} isLocalStream={true} isVideo={socketCallInfo?.isVideoCall} />
                    )}
                    {remoteStream && (
                      <VideoContainer
                        stream={remoteStream}
                        isLocalStream={false}
                        isVideo={socketCallInfo?.isVideoCall}
                      />
                    )}
                  </>
                )}
                <Button
                  className='absolute bottom-2 right-2 px-4 p-2 bg-red-600 text-white rounded hover:bg-red-700'
                  onClick={handleHangupCall}
                >
                  End Call
                </Button>
              </div>
            ) : (
              <div className='w-96 h-40 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 gap-2'>
                <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
                <p className='text-gray-700 text-lg font-medium mt-2'>{t('chat.connecting')}</p>
              </div>
            )
          ) : (
            <Incoming
              receiverName={socketCallInfo.receiverName}
              receiverAvatar={socketCallInfo.receiverAvatar}
              isVideoCall={socketCallInfo.isVideoCall}
              isIncomingCall={socketCallInfo.receiverId === userId}
              onAccept={handleAcceptCall}
              onReject={handleRejectCall}
            />
          )}
        </div>
      )}
    </>
  )
}
