import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Incoming from './components/Incoming'
import { AppContext } from '@/contexts/app.context'
import VideoContainer from './components/VideoContainer'
import { getSocket } from '@/utils/socket'
import Peer, { SignalData } from 'simple-peer'
import { toast } from 'sonner'

type PeerData = {
  stream: MediaStream | null
  peerConnection: Peer.Instance | null
}

export default function CallingPopup() {
  const [onCall, setOnCall] = useState<boolean>(false)
  const { userId, localStream, setLocalStream, socketCallInfo, setSocketCallInfo } = useContext(AppContext)
  const localStreamRef = useRef<MediaStream | null>(null)
  const [peer, setPeer] = useState<PeerData | null>(null)

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) return localStream
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === 'videoinput')

        const st = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            deviceId: videoDevices.length > 0 ? videoDevices[0].deviceId : undefined,
            width: { ideal: 1280, min: 640, max: 1920 },
            height: { ideal: 720, min: 360, max: 1080 },
            frameRate: { ideal: 30, min: 15, max: 60 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined
          }
        })
        if (setLocalStream) setLocalStream(st)
        return st
      } catch (error) {
        toast.error(`Calling failed`, {
          position: 'bottom-right',
          description: 'Permission denied or error getting media stream.'
        })
        if (setLocalStream) setLocalStream(null)
        return null
      }
    },
    [localStream]
  )

  useEffect(() => {
    if (localStream) {
      localStreamRef.current = localStream
    }
  }, [localStream])

  useEffect(() => {
    const socket = getSocket()
    if (socket) {
      socket.on('incoming call', (response) => {
        if (!setSocketCallInfo) {
          return
        }
        setSocketCallInfo({
          isVideoCall: response.isVideoCall,
          receiverId: response.receiverId,
          receiverName: response.receiverName,
          receiverAvatar: response.receiverAvatar,
          senderId: response.senderId
        })
      })

      socket.on('reject call', () => {
        if (!setSocketCallInfo) {
          return
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop())
          localStreamRef.current = null
        }
        setSocketCallInfo(null)
      })

      socket.on(
        'webrtc signal',
        async (data: { sdp: SignalData; isCaller: boolean; senderId: string; receiverId: string }) => {
          if (peer) {
            peer.peerConnection?.signal(data.sdp)
            return
          }

          const stream = localStreamRef.current ?? (await getMediaStream())
          if (!stream) {
            console.log('No local media stream available for call setup.')
            return
          }

          console.log('Received WebRTC signal:', data.sdp, localStream)
          const newPeer = createPeer(stream, false)
          setPeer({ stream: null, peerConnection: newPeer })

          newPeer.on('signal', (d: SignalData) => {
            const socket = getSocket()
            if (socket) {
              socket.emit('webrtc signal', {
                sdp: d,
                isCaller: true,
                senderId: socketCallInfo?.senderId,
                receiverId: socketCallInfo?.receiverId
              })
            }
          })

          setOnCall(true)
        }
      )
    }
  }, [localStream, onCall])

  const handleHangupCall = () => {
    console.log('Call ended')
  }

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302'
          ]
        }
      ]

      const peerTmp = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers }
      })

      peerTmp.on('stream', (remoteStream: MediaStream) => {
        console.log('Received remote stream', remoteStream)
        setPeer((prev) => {
          if (prev) return { ...prev, stream: remoteStream }
          return { stream: remoteStream, peerConnection: peerTmp }
        })
      })
      peerTmp.on('error', (err) => {
        console.error('Peer error:', err)
      })
      peerTmp.on('close', () => {
        handleHangupCall()
      })

      const rtcPeerConnnection: RTCPeerConnection = (peerTmp as Peer.Instance & { _pc: RTCPeerConnection })._pc

      rtcPeerConnnection.oniceconnectionstatechange = () => {
        if (
          rtcPeerConnnection.iceConnectionState === 'disconnected' ||
          rtcPeerConnnection.iceConnectionState === 'failed' ||
          rtcPeerConnnection.iceConnectionState === 'closed'
        ) {
          handleHangupCall()
        }
      }

      return peerTmp
    },
    [setPeer]
  )

  const handleAcceptCall = async () => {
    setOnCall(true)
    const stream = await getMediaStream()
    if (!stream) {
      toast.error('Failed to get media stream. Please check your camera and microphone permissions.')
      return
    }

    console.log('Accepting call with stream:', stream)
    const newPeer = createPeer(stream, true)
    const socket = getSocket()
    setPeer({ stream: null, peerConnection: newPeer })

    newPeer.on('signal', async (data: SignalData) => {
      console.log('isCaller false - signaling with peer:', data)
      if (socket) {
        socket.emit('webrtc signal', {
          sdp: data,
          isCaller: false,
          senderId: socketCallInfo?.senderId,
          receiverId: socketCallInfo?.receiverId
        })
      }
    })
  }

  const handleRejectCall = () => {
    const socket = getSocket()
    setOnCall(false)

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
    if (setSocketCallInfo) {
      setSocketCallInfo(null)
    }
    if (socket && socketCallInfo) {
      socket.emit('reject call', {
        senderId: userId,
        receiverId: socketCallInfo.senderId === userId ? socketCallInfo.receiverId : socketCallInfo.senderId
      })
    }
  }

  return (
    <>
      {socketCallInfo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          {onCall ? (
            <div className='relative w-1/2 h-1/2 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
              {localStream && <VideoContainer stream={localStream ?? null} isLocalStream={true} />}
              {peer && peer.peerConnection?.streams && (
                <VideoContainer stream={peer.peerConnection?.streams[0] ?? null} isLocalStream={false} />
              )}
            </div>
          ) : (
            <Incoming
              receiverName={socketCallInfo?.receiverName ?? 'Unknown'}
              receiverAvatar={socketCallInfo?.receiverAvatar ?? ''}
              isVideoCall={socketCallInfo?.isVideoCall ?? true}
              isIncomingCall={socketCallInfo?.receiverId === userId}
              onAccept={handleAcceptCall}
              onReject={handleRejectCall}
            />
          )}
        </div>
      )}
    </>
  )
}
